import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useAppStore } from "../../store/app.store";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

const AdminLayout = () => {
  const clearAdminKey = useAppStore((state) => state.clearAdminKey);
  const navigate = useNavigate();

  const logout = () => {
    clearAdminKey();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin Panel</h1>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
        <nav className="mt-3 flex gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold ${
                  isActive ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
