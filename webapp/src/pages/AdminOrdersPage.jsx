import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../api/orders.api";
import { useAppStore } from "../store/app.store";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatPrice, statusLabel, statusOptions } from "../lib/format";
import Button from "../components/common/Button";

const AdminOrdersPage = () => {
  const adminKey = useAppStore((state) => state.adminKey);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(adminKey);
      setOrders(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [adminKey]);

  const setStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, adminKey);
      toast.success("Status yangilandi");
      setOrders((prev) => prev.map((item) => (item._id === orderId ? { ...item, status } : item)));
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Buyurtmalar yuklanmoqda..." />;
  }

  const filtered = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-bold text-slate-900">Orders</h1>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Barchasi</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <article key={order._id} className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">#{order.orderNumber}</h2>
                <p className="text-sm text-slate-600">{order.customerName} | {order.customerPhone}</p>
                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString("uz-UZ")}</p>
                <p className="mt-1 text-sm text-slate-700">{formatPrice(order.totalPrice)}</p>
                <p className="text-xs text-slate-500">
                  Location: {order.location?.lat?.toFixed?.(4)}, {order.location?.lng?.toFixed?.(4)}
                </p>
              </div>

              <div className="space-y-2">
                <select
                  value={order.status}
                  onChange={(event) => setStatus(order._id, event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel[status]}
                    </option>
                  ))}
                </select>
                <p className="text-right text-xs font-bold text-emerald-700">{statusLabel[order.status]}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-700">
              {order.items.map((item, idx) => (
                <p key={`${order._id}_${idx}`}>- {item.name} x{item.quantity}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
