import { Banner } from "../models/Banner.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import axios from "axios";

export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
});

export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(banners);
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.validated.body);
  res.status(201).json(banner);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.validated.params.id, req.validated.body, {
    new: true,
  });
  if (!banner) {
    throw new ApiError(404, "Banner topilmadi");
  }
  res.json(banner);
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.validated.params.id);
  if (!banner) {
    throw new ApiError(404, "Banner topilmadi");
  }
  res.json({ success: true });
});

export const broadcastBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.validated.params.id);
  if (!banner) {
    throw new ApiError(404, "Banner topilmadi");
  }

  // We start the broadcast asynchronously and immediately respond
  // This avoids keeping the HTTP request holding while sending to thousands of users.
  res.json({ success: true, message: "Tarqatish boshlandi" });

  (async () => {
    try {
      const users = await User.find({ telegramId: { $ne: null } });
      const botToken = env.botToken;

      for (const user of users) {
        // Skip browser fallback IDs if any
        if (user.telegramId.startsWith("guest_")) continue;

        try {
          await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            chat_id: user.telegramId,
            photo: banner.imageUrl,
            caption: banner.title + (banner.description ? `\n\n${banner.description}` : ""),
          });
          // Wait 50ms to avoid hitting rate limits
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (err) {
          console.error(`Error sending broadcast to ${user.telegramId}:`, err.message);
        }
      }
    } catch (err) {
      console.error("Broadcast failed globally:", err);
    }
  })();
});
