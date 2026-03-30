import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRoutes from "./routes/users.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import bannersRoutes from "./routes/banners.routes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { AppConfig } from "./models/AppConfig.js";

export const createApp = () => {
  const app = express();
  const corsOrigin = env.corsOrigin === "*" ? true : env.corsOrigin;

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get(
    "/api/config/public",
    asyncHandler(async (_req, res) => {
      const config = await AppConfig.findOneAndUpdate(
        { key: "public" },
        {
          $setOnInsert: {
            key: "public",
            restaurantName: env.restaurantName,
            contactPhone: env.contactPhone,
            contactTelegram: env.contactTelegram,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          lean: true,
        }
      );

      res.json({
        restaurantName: config.restaurantName,
        contactPhone: config.contactPhone,
        contactTelegram: config.contactTelegram,
      });
    })
  );

  app.use("/api/users", usersRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/banners", bannersRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
