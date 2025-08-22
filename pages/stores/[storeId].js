import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function StoreItems() {
  const router = useRouter();
  const { storeId } = router.query;
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/stores`)
      .then(res => res.json())
      .then(stores => setStore(stores.find(s => s._id === storeId)));
    fetch(`/api/items?storeId=${storeId}`)
      .then(res => res.json())
      .then(setItems);
  }, [storeId]);

  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(i => i.item._id === item._id);
      if (found) {
        return prev.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setCart(prev => prev.map(i => i.item._id === itemId ? { ...i, quantity } : i));
  };

  const handleCheckout = () => {
    // Save cart and store to localStorage and redirect to /checkout
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('store', JSON.stringify(store));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button className="mb-4 text-green-700 underline" onClick={() => router.back()}>&larr; Back to Stores</button>
      {store && <h1 className="text-2xl font-bold text-green-700 mb-4">{store.name}</h1>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded shadow p-4 flex flex-col">
            <h2 className="text-lg font-semibold text-green-800">{item.name}</h2>
            <p className="text-gray-600 mb-2">${item.price}</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => addToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        {cart.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}
        {cart.map(({ item, quantity }) => (
          <div key={item._id} className="flex items-center justify-between mb-2">
            <span>{item.name}</span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => updateQuantity(item._id, parseInt(e.target.value) || 1)}
              className="w-16 border rounded px-2 py-1 ml-2"
            />
          </div>
        ))}
        {cart.length > 0 && (
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={handleCheckout}>
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}
