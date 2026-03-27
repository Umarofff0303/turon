import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  notifyAdminsNewOrder,
  notifyUserOrderAccepted,
  notifyUserOrderStatus,
} from "../services/telegram.service.js";

const buildOrderNumber = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${date}-${random}`;
};

const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return new mongoose.Types.ObjectId(id);
};

export const createOrder = asyncHandler(async (req, res) => {
  const {
    telegramUserId,
    customerName,
    customerPhone,
    note = "",
    paymentMethod,
    location,
    items,
  } = req.validated.body;

  const productIds = [...new Set(items.map((item) => item.product))]
    .map((id) => toObjectId(id))
    .filter(Boolean);

  if (!productIds.length) {
    throw new ApiError(400, "Mahsulotlar noto'g'ri yuborilgan");
  }

  const products = await Product.find({ _id: { $in: productIds }, isAvailable: true });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const orderItems = [];

  for (const item of items) {
    const product = productMap.get(String(item.product));
    if (!product) {
      throw new ApiError(400, `Mahsulot topilmadi yoki mavjud emas: ${item.product}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let user = await User.findOne({ telegramId: String(telegramUserId) });
  if (!user) {
    user = await User.create({
      telegramId: String(telegramUserId),
      fullName: customerName,
      phone: customerPhone,
    });
  } else {
    user.fullName = customerName || user.fullName;
    user.phone = customerPhone || user.phone;
    await user.save();
  }

  const order = await Order.create({
    orderNumber: buildOrderNumber(),
    user: user._id,
    items: orderItems,
    totalPrice,
    customerName,
    customerPhone,
    note,
    paymentMethod,
    location,
    status: "pending",
    telegramUserId: String(telegramUserId),
  });

  notifyUserOrderAccepted(String(telegramUserId), order).catch(() => {});
  notifyAdminsNewOrder(order).catch(() => {});

  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const orders = await Order.find(filter)
    .populate("user", "telegramId fullName phone")
    .sort({ createdAt: -1 });

  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const order = await Order.findById(id).populate("user", "telegramId fullName phone");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json(order);
});

export const getOrdersByTelegramId = asyncHandler(async (req, res) => {
  const { telegramId } = req.validated.params;
  const orders = await Order.find({ telegramUserId: String(telegramId) }).sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { status } = req.validated.body;

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  notifyUserOrderStatus(order.telegramUserId, order.orderNumber, status).catch(() => {});

  res.json(order);
});
