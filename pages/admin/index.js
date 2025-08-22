import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(setStores);
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, owner, address })
    });
    if (res.ok) {
      setMessage('Store added!');
      setName(''); setOwner(''); setAddress('');
      fetch('/api/stores').then(res => res.json()).then(setStores);
    } else {
      setMessage('Failed to add store.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Admin Panel</h1>
      <form onSubmit={handleAddStore} className="bg-white rounded shadow p-6 mb-8 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New Store</h2>
        <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Store Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Owner User ID" value={owner} onChange={e => setOwner(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Add Store</button>
        {message && <div className="mt-2 text-green-700">{message}</div>}
      </form>
      <h2 className="text-lg font-semibold mb-2">All Stores</h2>
      <ul className="space-y-2">
        {stores.map(store => (
          <li key={store._id} className="bg-white rounded shadow p-4">
            <div className="font-bold">{store.name}</div>
            <div className="text-sm text-gray-600">Owner: {store.owner?.email || store.owner}</div>
            <div className="text-sm text-gray-500">{store.address}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
