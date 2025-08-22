import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState();
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed._id && parsed._id !== 'demo-user-id') {
            setUserId(parsed._id);
          } else {
            localStorage.removeItem('user');
            router.replace('/login');
          }
        } catch {
          localStorage.removeItem('user');
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/orders?userId=${userId}`)
      .then(res => res.json())
      .then(setOrders);
  }, [userId]);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Order History</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded shadow p-4">
            <div className="mb-2 font-semibold">Store: {order.store?.name || 'Store'}</div>
            <div className="mb-2">Address: {order.address}</div>
            <div className="mb-2">Status: <span className="font-bold">{order.status}</span></div>
            <div className="mb-2">Items:
              <ul className="list-disc ml-6">
                {order.items.map(i => (
                  <li key={i.item?._id}>{i.item?.name} x {i.quantity}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
