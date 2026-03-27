import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorState from "./components/common/ErrorState";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import { useBootstrap } from "./hooks/useBootstrap";

const App = () => {
  const { loading, error } = useBootstrap();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-xl p-4">
        <LoadingSpinner label="Mini App ishga tushmoqda..." />
      </div>
    );
  }

  return (
    <>
      <HashRouter>
        {error ? (
          <div className="mx-auto mt-4 w-full max-w-xl px-4">
            <ErrorState message={error} />
          </div>
        ) : null}

        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "14px",
            fontFamily: "Manrope, sans-serif",
          },
        }}
      />
    </>
  );
};

export default App;
