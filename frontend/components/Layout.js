export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
