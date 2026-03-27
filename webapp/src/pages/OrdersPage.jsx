import { useEffect, useState } from "react";
import { getUserOrders } from "../api/orders.api";
import { useAppStore } from "../store/app.store";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { formatPrice, statusLabel } from "../lib/format";

const OrdersPage = () => {
  const telegramUser = useAppStore((state) => state.telegramUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    if (!telegramUser?.telegramId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getUserOrders(telegramUser.telegramId);
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [telegramUser?.telegramId]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-bold text-slate-900">Buyurtmalarim</h1>
        <p className="text-sm text-slate-600">Status yangilanganda bot orqali xabar keladi.</p>
      </header>

      {loading ? <LoadingSpinner label="Buyurtmalar yuklanmoqda..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadOrders} /> : null}

      {!loading && !error && !orders.length ? (
        <EmptyState
          title="Buyurtmalar topilmadi"
          description="Birinchi buyurtmangizni Home sahifadan bering."
        />
      ) : null}

      {!loading && !error ? (
        <div className="space-y-3 pb-6">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-slate-900">#{order.orderNumber}</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">{new Date(order.createdAt).toLocaleString("uz-UZ")}</p>
              <p className="mt-1 text-sm text-slate-600">{order.items.length} ta mahsulot</p>
              <p className="mt-2 font-bold text-slate-900">{formatPrice(order.totalPrice)}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default OrdersPage;
