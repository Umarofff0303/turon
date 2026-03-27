import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const registerOrLogin = asyncHandler(async (req, res) => {
  const { telegramId, fullName = "", phone = "" } = req.validated.body;

  const role = env.telegramAdminChatIds.includes(String(telegramId)) ? "admin" : "user";

  const user = await User.findOneAndUpdate(
    { telegramId: String(telegramId) },
    { telegramId: String(telegramId), fullName, phone, role },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json(user);
});

export const getUserByTelegramId = asyncHandler(async (req, res) => {
  const { telegramId } = req.validated.params;
  const user = await User.findOne({ telegramId: String(telegramId) });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(user);
});
