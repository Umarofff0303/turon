import clsx from "clsx";

const CategoryChips = ({ categories, activeCategory, onChange }) => {
  const all = [{ _id: "all", name: "Barchasi", slug: "all" }, ...categories];

  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
      {all.map((category) => {
        const isActive = activeCategory === category._id || activeCategory === category.slug;
        return (
          <button
            key={category._id}
            type="button"
            onClick={() => onChange(category)}
            className={clsx(
              "whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition",
              isActive
                ? "bg-emerald-600 text-white shadow-card"
                : "bg-white/85 text-slate-700 ring-1 ring-slate-200"
            )}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
