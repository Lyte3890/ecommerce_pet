import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProductById } from '../api/hardwareApi'

function ProductDetail({ addToCart, getImageUrl, favorites, toggleFavorite, compareList, toggleCompare }) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('description')

  // React Query implementation for single product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id)
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400 font-bold tracking-widest">LOADING_DETAILS...</div>
  if (error) return <div className="flex h-64 items-center justify-center text-red-500 dark:text-red-400 font-bold text-center px-4">{error.message}</div>
  if (!product) return null

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
    } else {
      alert('This item is currently out of stock.');
    }
  }

  const isFav = favorites.find(p => p.id === product.id);
  const isComp = compareList.find(p => p.id === product.id);

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 text-sm font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        ← Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-gray-800 rounded-3xl aspect-square flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative">
          
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button 
              onClick={() => toggleFavorite(product)}
              className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border text-xl ${isFav ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-gray-100/80 text-black border-transparent hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black'}`}
              title="Favorite"
            >
              {isFav ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              )}
            </button>
            <button 
              onClick={() => toggleCompare(product)}
              className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border text-xl ${isComp ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-gray-100/80 text-black border-transparent hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black'}`}
              title="Compare"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </button>
          </div>

          {product.image_url ? (
            <img 
              src={getImageUrl(product.image_url)} 
              alt={product.name} 
              className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500" 
            />
          ) : (
             <span className="text-9xl opacity-20">📷</span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-2">
            {product.category?.name || "GEAR"}
          </div>
          <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">{product.name}</h1>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              ${Number(product.price).toFixed(2)}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {product.stock > 0 ? `${product.stock} Units Available` : 'Out of Stock'}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="bg-black dark:bg-white text-white dark:text-black py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg active:scale-[0.98] mb-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex gap-8">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 font-bold transition-colors relative ${activeTab === 'description' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-t-full"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`pb-4 font-bold transition-colors relative ${activeTab === 'specs' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              Specifications
              {activeTab === 'specs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-t-full"></div>
              )}
            </button>
          </div>

          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {activeTab === 'description' ? (
              <div className="prose dark:prose-invert">
                {product.description ? (
                  <p className="whitespace-pre-line">{product.description}</p>
                ) : (
                  <p className="italic text-gray-400">No detailed description available for this hardware.</p>
                )}
              </div>
            ) : (
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="font-medium text-gray-500 dark:text-gray-400">SKU (Slug)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.slug}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Category</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.category?.name || "N/A"}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Condition</span>
                  <span className="font-bold text-gray-900 dark:text-white">New</span>
                </li>
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="font-medium text-gray-500 dark:text-gray-400">{key}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right max-w-[60%]">{String(value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetail