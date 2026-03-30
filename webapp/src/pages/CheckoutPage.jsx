import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import LocationPicker from "../components/checkout/LocationPicker";
import PaymentSelector from "../components/checkout/PaymentSelector";
import { createOrder } from "../api/orders.api";
import { useCartStore } from "../store/cart.store";
import { useAppStore } from "../store/app.store";
import { formatPrice } from "../lib/format";
import {
  getTelegramWebApp,
  setupTelegramMainButton,
} from "../lib/telegram";

const CheckoutPage = () => {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const telegramUser = useAppStore((state) => state.telegramUser);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: telegramUser?.fullName || "",
    customerPhone: "",
    note: "",
    address: "",
    paymentMethod: "cash",
    locationMethod: "map",
  });
  const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (telegramUser?.fullName) {
      setForm((prev) => ({ ...prev, customerName: prev.customerName || telegramUser.fullName }));
    }
  }, [telegramUser]);

  const canSubmit = useMemo(() => {
    return (
      Boolean(telegramUser?.telegramId) &&
      items.length > 0 &&
      form.customerName.trim().length >= 2 &&
      form.customerPhone.trim().length >= 5 &&
      Number.isFinite(location.lat) &&
      Number.isFinite(location.lng)
    );
  }, [telegramUser?.telegramId, items.length, form.customerName, form.customerPhone, location.lat, location.lng]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      if (!telegramUser?.telegramId) {
        throw new Error("Telegram user topilmadi. Mini App ni Telegram ichidan oching.");
      }

      const payload = {
        telegramUserId: telegramUser.telegramId,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        note: form.note.trim(),
        paymentMethod: form.paymentMethod,
        location: {
          lat: location.lat,
          lng: location.lng,
          address: form.address.trim() || location.address || "",
        },
        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
      };

      const createdOrder = await createOrder(payload);

      const tg = getTelegramWebApp();
      if (tg) {
        tg.sendData(
          JSON.stringify({
            type: "order_created",
            orderId: createdOrder._id,
            orderNumber: createdOrder.orderNumber,
          })
        );
      }

      clearCart();
      toast.success("Buyurtma qabul qilindi");
      navigate("/orders");
    } catch (e) {
      toast.error(e.message || "Buyurtma yuborilmadi");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, clearCart, form.address, form.customerName, form.customerPhone, form.note, form.paymentMethod, items, location.address, location.lat, location.lng, navigate, submitting, telegramUser?.telegramId]);

  useEffect(() => {
    const cleanup = setupTelegramMainButton({
      text: "Buyurtma berish",
      onClick: handleSubmit,
      isVisible: items.length > 0,
      isLoading: submitting,
    });

    return cleanup;
  }, [handleSubmit, items.length, submitting]);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation qo'llab-quvvatlanmaydi");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "",
        });
        toast.success("Joriy joylashuv olindi");
      },
      () => {
        toast.error("Joylashuvni olishga ruxsat berilmadi");
      }
    );
  };

  if (!items.length) {
    return (
      <EmptyState
        title="Checkout uchun savatcha bo'sh"
        description="Avval mahsulot qo'shing."
        action={<Button onClick={() => navigate("/")}>Menu ga qaytish</Button>}
      />
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <h1 className="font-display text-2xl font-bold text-slate-900">Checkout</h1>

      <section className="space-y-3 rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <input
          value={form.customerName}
          onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))}
          placeholder="Ismingiz"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <input
          value={form.customerPhone}
          onChange={(event) => setForm((prev) => ({ ...prev, customerPhone: event.target.value }))}
          placeholder="Telefon raqam"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <textarea
          value={form.note}
          onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
          placeholder="Izoh (achchiq bo'lmasin...)"
          rows={3}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
      </section>

      <section className="space-y-3 rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <h2 className="font-display text-lg font-semibold text-slate-900">Yetkazib berish manzili</h2>

        <div className="flex gap-2">
          <Button
            variant={form.locationMethod === "telegram" ? "primary" : "secondary"}
            className="flex-1"
            onClick={() => setForm((prev) => ({ ...prev, locationMethod: "telegram" }))}
          >
            Telegram location
          </Button>
          <Button
            variant={form.locationMethod === "map" ? "primary" : "secondary"}
            className="flex-1"
            onClick={() => setForm((prev) => ({ ...prev, locationMethod: "map" }))}
          >
            Xarita pin
          </Button>
        </div>

        {form.locationMethod === "telegram" ? (
          <Button variant="secondary" onClick={fetchCurrentLocation}>
            Joriy joylashuvni olish
          </Button>
        ) : null}

        <LocationPicker
          value={location}
          onChange={(next) => setLocation((prev) => ({ ...prev, ...next }))}
        />

        <input
          value={form.address}
          onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          placeholder="Manzil (ko'cha, mo'ljal)"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
      </section>

      <section className="space-y-3 rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <h2 className="font-display text-lg font-semibold text-slate-900">To'lov turi</h2>
        <PaymentSelector
          value={form.paymentMethod}
          onChange={(value) => setForm((prev) => ({ ...prev, paymentMethod: value }))}
        />
      </section>

      <section className="rounded-3xl bg-emerald-900 p-4 text-white shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-sm text-emerald-100">Jami</span>
          <span className="font-display text-2xl font-bold">{formatPrice(totalPrice)}</span>
        </div>
        <Button className="mt-3 w-full bg-white text-emerald-900" disabled={!canSubmit || submitting} onClick={handleSubmit}>
          {submitting ? "Yuborilmoqda..." : "Buyurtma berish"}
        </Button>
      </section>
    </div>
  );
};

export default CheckoutPage;
