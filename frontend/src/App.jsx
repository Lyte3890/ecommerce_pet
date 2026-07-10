import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Show, SignInButton, UserButton, useAuth } from "@clerk/react"
import Catalog from './pages/Catalog'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Favorites from './pages/Favorites'
import Compare from './pages/Compare'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'

function App() {
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [compareList, setCompareList] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const location = useLocation()

  // INITIALIZE CLERK AUTH HOOK
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`Sorry, only ${product.stock} units of ${product.name} available.`);
          return prevCart;
        }
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: Number(item.quantity) + 1 } : item
        );
      }
      if (product.stock < 1) {
        alert('This item is currently out of stock.');
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        const newQuantity = currentQty + delta;
        if (newQuantity > item.stock) {
          alert(`Cannot add more. Only ${item.stock} units available.`);
          return item;
        }
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const setExactQuantity = (productId, rawValue) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        if (rawValue === '') return { ...item, quantity: '' };
        const val = parseInt(rawValue, 10);
        if (isNaN(val)) return item;
        if (val > item.stock) {
          alert(`Cannot add more. Only ${item.stock} units available.`);
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: val };
      }
      return item;
    }));
  };

  const handleQuantityBlur = (productId, currentQuantity) => {
    if (currentQuantity === '' || Number(currentQuantity) < 1) {
      setExactQuantity(productId, 1);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 0)), 0);
  const cartCount = cart.reduce((count, item) => count + (item.quantity || 0), 0);

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) {
        alert("You can only compare up to 4 items at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost';
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans transition-colors duration-300 pb-28 md:pb-0 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      <header className="grid grid-cols-3 items-center px-4 md:px-8 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="justify-self-start">
          <Link to="/" className="text-2xl font-black tracking-tight hover:opacity-80 transition">MS</Link>
        </div>
        
        <nav className="hidden md:flex justify-self-center space-x-8 text-sm font-bold">
          <Link to="/" className={`hover:opacity-60 transition ${location.pathname === '/' ? 'border-b-2 border-black dark:border-white' : ''}`}>Home</Link>
          <Link to="/catalog" className={`hover:opacity-60 transition ${location.pathname.includes('/catalog') ? 'border-b-2 border-black dark:border-white' : ''}`}>Catalog</Link>
          <Link to="/compare" className={`hover:opacity-60 transition ${location.pathname === '/compare' ? 'border-b-2 border-black dark:border-white' : ''}`}>Compare ({compareList.length})</Link>
          <Link to="/favorites" className={`hover:opacity-60 transition ${location.pathname === '/favorites' ? 'border-b-2 border-black dark:border-white' : ''}`}>Favorites ({favorites.length})</Link>
        </nav>
        
        <div className="justify-self-end flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 transition focus:outline-none text-gray-600 dark:text-gray-300"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hidden md:flex bg-transparent border-2 border-black dark:border-white text-black dark:text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition items-center">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center justify-center w-10 h-10 hidden md:flex">
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-gray-200 dark:border-gray-800" } }} />
            </div>
          </Show>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="hidden md:flex bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition items-center gap-2"
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white dark:bg-black text-black dark:text-white px-2 py-0.5 rounded-md text-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ROUTING SYSTEM */}
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} getImageUrl={getImageUrl} favorites={favorites} toggleFavorite={toggleFavorite} compareList={compareList} toggleCompare={toggleCompare} />} />
        <Route path="/catalog" element={<Catalog addToCart={addToCart} getImageUrl={getImageUrl} favorites={favorites} toggleFavorite={toggleFavorite} compareList={compareList} toggleCompare={toggleCompare} />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} getImageUrl={getImageUrl} favorites={favorites} toggleFavorite={toggleFavorite} compareList={compareList} toggleCompare={toggleCompare} />} />
        <Route path="/favorites" element={<Favorites addToCart={addToCart} getImageUrl={getImageUrl} favorites={favorites} toggleFavorite={toggleFavorite} compareList={compareList} toggleCompare={toggleCompare} />} />
        <Route path="/compare" element={<Compare addToCart={addToCart} getImageUrl={getImageUrl} compareList={compareList} toggleCompare={toggleCompare} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout cart={cart} cartTotal={cartTotal} setCart={setCart} getImageUrl={getImageUrl} />} />
      </Routes>

      {/* SLIDE-OVER CART */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-black h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out] border-l border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-black">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-2xl hover:opacity-50">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <span className="text-5xl mb-4">🛒</span>
                  <p className="font-bold">Cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                   <div key={item.id} className="flex gap-4 items-center group">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg p-2 flex-shrink-0">
                         {item.image_url ? <img src={getImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-contain" /> : '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-sm truncate">{item.name}</h4>
                         <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                               <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 font-bold hover:bg-gray-100 dark:hover:bg-gray-800">-</button>
                               <input type="number" value={item.quantity} onChange={(e) => setExactQuantity(item.id, e.target.value)} onBlur={() => handleQuantityBlur(item.id, item.quantity)} className="w-10 text-center bg-transparent text-sm font-bold focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                               <button onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.stock} className="px-2 py-1 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                            </div>
                            <div className="font-black">${(Number(item.price) * (item.quantity || 0)).toFixed(2)}</div>
                         </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="hover:text-red-500">✕</button>
                   </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between font-black text-2xl mb-6">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:opacity-80 transition active:scale-[0.98] text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING MOBILE BOTTOM NAVIGATION (ISLANDS PATTERN) */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-40 animate-[slideUp_0.4s_ease-out] flex gap-2 h-16">
        
        {/* Island 1: Home */}
        <div className="w-[68px] bg-white dark:bg-black backdrop-blur-xl border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full rounded-3xl transition-all ${location.pathname === '/' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white'}`}>
            <svg className="w-5 h-5 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>
            <span className="text-[9px] font-bold">Home</span>
          </Link>
        </div>

        {/* Island 2: Main Features Group */}
        <div className="flex-1 bg-white dark:bg-black backdrop-blur-xl border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-evenly px-2">
          <Link to="/catalog" className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${location.pathname.includes('/catalog') ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white'}`}>
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[9px] font-bold">Catalog</span>
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center justify-center w-1/3 h-full transition-all text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white relative">
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-[9px] font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-2 w-4 h-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/favorites" className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${location.pathname === '/favorites' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white'}`}>
            <svg className="w-5 h-5 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="text-[9px] font-bold">Favs</span>
          </Link>
        </div>

        {/* Island 3: Profile */}
        <div className="w-[68px] bg-white dark:bg-black backdrop-blur-xl border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all">
                  <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-[9px] font-bold">Sign In</span>
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
               <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border border-gray-200 dark:border-gray-800" } }} />
            </Show>
          </div>
        </div>

      </nav>

      {/* GLOBAL ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(150%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}} />
    </div>
  )
}

export default App