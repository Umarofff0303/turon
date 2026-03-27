import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import CartItem from "../components/cart/CartItem";
import { useCartStore } from "../store/cart.store";
import { formatPrice } from "../lib/format";

const CartPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.totalPrice());

  if (!items.length) {
    return (
      <EmptyState
        title="Savatcha bo'sh"
        description="Mahsulot qo'shing va buyurtmani davom ettiring."
        action={<Button onClick={() => navigate("/")}>Menu ga qaytish</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-slate-900">Savatcha</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Jami summa</span>
          <span className="font-display text-2xl font-bold text-emerald-700">{formatPrice(totalPrice)}</span>
        </div>
        <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
