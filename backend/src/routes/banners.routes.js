import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getBanners,
  updateBanner,
  broadcastBanner,
} from "../controllers/banners.controller.js";
import { requireAdminKey } from "../middleware/adminKey.js";
import { validate } from "../middleware/validate.js";
import {
  bannerIdSchema,
  createBannerSchema,
  updateBannerSchema,
} from "../validators/banners.validator.js";

const router = Router();

router.get("/active", getActiveBanners);

router.use(requireAdminKey);

router.get("/", getBanners);
router.post("/", validate(createBannerSchema), createBanner);
router.put("/:id", validate(updateBannerSchema), updateBanner);
router.delete("/:id", validate(bannerIdSchema), deleteBanner);
router.post("/:id/broadcast", validate(bannerIdSchema), broadcastBanner);

export default router;
