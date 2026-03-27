import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI"];

const parseCorsOrigins = (value) => {
  const origins = (value || "*")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!origins.length || origins.includes("*")) {
    return "*";
  }

  return origins;
};

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramAdminChatIds: (process.env.TELEGRAM_ADMIN_CHAT_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  adminApiKey: process.env.ADMIN_API_KEY || "",
  contactPhone: process.env.CONTACT_PHONE || "+998 90 000 00 00",
  contactTelegram: process.env.CONTACT_TELEGRAM || "@turon_support",
  restaurantName: process.env.RESTAURANT_NAME || "Turon Oshxonasi",
};
