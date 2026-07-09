import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchCategories } from '../api/hardwareApi'

function Home({ addToCart, getImageUrl, favorites, toggleFavorite, compareList, toggleCompare }) {
  // React Query implementation
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    // Handle outside click for dropdown
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loadingProducts || loadingCategories) {
    return <div className="flex h-64 items-center justify-center font-black animate-pulse text-2xl tracking-widest">LOADING_SYSTEM...</div>;
  }

  // Intelligent Search Algorithm
  const query = searchQuery.toLowerCase();
  
  // 1. Search Categories
  const categoryResults = categories.filter(c => 
    c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query)
  );

  // 2. Search Products
  const productResults = products.filter(p => {
    const inName = p.name.toLowerCase().includes(query);
    const inDesc = p.description && p.description.toLowerCase().includes(query);
    const inCat = p.category?.name.toLowerCase().includes(query);
    
    let inSpecs = false;
    if (p.specifications) {
      inSpecs = Object.values(p.specifications).some(val => 
        String(val).toLowerCase().includes(query)
      );
    }
    return inName || inDesc || inCat || inSpecs;
  });

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      if (categoryResults.length > 0) {
        navigate(`/catalog?category=${encodeURIComponent(categoryResults[0].name)}`);
      } else if (productResults.length > 0) {
        navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Hero Section */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 md:p-16 text-center mb-16 relative" ref={searchRef}>
        <h1 className="text-4xl md:text-6xl font-black mb-6">Find Your Hardware.</h1>
        
        <div className="max-w-2xl mx-auto relative z-20">
          <span className="absolute inset-y-0 left-5 flex items-center text-2xl opacity-50">🔍</span>
          <input 
            type="text" 
            placeholder="Search categories, GPUs, processors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-white dark:bg-black rounded-2xl py-5 pl-14 pr-6 font-bold text-lg focus:outline-none shadow-lg border border-transparent focus:border-black dark:focus:border-white transition-all"
          />
          
          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-left">
              {(categoryResults.length === 0 && productResults.length === 0) ? (
                <div className="p-6 text-center opacity-50 font-bold">No results found</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {/* Render Category Matches */}
                  {categoryResults.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-2">
                      <span className="text-xs font-black uppercase opacity-50 ml-2 tracking-widest">Categories</span>
                      {categoryResults.slice(0, 2).map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => navigate(`/catalog?category=${encodeURIComponent(cat.name)}`)}
                          className="w-full text-left flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-black rounded-xl transition-colors mt-1"
                        >
                          <span className="text-2xl">🗂️</span>
                          <span className="font-bold">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Product Matches */}
                  {productResults.length > 0 && (
                     <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs font-black uppercase opacity-50 ml-2 tracking-widest">Products</span>
                        {productResults.slice(0, 5).map(item => (
                          <Link 
                            to={`/product/${item.id}`} 
                            key={item.id}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors mt-1"
                          >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex-shrink-0">
                              {item.image_url ? <img src={getImageUrl(item.image_url)} className="w-full h-full object-contain" /> : '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm truncate">{item.name}</div>
                              <div className="text-xs opacity-50 font-bold mt-1">{item.category?.name}</div>
                            </div>
                            <div className="font-black text-right">
                              ${Number(item.price).toFixed(2)}
                            </div>
                          </Link>
                        ))}
                     </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Section */}
      <h2 className="text-3xl font-black mb-8">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map(product => {
          const isFav = favorites.find(p => p.id === product.id);
          const isComp = compareList.find(p => p.id === product.id);

          return (
          <div key={product.id} className="relative group bg-gray-50 dark:bg-gray-900 p-5 rounded-3xl flex flex-col transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
            
            <div className="absolute top-0 left-0 h-full w-4 border-l-4 border-t-4 border-b-4 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:-translate-x-1 rounded-l-2xl pointer-events-none z-10"></div>
            <div className="absolute top-0 right-0 h-full w-4 border-r-4 border-t-4 border-b-4 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-1 rounded-r-2xl pointer-events-none z-10"></div>

            <div className="relative block h-48 bg-white dark:bg-black rounded-2xl mb-5 flex items-center justify-center overflow-hidden">
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                <button 
                  onClick={() => toggleFavorite(product)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border ${isFav ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white/70 text-black border-transparent hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black'}`}
                  title="Favorite"
                >
                  {isFav ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  )}
                </button>
                <button 
                  onClick={() => toggleCompare(product)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border ${isComp ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white/70 text-black border-transparent hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black'}`}
                  title="Compare"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </button>
              </div>

              <Link to={`/product/${product.id}`} className="w-full h-full cursor-pointer flex items-center justify-center p-4">
                {product.image_url ? (
                  <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl opacity-20">📷</span>
                )}
              </Link>
            </div>

            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{product.category?.name}</div>
            <Link to={`/product/${product.id}`} className="mb-2 flex-grow cursor-pointer">
              <h3 className="font-bold text-lg leading-tight group-hover:underline underline-offset-4 decoration-2">{product.name}</h3>
            </Link>
            <div className="flex items-end justify-between mt-4">
              <span className="font-black text-2xl">${Number(product.price).toFixed(2)}</span>
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock < 1}
                className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-transform z-20 relative"
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          </div>
        )})}
      </div>
    </main>
  )
}

export default Home