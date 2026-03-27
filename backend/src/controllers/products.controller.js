import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, isAvailable } = req.validated.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (!foundCategory) {
        return res.json([]);
      }
      filter.category = foundCategory._id;
    }
  }

  if (typeof isAvailable !== "undefined") {
    filter.isAvailable = isAvailable === "true";
  }

  const products = await Product.find(filter).populate("category").sort({ createdAt: -1 });

  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const product = await Product.findById(id).populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.validated.body);
  const populated = await product.populate("category");
  res.status(201).json(populated);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const product = await Product.findByIdAndUpdate(id, req.validated.body, {
    new: true,
    runValidators: true,
  }).populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(204).send();
});
