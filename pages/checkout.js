import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [cart, setCart] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [message, setMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  // Load cart and fetch stores on mount
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      let parsed = JSON.parse(cartData);
      if (parsed.length && parsed[0]._id) {
        parsed = parsed.map(({ quantity, ...item }) => ({ item, quantity }));
        localStorage.setItem('cart', JSON.stringify(parsed));
      }
      setCart(parsed);
    }
    // Fetch stores from API
    fetch('/api/stores')
      .then(res => res.json())
      .then(data => {
        setStores(data);
        if (data.length > 0) setSelectedStore(data[0]._id);
      });
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    // Use the logged-in user's ID from localStorage (set on login)
    let user = null;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          user = JSON.parse(storedUser)._id;
        } catch {}
      }
    }
    if (!selectedStore) {
      setMessage('Please select a store.');
      return;
    }
    if (!user) {
      setMessage('User not logged in. Please log in to place an order.');
      return;
    }
    if (!address || cart.length === 0) {
      setMessage('Please enter address and add items to cart.');
      return;
    }
    const items = cart.map(({ item, quantity }) => ({ item: item._id, quantity }));
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, store: selectedStore, items, address })
    });
    if (res.ok) {
      const order = await res.json();
      setMessage('Order placed! Redirecting to order history...');
      setOrderDetails(order);
      setCart([]);
      localStorage.removeItem('cart');
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } else {
      setMessage('Order failed.');
      setOrderDetails(null);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <form onSubmit={handleOrder} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Checkout</h2>
        {orderDetails ? (
          <div className="mb-4 text-center">
            <h3 className="text-green-700 font-bold text-lg mb-2">Order Confirmation</h3>
            <div className="mb-2">Order ID: <span className="font-mono">{orderDetails._id?.slice(-6)}</span></div>
            <div className="mb-2">Store: {stores.find(s => s._id === orderDetails.store)?.name || 'Store'}</div>
            <div className="mb-2">Address: {orderDetails.address}</div>
            <div className="mb-2">Items:</div>
            <ul className="mb-2 text-left">
              {orderDetails.items?.map((entry, idx) => (
                <li key={idx}>- {cart.find(c => c.item._id === entry.item)?.item?.name || entry.item} x {entry.quantity}</li>
              ))}
            </ul>
            <div className="text-green-700 font-semibold">Thank you for your order!</div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Store</label>
              <select
                className="w-full border rounded px-3 py-2 mb-2"
                value={selectedStore}
                onChange={e => setSelectedStore(e.target.value)}
                required
              >
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
              </select>
              <label className="block mb-1 font-semibold">Delivery Address</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Cart Summary</h3>
              {cart.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}
              {cart.map(({ item, quantity }) => (
                <div key={item?._id} className="flex justify-between mb-1">
                  <span>{item?.name} x {quantity}</span>
                  <span>${(item?.price || 0) * quantity}</span>
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Place Order</button>
          </>
        )}
        {message && <div className="mt-4 text-green-700 text-center">{message}</div>}
      </form>
    </div>
  );
}
