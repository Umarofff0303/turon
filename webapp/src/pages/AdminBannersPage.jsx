import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
  broadcastBanner,
} from "../api/banners.api";

const defaultForm = {
  title: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

const AdminBannersPage = () => {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await updateBanner(editingId, form);
        toast.success("Reklama yangilandi");
      } else {
        await createBanner(form);
        toast.success("Reklama qo'shildi");
      }
      setForm(defaultForm);
      setEditingId("");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeBanner = async (id) => {
    if (!confirm("Reklamani o'chirishni tasdiqlaysizmi?")) return;
    try {
      await deleteBanner(id);
      toast.success("Reklama o'chirildi");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const triggerBroadcast = async (id) => {
    if (!confirm("Hamma bot mijozlariga shu reklamani hozir tarqatmoqchimisiz?")) return;
    try {
      const res = await broadcastBanner(id);
      toast.success(res.message || "Tarqatish boshlandi");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Reklamalar yuklanmoqda..." />;
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">
            {editingId ? "Reklamani tahrirlash" : "Yangi reklama / e'lon"}
          </h2>
          <form className="mt-3 space-y-3" onSubmit={submitForm}>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Sarlavha"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Tavsif (ixtiyoriy)"
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Rasm URL"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
              />
              Aktiv (Bosh sahifada ko'rsatish)
            </label>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">Saqlash</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setEditingId("");
                    setForm(defaultForm);
                  }}
                >
                  Bekor qilish
                </Button>
              )}
            </div>
          </form>

          {form.imageUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
              <img src={form.imageUrl} alt="Preview" className="w-full h-auto object-cover max-h-48" />
            </div>
          )}
        </article>

        <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">Reklamalar ro'yxati</h2>
          <div className="mt-3 max-h-[600px] space-y-3 overflow-auto pr-1">
            {banners.length === 0 ? (
              <p className="text-sm text-slate-500">Hozircha hech qanday reklama yo'q.</p>
            ) : null}
            {banners.map((banner) => (
              <div key={banner._id} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <div className="flex items-start gap-3">
                  <img
                    src={banner.imageUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{banner.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 max-h-8 overflow-hidden">
                      {banner.description || "Tavsif yo'q"}
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {banner.isActive ? (
                        <span className="text-emerald-600">Aktiv</span>
                      ) : (
                        <span className="text-rose-600">O'chirilgan</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-emerald-100 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                    onClick={() => {
                      setEditingId(banner._id);
                      setForm({
                        title: banner.title,
                        description: banner.description || "",
                        imageUrl: banner.imageUrl,
                        isActive: banner.isActive,
                      });
                    }}
                  >
                    Tahrirlash
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-rose-100 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                    onClick={() => removeBanner(banner._id)}
                  >
                    O'chirish
                  </button>
                  <button
                    type="button"
                    className="w-full mt-1 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    onClick={() => triggerBroadcast(banner._id)}
                  >
                    Bot orqali tarqatish (Broadcast)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminBannersPage;
