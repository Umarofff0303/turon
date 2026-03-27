import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  listProductsSchema,
} from "../validators/products.validator.js";
import { requireAdminKey } from "../middleware/adminKey.js";

const router = Router();

router.get("/", validate(listProductsSchema), getProducts);
router.get("/:id", validate(productIdSchema), getProductById);
router.post("/", requireAdminKey, validate(createProductSchema), createProduct);
router.put("/:id", requireAdminKey, validate(updateProductSchema), updateProduct);
router.delete("/:id", requireAdminKey, validate(productIdSchema), deleteProduct);

export default router;
