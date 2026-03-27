import { formatPrice } from "../../lib/format";
import Button from "../common/Button";

const ProductCard = ({ product, onAdd, onOpen }) => {
  return (
    <article className="overflow-hidden rounded-3xl bg-white/85 shadow-card ring-1 ring-slate-200/70">
      <button type="button" className="w-full text-left" onClick={() => onOpen(product)}>
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.image || "https://placehold.co/600x400?text=Food"}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      </button>
      <div className="space-y-3 p-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold text-emerald-700">{formatPrice(product.price)}</span>
          <Button className="px-3 py-2 text-xs" onClick={() => onAdd(product)}>
            Savatchaga
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
