import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen pb-28">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-16 -top-24 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -right-10 top-16 h-64 w-64 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute bottom-24 left-8 h-48 w-48 rounded-full bg-lime-200/25 blur-3xl" />
      </div>

      <main className="mx-auto w-full max-w-xl px-4 pt-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default AppLayout;
