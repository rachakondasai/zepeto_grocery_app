import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Navbar />
      <section className="text-center py-20">
        <h1 className="text-5xl font-extrabold text-emerald-600">Grocery App</h1>
        <p className="mt-4 text-gray-600">Next.js + Spring Boot microservices (skeleton)</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Feature title="Auth" desc="Signup, login, JWT (coming soon)" />
          <Feature title="Products" desc="Browse groceries & veggies" />
          <Feature title="Orders" desc="Add to cart & place orders" />
        </div>
      </section>
    </Layout>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border bg-white p-6 text-left">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}
