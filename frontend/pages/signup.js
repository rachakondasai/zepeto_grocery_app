import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Signup() {
  return (
    <Layout>
      <Navbar />
      <div className="py-16">
        <h1 className="text-3xl font-bold">Signup</h1>
        <p className="mt-2 text-gray-700">Skeleton page for Signup.</p>
      </div>
    </Layout>
  );
}
