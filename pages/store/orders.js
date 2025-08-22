import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StoreOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const storeId = localStorage.getItem('storeId');
      const res = await axios.get(`/api/store/orders?storeId=${storeId}`);
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Store Orders</h1>
      {orders.length === 0 && <p>No orders found for this store.</p>}
      <ul className="space-y-4">
        {orders.map((order, idx) => (
          <li key={idx} className="border p-4 rounded bg-white shadow-sm">
            <p><strong>User:</strong> {order.user}</p>
            <p><strong>Items:</strong></p>
            <ul className="list-disc ml-5">
              {order.items.map((item, i) => (
                <li key={i}>{item.name} x {item.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={() => window.print()} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">🖨️ Print Orders</button>
    </div>
  );
}