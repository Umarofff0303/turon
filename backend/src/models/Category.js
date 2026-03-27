import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Category = mongoose.model("Category", categorySchema);
