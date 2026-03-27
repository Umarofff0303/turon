import { useEffect, useMemo, useState } from "react";
import { getAllOrders } from "../api/orders.api";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { useAppStore } from "../store/app.store";
import { formatPrice } from "../lib/format";
import LoadingSpinner from "../components/common/LoadingSpinner";

const StatCard = ({ title, value }) => (
  <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
    <p className="text-sm text-slate-500">{title}</p>
    <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</h2>
  </article>
);

const AdminDashboardPage = () => {
  const adminKey = useAppStore((state) => state.adminKey);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersData, productsData, categoriesData] = await Promise.all([
          getAllOrders(adminKey),
          getProducts(),
          getCategories(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [adminKey]);

  const pendingOrders = useMemo(
    () => orders.filter((item) => ["pending", "confirmed", "cooking", "on_the_way"].includes(item.status)).length,
    [orders]
  );

  const revenue = useMemo(
    () => orders.filter((item) => item.status !== "cancelled").reduce((sum, item) => sum + item.totalPrice, 0),
    [orders]
  );

  if (loading) {
    return <LoadingSpinner label="Dashboard yuklanmoqda..." />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Jami buyurtmalar" value={orders.length} />
        <StatCard title="Faol buyurtmalar" value={pendingOrders} />
        <StatCard title="Mahsulotlar" value={products.length} />
        <StatCard title="Kategoriyalar" value={categories.length} />
      </div>

      <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Umumiy tushum (cancelledsiz)</p>
        <h3 className="mt-2 font-display text-3xl font-bold text-emerald-700">{formatPrice(revenue)}</h3>
      </article>
    </div>
  );
};

export default AdminDashboardPage;
