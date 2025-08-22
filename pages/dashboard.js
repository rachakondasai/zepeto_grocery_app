import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { ShoppingCartIcon } from '@heroicons/react/outline';

export default function Dashboard() {
  const router = useRouter();
  // Use undefined to distinguish between loading and loaded state
  const [user, setUser] = useState();

  useEffect(() => {
    // Only run on client
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Never allow demo-user-id
          if (parsed._id && parsed._id !== 'demo-user-id') {
            setUser(parsed);
          } else {
            setUser(null);
            localStorage.removeItem('user');
            router.replace('/login');
          }
        } catch {
          setUser(null);
          localStorage.removeItem('user');
          router.replace('/login');
        }
      } else {
        setUser(null);
        router.replace('/login');
      }
    };
    loadUser();
  }, [router]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [notif, setNotif] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user._id}`)
      .then(res => res.json())
      .then(setOrders);
    fetch('/api/all-items')
      .then(res => res.json())
      .then(setItems);
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, [user]);

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Add to cart handler
  const addToCart = (item) => {
    setCart(prev => {
      // Always store as { item, quantity }
      const existing = prev.find(i => i.item?._id === item._id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.item?._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prev, { item, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
    setNotif(`${item.name} added to cart!`);
    setTimeout(() => setNotif(''), 1200);
  };

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/login');
  };

  // Show nothing or a spinner while loading user
  if (typeof user === 'undefined') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  // If user is null, show a message or redirect to login (optional)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2 text-green-700">Not logged in</h2>
          <p className="mb-4">Please <a href="/login" className="text-green-700 underline">log in</a> to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-50 p-2 sm:p-4 md:p-6 relative">
      {/* Logout Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg px-4 py-2 focus:outline-none focus:ring font-semibold"
        onClick={handleLogout}
      >
        Logout
      </button>
      {/* Floating Cart Icon */}
      <button
        className="fixed top-4 right-4 z-50 flex items-center bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg px-4 py-2 focus:outline-none focus:ring"
        onClick={() => setShowCart(!showCart)}
        aria-label="View cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
        </svg>
        <span className="font-bold">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
      </button>
      {/* Cart Summary Modal */}
      {showCart && (
        <div className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-xl p-4 w-80 max-w-full border border-green-200 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-green-700 text-lg">Your Cart</span>
            <button className="text-gray-400 hover:text-green-700" onClick={() => setShowCart(false)}>&times;</button>
          </div>
          {cart.length === 0 ? (
            <div className="text-gray-500 text-center py-4">Cart is empty.</div>
          ) : (
            <ul className="divide-y divide-green-100 max-h-48 overflow-y-auto">
              {cart.map(({ item, quantity }) => (
                <li key={item._id} className="flex items-center py-2">
                  <img src={item.image || '/store.png'} alt={item.name} className="w-10 h-10 rounded mr-2" />
                  <div className="flex-1">
                    <div className="font-semibold text-green-800">{item.name}</div>
                    <div className="text-xs text-gray-500">x{quantity} &bull; ${item.price * quantity}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-green-700">Total:</span>
            <span className="font-bold">${cart.reduce((sum, i) => sum + (i.item?.price || 0) * i.quantity, 0)}</span>
          </div>
          <Link href="/checkout" legacyBehavior>
            <a className="block mt-4 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded font-semibold">Go to Checkout</a>
          </Link>
        </div>
      )}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-xl text-center mb-6 mt-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-700">Dashboard</h2>
        <p className="mb-2 text-sm sm:text-base">Welcome, <span className="font-semibold">{user.email}</span>!</p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
          <Link href="/stores" legacyBehavior>
            <a className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold shadow">Browse Stores</a>
          </Link>
          <Link href="/orders" legacyBehavior>
            <a className="bg-white border border-green-600 text-green-700 px-4 py-2 rounded hover:bg-green-50 font-semibold shadow">Order History</a>
          </Link>
        </div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-4xl mb-8">
        <h3 className="text-lg font-bold mb-4 text-green-700">All Groceries</h3>
        {notif && (
          <div className="mb-4 text-green-700 bg-green-100 px-4 py-2 rounded shadow text-center animate-pulse">{notif}</div>
        )}
        {Object.keys(itemsByCategory).length === 0 && <p className="text-gray-500">No items found.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-green-700 font-bold mb-2 text-xl">{category}</h4>
              <div className="grid grid-cols-2 gap-4">
                {items.map(item => (
                  <div key={item._id} className="bg-green-50 rounded-xl shadow p-4 flex flex-col items-center transition-transform hover:scale-105">
                    <img src={item.image || '/store.png'} alt={item.name} className="w-24 h-24 object-cover rounded mb-2 shadow" />
                    <div className="font-semibold text-green-800 text-center">{item.name}</div>
                    <div className="text-gray-700 mb-1">${item.price}</div>
                    <button
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring font-semibold shadow"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-xl mb-8">
        <h3 className="text-lg font-bold mb-4 text-green-700">Recent Orders</h3>
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
        <ul className="space-y-2">
          {orders.slice(0, 5).map(order => (
            <li key={order._id} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Order #{order._id.slice(-5)}</span>
                <span className="font-semibold capitalize text-green-700">{order.status}</span>
              </div>
              <div className="text-sm text-gray-600">Store: {order.store?.name || 'Store'}</div>
              <div className="text-sm text-gray-500">Items: {order.items.map(i => `${i.item?.name} x${i.quantity}`).join(', ')}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

