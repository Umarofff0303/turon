import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../validators/categories.validator.js";
import { requireAdminKey } from "../middleware/adminKey.js";

const router = Router();

router.get("/", getCategories);
router.post("/", requireAdminKey, validate(createCategorySchema), createCategory);
router.put("/:id", requireAdminKey, validate(updateCategorySchema), updateCategory);
router.delete("/:id", requireAdminKey, validate(categoryIdSchema), deleteCategory);

export default router;
