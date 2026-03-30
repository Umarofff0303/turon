import mongoose from "mongoose";
import { env } from "../config/env.js";
import { AppConfig } from "../models/AppConfig.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const categoriesSeed = [
  { name: "Milliy taomlar", slug: "milliy-taomlar", image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05" },
  { name: "Fast food", slug: "fast-food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
  { name: "Ichimliklar", slug: "ichimliklar", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e" },
];

const productsSeed = [
  {
    name: "Osh",
    description: "An'anaviy to'y oshi",
    price: 35000,
    image: "https://images.unsplash.com/photo-1719059940488-2f4ce1906d75",
    categorySlug: "milliy-taomlar",
  },
  {
    name: "Lag'mon",
    description: "Qo'lda cho'zilgan lag'mon",
    price: 32000,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
    categorySlug: "milliy-taomlar",
  },
  {
    name: "Cheeseburger",
    description: "Sigir go'shti va pishloq",
    price: 28000,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b",
    categorySlug: "fast-food",
  },
  {
    name: "Coca-Cola 1L",
    description: "Sovutilgan ichimlik",
    price: 12000,
    image: "https://images.unsplash.com/photo-1543253687-c931c8e01820",
    categorySlug: "ichimliklar",
  },
];

const seed = async () => {
  await mongoose.connect(env.mongodbUri);

  await AppConfig.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});

  await AppConfig.create({
    key: "public",
    restaurantName: env.restaurantName,
    contactPhone: env.contactPhone,
    contactTelegram: env.contactTelegram,
  });

  const categories = await Category.insertMany(categoriesSeed);
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));

  const products = productsSeed.map((product) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: categoryMap.get(product.categorySlug)?._id,
    isAvailable: true,
  }));

  await Product.insertMany(products);

  // eslint-disable-next-line no-console
  console.log("Seed completed");

  await mongoose.disconnect();
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
