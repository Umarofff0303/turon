export const formatPrice = (value) => `${Number(value || 0).toLocaleString("uz-UZ")} so'm`;

export const statusLabel = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlandi",
  cooking: "Tayyorlanmoqda",
  on_the_way: "Yo'lda",
  delivered: "Yetkazildi",
  cancelled: "Bekor qilindi",
};

export const statusOptions = [
  "pending",
  "confirmed",
  "cooking",
  "on_the_way",
  "delivered",
  "cancelled",
];
