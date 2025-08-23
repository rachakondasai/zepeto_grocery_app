import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Login() {
  return (
    <Layout>
      <Navbar />
      <div className="py-16">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-gray-700">Skeleton page for Login.</p>
      </div>
    </Layout>
  );
}
