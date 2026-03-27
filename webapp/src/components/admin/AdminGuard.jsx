import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../../store/app.store";

const AdminGuard = () => {
  const adminKey = useAppStore((state) => state.adminKey);

  if (!adminKey) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
