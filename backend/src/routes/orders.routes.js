import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrdersByTelegramId,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderSchema,
  orderIdSchema,
  ordersByTelegramSchema,
  updateOrderStatusSchema,
} from "../validators/orders.validator.js";
import { requireAdminKey } from "../middleware/adminKey.js";

const router = Router();

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", requireAdminKey, getOrders);
router.get("/user/:telegramId", validate(ordersByTelegramSchema), getOrdersByTelegramId);
router.get("/:id", requireAdminKey, validate(orderIdSchema), getOrderById);
router.patch("/:id/status", requireAdminKey, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
