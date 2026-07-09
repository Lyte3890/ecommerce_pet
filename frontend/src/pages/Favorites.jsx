import { Link } from 'react-router-dom'

function Favorites({ favorites, toggleFavorite, compareList, toggleCompare, addToCart, getImageUrl }) {
  
  if (!favorites || favorites.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
        <h1 className="text-4xl font-black mb-8">Favorites</h1>
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
          <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <h2 className="text-2xl font-black opacity-50 uppercase tracking-widest">NO_FAVORITES_FOUND</h2>
          <p className="mt-4 text-sm font-bold opacity-50">You haven't saved any hardware yet.</p>
          <Link to="/catalog" className="mt-8 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-80 transition-opacity">
            Browse Catalog
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-4xl font-black mb-8">Favorites</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {favorites.map(product => {
          const isFav = favorites.find(p => p.id === product.id);
          const isComp = compareList.find(p => p.id === product.id);
          
          return (
            <div key={product.id} className="relative group bg-gray-50 dark:bg-gray-900 p-5 rounded-3xl flex flex-col transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
              
              <div className="absolute top-0 left-0 h-full w-4 border-l-4 border-t-4 border-b-4 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:-translate-x-1 rounded-l-2xl pointer-events-none z-10"></div>
              <div className="absolute top-0 right-0 h-full w-4 border-r-4 border-t-4 border-b-4 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-1 rounded-r-2xl pointer-events-none z-10"></div>

              <div className="relative block h-48 bg-white dark:bg-black rounded-2xl mb-5 flex items-center justify-center overflow-hidden">
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                  <button 
                    onClick={() => toggleFavorite(product)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border ${isFav ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white/70 text-black border-transparent hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black'}`}
                    title="Remove from Favorites"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
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
          )
        })}
      </div>
    </main>
  )
}

export default Favorites