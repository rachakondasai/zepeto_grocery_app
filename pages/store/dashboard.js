import { useEffect, useState } from 'react';

export default function StoreDashboard() {
  const [orders, setOrders] = useState([]);
  const storeId = 'demo-store-id'; // Replace with real store id from auth

  useEffect(() => {
    fetch(`/api/orders?storeId=${storeId}`)
      .then(res => res.json())
      .then(setOrders);
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status })
    });
    setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Store Dashboard</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded shadow p-4">
            <div className="mb-2 font-semibold">Order from: {order.user?.email || 'User'}</div>
            <div className="mb-2">Address: {order.address}</div>
            <div className="mb-2">Status: <span className="font-bold">{order.status}</span></div>
            <div className="mb-2">Items:
              <ul className="list-disc ml-6">
                {order.items.map(i => (
                  <li key={i.item?._id}>{i.item?.name} x {i.quantity}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 mt-2">
              {order.status === 'pending' && (
                <>
                  <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => updateStatus(order._id, 'accepted')}>Accept</button>
                  <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => updateStatus(order._id, 'declined')}>Decline</button>
                </>
              )}
              {/* PDF download placeholder */}
              {order.status === 'accepted' && (
                <a
                  href={`/api/order-sheet?orderId=${order._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Download Order Sheet (PDF)
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
