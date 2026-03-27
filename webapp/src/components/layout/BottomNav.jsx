import { NavLink } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Kategoriya" },
  { to: "/cart", label: "Savatcha" },
  { to: "/orders", label: "Buyurtmalar" },
  { to: "/profile", label: "Profil" },
];

const BottomNav = () => {
  const totalCount = useCartStore((state) => state.totalCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur">
      <ul className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `relative flex h-12 items-center justify-center rounded-xl text-[11px] font-semibold ${
                  isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-500"
                }`
              }
            >
              {item.label}
              {item.to === "/cart" && totalCount > 0 ? (
                <span className="absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] text-white">
                  {totalCount}
                </span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
