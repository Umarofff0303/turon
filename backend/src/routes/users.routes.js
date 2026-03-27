import { Router } from "express";
import { registerOrLogin, getUserByTelegramId } from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { registerOrLoginSchema, userByTelegramIdSchema } from "../validators/users.validator.js";

const router = Router();

router.post("/register-or-login", validate(registerOrLoginSchema), registerOrLogin);
router.get("/:telegramId", validate(userByTelegramIdSchema), getUserByTelegramId);

export default router;
