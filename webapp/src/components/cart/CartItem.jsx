import { formatPrice } from "../../lib/format";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <article className="flex gap-3 rounded-2xl bg-white/85 p-3 shadow-card ring-1 ring-slate-200/70">
      <img
        src={item.image || "https://placehold.co/120x120?text=Food"}
        alt={item.name}
        className="h-20 w-20 rounded-xl object-cover"
      />
      <div className="flex-1">
        <h3 className="font-display text-base font-semibold text-slate-900">{item.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{formatPrice(item.price)}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDecrease(item.productId)}
              className="h-8 w-8 rounded-lg bg-slate-100 text-lg font-bold"
            >
              -
            </button>
            <span className="w-6 text-center font-bold">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onIncrease(item.productId)}
              className="h-8 w-8 rounded-lg bg-slate-100 text-lg font-bold"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="text-xs font-bold text-rose-600"
          >
            O'chirish
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
