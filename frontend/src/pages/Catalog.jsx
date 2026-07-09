import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchCategories } from '../api/hardwareApi'

function Catalog({ addToCart, getImageUrl, favorites, toggleFavorite, compareList, toggleCompare }) {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const loading = loadingProducts || loadingCategories;
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('relevance');
  
  const [activeFilters, setActiveFilters] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setActiveFilters({});
    setOpenDropdown(null);
  }, [selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center font-black animate-pulse text-2xl tracking-widest">LOADING_HARDWARE...</div>;

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      searchParams.set('search', value);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleFilterChange = (specKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [specKey]: value
    }));
    setOpenDropdown(null);
  };

  if (!selectedCategory && !searchQuery) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
        <div className="relative mb-12 max-w-2xl">
          <span className="absolute inset-y-0 left-4 flex items-center text-xl opacity-50">🔍</span>
          <input 
            type="text" 
            placeholder="Search all hardware, specs, or brands..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-2xl py-4 pl-12 pr-4 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all border border-transparent"
          />
        </div>

        <h1 className="text-4xl font-black mb-8">Hardware Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSearchParams({ category: cat.name })}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-transparent hover:border-black dark:hover:border-white transition-all text-left flex flex-col justify-between aspect-square group"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">
                {cat.slug?.includes('laptop') ? '💻' : cat.slug?.includes('processor') ? '🧠' : cat.slug?.includes('graphic') ? '🎮' : cat.slug?.includes('memory') ? '⚡' : '📦'}
              </span>
              <span className="font-black text-lg leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </main>
    )
  }

  const baseProducts = selectedCategory 
    ? products.filter(p => p.category?.name === selectedCategory)
    : products;
  
  const specKeys = Array.from(new Set(
    baseProducts.flatMap(p => Object.keys(p.specifications || {}))
  ));

  const getParsedUniqueValuesForSpec = (key) => {
    const rawValues = baseProducts
      .map(p => p.specifications?.[key])
      .filter(val => val !== undefined && val !== null && val !== '');

    const parsedValues = new Set();
    rawValues.forEach(val => {
      String(val).split(/[/,]/).forEach(part => {
        const trimmed = part.trim();
        if (trimmed) parsedValues.add(trimmed);
      });
    });
    return Array.from(parsedValues).sort();
  };

  let displayedProducts = baseProducts.filter(p => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const inName = p.name.toLowerCase().includes(query);
      const inDesc = p.description && p.description.toLowerCase().includes(query);
      const inCat = p.category?.name?.toLowerCase().includes(query);
      
      let inSpecs = false;
      if (p.specifications) {
        inSpecs = Object.values(p.specifications).some(val => 
          String(val).toLowerCase().includes(query)
        );
      }
      if (!inName && !inDesc && !inCat && !inSpecs) return false;
    }

    for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
      if (filterValue && filterValue !== "Any") {
        const productSpecVal = p.specifications?.[filterKey];
        if (!productSpecVal || !String(productSpecVal).includes(filterValue)) {
          return false;
        }
      }
    }
    return true;
  });

  displayedProducts.sort((a, b) => {
    const aStock = a.stock > 0;
    const bStock = b.stock > 0;
    if (aStock !== bStock) return aStock ? -1 : 1;

    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    return 0; 
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-[fadeIn_0.3s_ease-out] flex flex-col md:flex-row gap-8">
      <aside className="hidden md:block w-64 flex-shrink-0" ref={dropdownRef}>
        <div className="sticky top-24">
          <h3 className="font-black text-2xl mb-4 leading-tight">Categories</h3>
          
          <div className="flex flex-col gap-3 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
            <button 
              onClick={() => setSearchParams({})} 
              className={`text-left font-bold transition-colors ${!selectedCategory && !searchQuery ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
            >
              All Hardware
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.name })}
                className={`text-left font-bold transition-colors ${selectedCategory === cat.name ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-8">
             <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Filters</p>
             {Object.values(activeFilters).some(val => val && val !== "Any") && (
                <button 
                  onClick={() => setActiveFilters({})}
                  className="text-xs font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                  Reset
                </button>
             )}
          </div>
          
          <div className="space-y-4 relative">
            {specKeys.length > 0 ? (
              specKeys.map(specKey => {
                const options = getParsedUniqueValuesForSpec(specKey);
                if (options.length < 2 && (!activeFilters[specKey] || activeFilters[specKey] === "Any")) return null;
                
                const isOpen = openDropdown === specKey;
                const currentValue = activeFilters[specKey] || "Any";

                return (
                  <div key={specKey} className="relative flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-3">
                    <span className="font-bold mr-4 flex-shrink-0">{specKey}</span>
                    <button 
                      onClick={() => setOpenDropdown(isOpen ? null : specKey)}
                      className={`font-bold flex items-center gap-2 max-w-[140px] px-2 py-1 rounded-md transition-colors ${isOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                    >
                      <span className="truncate">{currentValue}</span>
                      <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl shadow-xl z-50 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                        <div className="max-h-64 overflow-y-auto">
                          <button 
                            onClick={() => handleFilterChange(specKey, "Any")}
                            className={`w-full text-left px-4 py-3 font-bold text-sm transition-colors ${currentValue === "Any" ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                          >
                            Any
                          </button>
                          {options.map(opt => (
                            <button 
                              key={opt}
                              onClick={() => handleFilterChange(specKey, opt)}
                              className={`w-full text-left px-4 py-3 font-bold text-sm transition-colors ${currentValue === opt ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm opacity-50 font-bold">No dynamic filters available.</p>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-4 flex items-center text-xl opacity-50">🔍</span>
          <input 
            type="text" 
            placeholder={selectedCategory ? `Search in ${selectedCategory}...` : "Refine search..."} 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-2xl py-4 pl-12 pr-4 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all border border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button onClick={() => setSortBy('relevance')} className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${sortBy === 'relevance' ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white'}`}>Relevance</button>
          <button onClick={() => setSortBy('price-desc')} className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${sortBy === 'price-desc' ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white'}`}>High to Low</button>
          <button onClick={() => setSortBy('price-asc')} className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${sortBy === 'price-asc' ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white'}`}>Low to High</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {displayedProducts.length === 0 ? (
             <div className="col-span-full text-center py-20 font-black text-4xl opacity-20 tracking-widest">NOT_FOUND</div>
          ) : (
            displayedProducts.map(product => {
              const isFav = favorites?.find(p => p.id === product.id);
              const isComp = compareList?.find(p => p.id === product.id);

              return (
                <div key={product.id} className={`relative group bg-white dark:bg-black p-5 rounded-3xl flex flex-col transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 ${product.stock < 1 ? 'opacity-60' : ''}`}>
                  
                  <div className="absolute top-0 left-0 h-full w-4 border-l-4 border-t-4 border-b-4 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:-translate-x-1 rounded-l-2xl pointer-events-none z-10"></div>
                  <div className="absolute top-0 right-0 h-full w-4 border-r-4 border-t-4 border-b-4 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-1 rounded-r-2xl pointer-events-none z-10"></div>

                  <div className="relative block h-48 bg-gray-50 dark:bg-gray-900/50 rounded-2xl mb-5 flex items-center justify-center overflow-hidden">
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
                        <img src={getImageUrl(product.image_url)} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${product.stock > 0 ? 'group-hover:scale-105' : 'grayscale'}`} />
                      ) : (
                        <span className="text-4xl opacity-20">📷</span>
                      )}
                    </Link>
                  </div>
                  
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                    {product.category?.name}
                  </div>

                  <Link to={`/product/${product.id}`} className="mb-2 flex-grow">
                    <h3 className="font-bold text-lg leading-tight group-hover:underline underline-offset-4 decoration-2">{product.name}</h3>
                  </Link>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="font-black text-2xl">${Number(product.price).toFixed(2)}</span>
                      <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${product.stock > 0 ? 'opacity-50' : 'text-red-500'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock < 1}
                      className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-transform z-20"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default Catalog;