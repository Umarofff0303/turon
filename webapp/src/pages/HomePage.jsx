import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getCategories } from "../api/categories.api";
import { getProducts } from "../api/products.api";
import { getActiveBanners } from "../api/banners.api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import CategoryChips from "../components/menu/CategoryChips";
import ProductCard from "../components/menu/ProductCard";
import ProductDetailModal from "../components/menu/ProductDetailModal";
import { useCartStore } from "../store/cart.store";
import { useAppStore } from "../store/app.store";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addItem = useCartStore((state) => state.addItem);
  const totalCount = useCartStore((state) => state.totalCount());
  const config = useAppStore((state) => state.config);

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [categoriesData, productsData, bannersData] = await Promise.all([
        getCategories(),
        getProducts(),
        getActiveBanners(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData.filter((item) => item.isAvailable));
      setBanners(bannersData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "all" ||
        product.category?._id === activeCategory ||
        product.category?.slug === activeCategory;

      const searchMatch =
        !searchLower ||
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower);

      return categoryMatch && searchMatch;
    });
  }, [products, activeCategory, search]);

  const handleAdd = (product, quantity = 1) => {
    addItem(product, quantity);
    toast.success("Savatchaga qo'shildi");
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-lime-700 p-5 text-white shadow-card">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-100">Frictionless ordering</p>
        <h1 className="mt-2 font-display text-2xl font-bold">{config.restaurantName}</h1>
        <p className="mt-1 text-sm text-emerald-100">Mazali taomlar, tez yetkazib berish</p>

        <div className="mt-4 rounded-2xl bg-white/95 p-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Taom qidirish..."
            className="w-full rounded-xl border-0 bg-transparent px-2 py-2 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </header>

      {banners && banners.length > 0 && (
        <section className="mb-4">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {banners.map((banner) => (
              <div 
                key={banner._id} 
                className="shrink-0 w-[280px] sm:w-[320px] snap-center rounded-2xl overflow-hidden shadow-sm relative group bg-white border border-slate-100"
              >
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="w-full h-36 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                  <h3 className="text-white font-bold text-sm line-clamp-1">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-emerald-50 text-xs mt-0.5 line-clamp-2">{banner.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <CategoryChips
        categories={categories}
        activeCategory={activeCategory}
        onChange={(category) => setActiveCategory(category._id === "all" ? "all" : category._id)}
      />

      {loading ? <LoadingSpinner label="Menu yuklanmoqda..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error && filteredProducts.length === 0 ? (
        <EmptyState
          title="Mahsulot topilmadi"
          description="Qidiruv yoki kategoriya filtrini o'zgartirib ko'ring."
        />
      ) : null}

      {!loading && !error ? (
        <section className="grid grid-cols-2 gap-3 pb-20">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={handleAdd}
              onOpen={setSelectedProduct}
            />
          ))}
        </section>
      ) : null}

      {totalCount > 0 ? (
        <Button
          className="fixed bottom-24 right-4 z-30 px-5"
          onClick={() => navigate("/cart")}
        >
          Savatcha ({totalCount})
        </Button>
      ) : null}

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default HomePage;
