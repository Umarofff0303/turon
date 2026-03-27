import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import { getAllOrders } from "../api/orders.api";
import { useAppStore } from "../store/app.store";

const AdminLoginPage = () => {
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const setAdminKey = useAppStore((state) => state.setAdminKey);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!keyInput.trim()) {
      toast.error("Admin key kiriting");
      return;
    }

    setLoading(true);
    try {
      await getAllOrders(keyInput.trim());
      setAdminKey(keyInput.trim());
      toast.success("Admin panelga kirildi");
      navigate("/admin/dashboard", { replace: true });
    } catch (e) {
      toast.error(e.message || "Admin key noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-3xl bg-white/90 p-6 shadow-card ring-1 ring-slate-200">
      <h1 className="font-display text-2xl font-bold text-slate-900">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-600">Backend `ADMIN_API_KEY` ni kiriting.</p>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input
          value={keyInput}
          onChange={(event) => setKeyInput(event.target.value)}
          type="password"
          placeholder="Admin API key"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
