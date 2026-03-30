import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../../store/app.store";

const AdminGuard = () => {
  const isAdmin = useAppStore((state) => state.isAdmin);
  const adminKey = useAppStore((state) => state.adminKey);

  if (!isAdmin && !adminKey) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
