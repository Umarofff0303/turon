import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAdminKey = (req, _res, next) => {
  const telegramId = req.header("x-telegram-id");
  if (telegramId && env.telegramAdminChatIds?.includes(String(telegramId))) {
    return next();
  }

  if (!env.adminApiKey) {
    return next(new ApiError(500, "ADMIN_API_KEY is not configured"));
  }

  const key = req.header("x-admin-key");
  if (!key || key !== env.adminApiKey) {
    return next(new ApiError(401, "Admin access denied"));
  }

  next();
};
