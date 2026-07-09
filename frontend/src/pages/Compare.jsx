import { useState } from 'react'
import { Link } from 'react-router-dom'

function Compare({ compareList, toggleCompare, getImageUrl, addToCart }) {
  const [showOnlyDiff, setShowOnlyDiff] = useState(false)

  if (!compareList || compareList.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
        <h1 className="text-4xl font-black mb-8">Comparison</h1>
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
          <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          <h2 className="text-2xl font-black opacity-50 uppercase tracking-widest">EMPTY_MATRIX</h2>
          <p className="mt-4 text-sm font-bold opacity-50">Add hardware from the catalog to compare specifications.</p>
          <Link to="/catalog" className="mt-8 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-80 transition-opacity">
            Browse Catalog
          </Link>
        </div>
      </main>
    )
  }

  // 1. Extract all unique specification keys across all products in the compare list
  const allSpecs = Array.from(new Set(
    compareList.flatMap(p => Object.keys(p.specifications || {}))
  ));

  // 2. Pre-calculate which specifications have differences
  const specDiffStatus = {};
  allSpecs.forEach(key => {
    const values = compareList.map(p => String(p.specifications?.[key] || '-').trim());
    const uniqueValues = new Set(values);
    specDiffStatus[key] = uniqueValues.size > 1; // True if there are differences
  });

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <h1 className="text-4xl font-black">Comparison</h1>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={showOnlyDiff}
            onChange={(e) => setShowOnlyDiff(e.target.checked)}
            className="w-5 h-5 appearance-none border-2 border-black dark:border-white checked:bg-black dark:checked:bg-white checked:after:content-['✓'] checked:after:text-white dark:checked:after:text-black checked:after:block checked:after:text-center checked:after:text-sm focus:outline-none transition-colors rounded" 
          />
          <span className="font-bold text-sm uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">Only differences</span>
        </label>
      </div>
      
      {/* Comparison Matrix */}
      <div className="overflow-x-auto border-2 border-gray-200 dark:border-gray-800 rounded-3xl hide-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-[800px]">
          
          {/* Hardware Cards Row */}
          <thead>
            <tr>
              <th className="p-6 border-b border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 w-64 min-w-[200px] align-top sticky left-0 z-20">
                <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Specifications</span>
              </th>
              
              {compareList.map(product => (
                <th key={product.id} className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black min-w-[300px] align-top relative group">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => toggleCompare(product)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-red-500 hover:text-white transition-colors z-10"
                    title="Remove from comparison"
                  >✕</button>
                  
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block h-40 bg-gray-50 dark:bg-gray-900 rounded-xl mb-4 p-4 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                      <span className="text-4xl opacity-20">📷</span>
                    )}
                  </Link>
                  
                  {/* Info */}
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{product.category?.name}</div>
                  <Link to={`/product/${product.id}`} className="block font-bold text-lg leading-tight mb-4 hover:underline underline-offset-4">
                    {product.name}
                  </Link>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-black text-2xl">${Number(product.price).toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock < 1}
                      className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-80 disabled:opacity-30 disabled:hover:opacity-30 transition-opacity"
                    >
                      Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Specifications Rows */}
          <tbody>
            {allSpecs.map(key => {
              // Hide row if "Only differences" is checked and there are no differences
              if (showOnlyDiff && !specDiffStatus[key]) return null;

              return (
                <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="p-4 border-b border-r border-gray-200 dark:border-gray-800 font-bold text-sm bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)]">
                    {key}
                  </td>
                  
                  {compareList.map(product => {
                    const value = product.specifications?.[key];
                    return (
                      <td key={`${product.id}-${key}`} className="p-4 border-b border-gray-200 dark:border-gray-800 text-sm">
                        {value ? (
                          <span className="font-medium text-gray-700 dark:text-gray-300">{value}</span>
                        ) : (
                          <span className="opacity-30 font-bold">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Compare