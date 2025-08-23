#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
PAGE="$ROOT/frontend/pages/products.js"

mkdir -p "$(dirname "$PAGE")"

cat > "$PAGE" <<'EOF'
import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/product-service/products").then(res => setItems(res.data)).catch(() => setItems([]));
  }, []);

  const search = async (e) => {
    e.preventDefault();
    const url = q ? `/product-service/search?q=${encodeURIComponent(q)}` : "/product-service/products";
    const { data } = await api.get(url);
    setItems(data);
  };

  return (
    <Layout>
      <Navbar />
      <div className="py-10">
        <div className="flex items-center gap-2 mb-6">
          <form onSubmit={search} className="flex gap-2">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search products…"
              className="border rounded px-3 py-2 w-64"
            />
            <button className="bg-emerald-600 text-white px-4 py-2 rounded">Search</button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p.id} className="rounded-2xl border bg-white p-5">
              <div className="text-sm text-gray-500">{p.category}</div>
              <div className="text-xl font-semibold">{p.name}</div>
              <div className="text-gray-700 mt-1">₹ {p.price} / {p.unit}</div>
              <div className="text-gray-500 text-sm mt-1">Store: {p.storeName}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
EOF

echo "✅ Frontend products page wired to API."
