import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-10">
      <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-emerald-600">Grocery</Link>
        <div className="flex gap-4 text-gray-700">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/login" className="text-emerald-600 font-semibold">Login</Link>
        </div>
      </div>
    </nav>
  );
}
