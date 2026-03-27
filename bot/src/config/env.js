import dotenv from "dotenv";

dotenv.config();

const required = ["BOT_TOKEN", "BACKEND_URL", "WEBAPP_URL"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  botToken: process.env.BOT_TOKEN,
  backendUrl: process.env.BACKEND_URL,
  webappUrl: process.env.WEBAPP_URL,
  adminApiKey: process.env.ADMIN_API_KEY || "",
  adminIds: (process.env.ADMIN_TELEGRAM_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
};
