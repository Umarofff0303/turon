import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAdminKey = (req, _res, next) => {
  if (!env.adminApiKey) {
    return next(new ApiError(500, "ADMIN_API_KEY is not configured"));
  }

  const key = req.header("x-admin-key");
  if (!key || key !== env.adminApiKey) {
    return next(new ApiError(401, "Admin access denied"));
  }

  next();
};
