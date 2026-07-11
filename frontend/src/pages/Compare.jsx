import { useState } from 'react';
import { Link } from 'react-router-dom';

function Compare({ addToCart, getImageUrl, compareList, toggleCompare }) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  if (!compareList || compareList.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 flex flex-col items-center justify-center min-h-[60vh] animate-[fadeIn_0.3s_ease-out]">
        <div className="text-6xl mb-6 opacity-20">⚖️</div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-center">Compare is Empty</h1>
        <p className="text-gray-500 font-bold mb-8 text-center max-w-md">
          Add up to 4 products to compare their specifications side-by-side.
        </p>
        <Link to="/catalog" className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl">
          Browse Catalog
        </Link>
      </main>
    );
  }

  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specifications || {})))
  );

  // Визначаємо, де характеристики відрізняються
  const specDifferences = allSpecKeys.reduce((acc, key) => {
    const values = compareList.map(p => p.specifications?.[key] || 'N/A');
    const isDifferent = new Set(values).size > 1;
    acc[key] = isDifferent;
    return acc;
  }, {});

  const displayedKeys = onlyDifferences 
    ? allSpecKeys.filter(key => specDifferences[key])
    : allSpecKeys;

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-[fadeIn_0.3s_ease-out] pb-32 md:pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-black">Comparison</h1>
        
        {compareList.length > 1 && (
          <label className="flex items-center gap-3 cursor-pointer group w-fit bg-gray-50 dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${onlyDifferences ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-700'}`}>
              {onlyDifferences && (
                <svg className="w-4 h-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="font-bold text-sm tracking-wider uppercase">Only Differences</span>
          </label>
        )}
      </div>

      {/* Table Container*/}
      <div className="bg-white dark:bg-black rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            
            <thead>
              <tr>
                <th className="p-6 border-b border-r border-gray-200 dark:border-gray-800 w-1/4 bg-gray-50 dark:bg-gray-900 align-bottom min-w-[150px] md:min-w-[200px] sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-none">
                  <span className="text-xs font-black tracking-widest uppercase opacity-50">
                    {compareList.length} Items Selected
                  </span>
                </th>
                
                {compareList.map(product => (
                  <th key={product.id} className="p-6 border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0 w-1/4 min-w-[260px] align-top relative group bg-white dark:bg-black">
                    <button 
                      onClick={() => toggleCompare(product)}
                      className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 dark:bg-gray-900 dark:hover:bg-red-900/30 rounded-full flex items-center justify-center transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    
                    <div className="flex flex-col h-full">
                      <Link to={`/product/${product.id}`} className="block h-48 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-4 flex-shrink-0 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                        {product.image_url ? (
                          <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📷</div>
                        )}
                      </Link>
                      
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                        {product.category?.name}
                      </div>
                      
                      <Link to={`/product/${product.id}`} className="font-bold text-lg md:text-xl leading-tight mb-4 hover:underline underline-offset-4 flex-grow">
                        {product.name}
                      </Link>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="font-black text-2xl">${Number(product.price).toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock < 1}
                          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-transform"
                        >
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </th>
                ))}

                {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                  <th key={`empty-header-${i}`} className="p-6 border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0 w-1/4 min-w-[260px] bg-gray-50 dark:bg-gray-900">
                     <Link to="/catalog" className="h-full min-h-[300px] flex flex-col items-center justify-center opacity-40 hover:opacity-100 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white rounded-2xl p-8 text-center transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span className="text-sm font-bold tracking-widest uppercase">Add Product</span>
                     </Link>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {displayedKeys.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(4, compareList.length + 1)} className="p-16 text-center text-gray-500 font-bold text-lg">
                    No specifications available or no differences found.
                  </td>
                </tr>
              ) : (
                displayedKeys.map((key, index) => {
                  const isDiff = specDifferences[key];
                  return (
                    <tr key={key} className={`group ${index % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-gray-900'} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}>
                      
                      <td className="p-4 px-6 border-b border-r border-gray-200 dark:border-gray-800 font-bold text-sm md:text-base tracking-wide text-gray-500 dark:text-gray-400 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-none">
                        {key}
                      </td>
                      
                      {compareList.map(product => {
                        const val = product.specifications?.[key];
                        return (
                          <td key={`${product.id}-${key}`} className={`p-4 px-6 border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0 text-sm md:text-base ${isDiff ? 'font-bold text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                            {val || <span className="opacity-30">—</span>}
                          </td>
                        )
                      })}

                      {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                        <td key={`empty-td-${i}`} className="p-4 border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0 bg-gray-50 dark:bg-gray-900"></td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Compare;