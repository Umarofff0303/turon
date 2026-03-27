import { useEffect, useState } from "react";
import { getCategories } from "../api/categories.api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-bold text-slate-900">Kategoriyalar</h1>
        <p className="text-sm text-slate-600">Asosiy buyurtma oqimi Home sahifada davom etadi.</p>
      </header>

      {loading ? <LoadingSpinner label="Kategoriyalar yuklanmoqda..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <article key={category._id} className="overflow-hidden rounded-3xl bg-white/90 shadow-card ring-1 ring-slate-200">
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={category.image || "https://placehold.co/300x300?text=Category"}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-display text-base font-semibold text-slate-900">{category.name}</h3>
                <p className="text-xs text-slate-500">slug: {category.slug}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CategoriesPage;
