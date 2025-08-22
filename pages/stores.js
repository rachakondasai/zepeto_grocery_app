import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Stores() {
  const [stores, setStores] = useState([]);
  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(setStores);
  }, []);
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Browse Stores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stores.map(store => (
          <Link key={store._id} href={`/stores/${store._id}`} legacyBehavior>
            <a className="block bg-white rounded shadow p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-green-800 mb-2">{store.name}</h2>
              <p className="text-gray-600">Owner: {store.owner?.email || 'N/A'}</p>
              <p className="text-gray-500 text-sm mt-2">{store.address}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
