import { Category } from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.validated.body);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const category = await Category.findByIdAndUpdate(id, req.validated.body, { new: true, runValidators: true });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(204).send();
});
