import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function StoreLogin() {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/store/login', { storeName, password });
      if (res.data.success) {
        localStorage.setItem('storeId', res.data.storeId);
        router.push('/store/orders');
      } else {
        alert('Login failed');
      }
    } catch (err) {
      alert('Store login error');
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-xl mb-4 font-semibold">Store Login</h2>
      <input placeholder="Store Name" className="block border p-2 mb-2" onChange={e => setStoreName(e.target.value)} />
      <input placeholder="Password" type="password" className="block border p-2 mb-4" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2">Login</button>
    </div>
  );
}