import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories.api";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/products.api";
import { useAppStore } from "../store/app.store";
import { formatPrice } from "../lib/format";

const defaultCategoryForm = { name: "", slug: "", image: "" };
const defaultProductForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  isAvailable: true,
};

const AdminProductsPage = () => {
  const adminKey = useAppStore((state) => state.adminKey);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState("");

  const [productForm, setProductForm] = useState(defaultProductForm);
  const [editingProductId, setEditingProductId] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([getCategories(), getProducts()]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitCategory = async (event) => {
    event.preventDefault();
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryForm, adminKey);
        toast.success("Kategoriya yangilandi");
      } else {
        await createCategory(categoryForm, adminKey);
        toast.success("Kategoriya qo'shildi");
      }
      setCategoryForm(defaultCategoryForm);
      setEditingCategoryId("");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload, adminKey);
        toast.success("Mahsulot yangilandi");
      } else {
        await createProduct(payload, adminKey);
        toast.success("Mahsulot qo'shildi");
      }

      setProductForm(defaultProductForm);
      setEditingProductId("");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeCategory = async (id) => {
    if (!confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) {
      return;
    }

    try {
      await deleteCategory(id, adminKey);
      toast.success("Kategoriya o'chirildi");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeProduct = async (id) => {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) {
      return;
    }

    try {
      await deleteProduct(id, adminKey);
      toast.success("Mahsulot o'chirildi");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Products yuklanmoqda..." />;
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">
            {editingCategoryId ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
          </h2>
          <form className="mt-3 space-y-2" onSubmit={submitCategory}>
            <input
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nomi"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={categoryForm.slug}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="slug"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={categoryForm.image}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="image URL"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Saqlash</Button>
              {editingCategoryId ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setEditingCategoryId("");
                    setCategoryForm(defaultCategoryForm);
                  }}
                >
                  Bekor
                </Button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">Kategoriyalar</h2>
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                  <p className="text-xs text-slate-500">{category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs font-bold text-emerald-700"
                    onClick={() => {
                      setEditingCategoryId(category._id);
                      setCategoryForm({
                        name: category.name,
                        slug: category.slug,
                        image: category.image || "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs font-bold text-rose-700"
                    onClick={() => removeCategory(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">
            {editingProductId ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
          </h2>
          <form className="mt-3 space-y-2" onSubmit={submitProduct}>
            <input
              value={productForm.name}
              onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nomi"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <textarea
              value={productForm.description}
              onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Tavsif"
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={productForm.price}
              onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Narx"
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={productForm.image}
              onChange={(event) => setProductForm((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="image URL"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <select
              value={productForm.category}
              onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Kategoriya tanlang</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={productForm.isAvailable}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, isAvailable: event.target.checked }))
                }
              />
              Mavjud
            </label>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Saqlash</Button>
              {editingProductId ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setEditingProductId("");
                    setProductForm(defaultProductForm);
                  }}
                >
                  Bekor
                </Button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">Mahsulotlar</h2>
          <div className="mt-3 max-h-[560px] space-y-2 overflow-auto pr-1">
            {products.map((product) => (
              <div key={product._id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{formatPrice(product.price)}</p>
                    <p className="text-xs text-slate-500">{product.category?.name || "No category"}</p>
                    <p className="text-xs text-slate-500">
                      {product.isAvailable ? "Mavjud" : "Mavjud emas"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs font-bold text-emerald-700"
                      onClick={() => {
                        setEditingProductId(product._id);
                        setProductForm({
                          name: product.name,
                          description: product.description || "",
                          price: String(product.price),
                          image: product.image || "",
                          category: product.category?._id || "",
                          isAvailable: product.isAvailable,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs font-bold text-rose-700"
                      onClick={() => removeProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminProductsPage;
