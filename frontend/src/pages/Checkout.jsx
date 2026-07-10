import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from "@clerk/react"

function Checkout({ cart, cartTotal, setCart, getImageUrl }) {
  const navigate = useNavigate()
  const { getToken, isSignedIn } = useAuth()

  // FORM STATE FOR SHIPPING DETAILS (ADDED COUNTRY, PHONE CODE, AND PHONE NUMBER)
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+34',
    phoneNumber: '',
    country: '',
    address: '',
    city: '',
    postalCode: ''
  })

  // REDIRECT IF CART IS EMPTY
  if (cart.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center animate-[fadeIn_0.3s_ease-out]">
        <h1 className="text-4xl font-black mb-6">Your cart is empty</h1>
        <p className="text-gray-500 font-bold mb-8">Add some hardware before proceeding to checkout.</p>
        <Link to="/catalog" className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-bold hover:opacity-80 transition">
          Back to Catalog
        </Link>
      </main>
    )
  }

  // HANDLE FORM INPUT CHANGES
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // FINAL SUBMIT FUNCTION WITH CLERK AUTHENTICATION
  const submitOrder = async (e) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      alert("Please sign in to place an order!")
      return
    }

    try {
      console.log("STEP 1: Requesting token...")
      const token = await getToken()

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost';
      console.log("STEP 2: Sending order data with shipping details...");
      const response = await fetch(`${API_BASE_URL}/api/v1/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ 
    })
});

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      
      alert(`Success! ${data.message}`)
      
      // CLEAR CART AND REDIRECT TO HOME
      setCart([])
      navigate('/')

    } catch (error) {
      console.error("CHECKOUT ERROR:", error)
      alert("An error occurred during checkout. Please try again.")
    }
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-4xl font-black mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: SHIPPING FORM */}
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-black mb-6">Shipping Details</h2>
            
            <form id="checkout-form" onSubmit={submitOrder} className="space-y-4">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">First Name</label>
                  <input required type="text" name="firstName" value={shippingData.firstName} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Last Name</label>
                  <input required type="text" name="lastName" value={shippingData.lastName} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Email</label>
                  <input required type="email" name="email" value={shippingData.email} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Phone</label>
                  <div className="flex gap-2">
                    <select name="phoneCode" value={shippingData.phoneCode} onChange={handleInputChange} className="w-1/3 bg-white dark:bg-black rounded-xl py-3 px-2 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors">
                      <option value="+34">+34 (ES)</option>
                      <option value="+380">+380 (UA)</option>
                      <option value="+66">+66 (TH)</option>
                      <option value="+1">+1 (US/CA)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+48">+48 (PL)</option>
                      <option value="+49">+49 (DE)</option>
                    </select>
                    <input required type="tel" name="phoneNumber" value={shippingData.phoneNumber} onChange={handleInputChange} className="w-2/3 bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="123 456 789" />
                  </div>
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Country</label>
                <input required type="text" name="country" value={shippingData.country} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Address</label>
                <input required type="text" name="address" value={shippingData.address} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              </div>

              {/* City & Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">City</label>
                  <input required type="text" name="city" value={shippingData.city} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Postal Code</label>
                  <input required type="text" name="postalCode" value={shippingData.postalCode} onChange={handleInputChange} className="w-full bg-white dark:bg-black rounded-xl py-3 px-4 font-bold border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="w-full lg:w-[400px] xl:w-[450px]">
          <div className="bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-8 sticky top-32">
            <h2 className="text-2xl font-black mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-xl p-2 flex-shrink-0">
                    {item.image_url ? <img src={getImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-contain" /> : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-black">
                    ${(Number(item.price) * (item.quantity || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-500">Subtotal</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-500">Shipping</span>
                <span className="font-bold text-green-500">Free</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              form="checkout-form"
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:opacity-80 transition active:scale-[0.98]"
            >
              Place Order
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Checkout 