import { useMemo, useState } from "react";
import { formatPrice } from "../../lib/format";
import Button from "../common/Button";

const ProductDetailModal = ({ product, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(() => Number(product?.price || 0) * quantity, [product, quantity]);

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-900/45 p-0 sm:items-center sm:justify-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-md sm:rounded-3xl">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image || "https://placehold.co/600x400?text=Food"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-4 p-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">{product.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{product.description}</p>
          </div>

          <p className="text-lg font-extrabold text-emerald-700">{formatPrice(product.price)}</p>

          <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-2">
            <button
              type="button"
              className="h-9 w-9 rounded-xl bg-white text-xl font-bold"
              onClick={() => setQuantity((v) => Math.max(1, v - 1))}
            >
              -
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              type="button"
              className="h-9 w-9 rounded-xl bg-white text-xl font-bold"
              onClick={() => setQuantity((v) => v + 1)}
            >
              +
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onClose}>
              Yopish
            </Button>
            <Button
              onClick={() => {
                onAdd(product, quantity);
                onClose();
              }}
            >
              {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
