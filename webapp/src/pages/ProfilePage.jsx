import { useAppStore } from "../store/app.store";

const ProfilePage = () => {
  const user = useAppStore((state) => state.telegramUser);
  const config = useAppStore((state) => state.config);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-bold text-slate-900">Profil</h1>
      </header>

      <section className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <h2 className="font-display text-lg font-semibold text-slate-900">Foydalanuvchi</h2>
        <p className="mt-2 text-sm text-slate-600">Ism: {user?.fullName || "-"}</p>
        <p className="text-sm text-slate-600">Telegram ID: {user?.telegramId || "-"}</p>
        <p className="text-sm text-slate-600">Username: {user?.username || "-"}</p>
      </section>

      <section className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
        <h2 className="font-display text-lg font-semibold text-slate-900">Aloqa</h2>
        <p className="mt-2 text-sm text-slate-600">Restoran: {config.restaurantName}</p>
        <p className="text-sm text-slate-600">Telefon: {config.contactPhone || "-"}</p>
        <p className="text-sm text-slate-600">Telegram: {config.contactTelegram || "-"}</p>
      </section>

      <section className="rounded-3xl bg-emerald-900 p-4 text-emerald-50 shadow-card">
        <h3 className="font-display text-lg font-semibold">Telegram Ilova</h3>
        <p className="mt-2 text-sm text-emerald-100">
          Mini App Telegram ichida menu button orqali ochiladi.
        </p>
      </section>
    </div>
  );
};

export default ProfilePage;
