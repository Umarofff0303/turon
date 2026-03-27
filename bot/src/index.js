import { Markup, Telegraf } from "telegraf";
import { env } from "./config/env.js";
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getOrderById,
  getOrders,
  getProducts,
  getPublicConfig,
  getUserOrders,
  registerOrLoginUser,
  setOrderStatus,
  updateProduct,
} from "./services/backend.service.js";
import { ORDER_STATUS_LABELS, ORDER_STATUS_LIST } from "./constants/orderStatus.js";
import { clearSession, getSession, setSession } from "./state/adminSession.js";
import { formatOrderRow, formatPrice } from "./utils/format.js";

const bot = new Telegraf(env.botToken);

const isAdmin = (ctx) => env.adminIds.includes(String(ctx.from?.id || ""));

const webAppKeyboard = () =>
  Markup.inlineKeyboard([Markup.button.webApp("\u{1F37D} Menuni ochish", env.webappUrl)]);

const adminKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback("\u2795 Taom qo'shish", "admin:add_product")],
    [Markup.button.callback("\u270F\uFE0F Taomni tahrirlash", "admin:edit_product")],
    [Markup.button.callback("\u274C Taomni o'chirish", "admin:delete_product")],
    [Markup.button.callback("\u{1F4E6} Buyurtmalar", "admin:orders")],
  ]);

const DEFAULT_CATEGORIES = [
  { name: "Milliy taomlar", slug: "milliy-taomlar", image: "" },
  { name: "Fast food", slug: "fast-food", image: "" },
  { name: "Ichimliklar", slug: "ichimliklar", image: "" },
];

const statusesKeyboard = (orderId) => {
  const rows = [];
  for (let i = 0; i < ORDER_STATUS_LIST.length; i += 2) {
    const chunk = ORDER_STATUS_LIST.slice(i, i + 2);
    rows.push(chunk.map((status) => Markup.button.callback(ORDER_STATUS_LABELS[status], `admin:status:${orderId}:${status}`)));
  }
  rows.push([Markup.button.callback("\u2B05\uFE0F Buyurtmalar", "admin:orders")]);
  return Markup.inlineKeyboard(rows);
};

bot.start(async (ctx) => {
  const from = ctx.from;

  if (from) {
    registerOrLoginUser({
      telegramId: String(from.id),
      fullName: [from.first_name, from.last_name].filter(Boolean).join(" "),
      phone: "",
    }).catch(() => { });
  }

  await ctx.reply(
    [
      "<b>Turon Oshxonasiga xush kelibsiz!</b>",
      "Mazali taomlar va tez yetkazib berish.",
      "Buyurtmani boshlash uchun tugmani bosing.",
    ].join("\n"),
    {
      parse_mode: "HTML",
      ...webAppKeyboard(),
    }
  );
});

bot.command("menu", async (ctx) => {
  await ctx.reply("Mini App ni oching:", webAppKeyboard());
});

const handleMyOrders = async (ctx) => {
  try {
    const orders = await getUserOrders(ctx.from.id);

    if (!orders.length) {
      await ctx.reply("Sizda hozircha buyurtmalar yo'q.");
      return;
    }

    const text = ["<b>Sizning buyurtmalaringiz:</b>", ...orders.slice(0, 10).map(formatOrderRow)].join("\n");
    await ctx.reply(text, { parse_mode: "HTML" });
  } catch (error) {
    await ctx.reply(`Buyurtmalarni olishda xatolik yuz berdi: ${error.message}`);
  }
};

bot.command("myorders", handleMyOrders);
bot.command("orders", handleMyOrders);

bot.command("contact", async (ctx) => {
  try {
    const config = await getPublicConfig();
    await ctx.reply(
      [
        "Aloqa:",
        `Telefon: ${config.contactPhone}`,
        `Telegram: ${config.contactTelegram}`,
      ].join("\n")
    );
  } catch (error) {
    await ctx.reply(`Aloqa ma'lumotlarini olishda xatolik yuz berdi: ${error.message}`);
  }
});

bot.command("admin", async (ctx) => {
  if (!isAdmin(ctx)) {
    await ctx.reply("Siz admin emassiz.");
    return;
  }

  await ctx.reply("Admin panel", adminKeyboard());
});

const startAddProduct = async (ctx) => {
  let categories = await getCategories();

  if (!categories.length) {
    await ctx.reply("Kategoriya topilmadi. Default kategoriyalar yaratilmoqda...");
    await Promise.allSettled(DEFAULT_CATEGORIES.map((category) => createCategory(category)));
    categories = await getCategories();
  }

  if (!categories.length) {
    await ctx.reply("Kategoriya yaratilmadi. Backend va ADMIN_API_KEY ni tekshiring.");
    return;
  }

  setSession(ctx.chat.id, {
    mode: "add_product",
    step: "name",
    data: { categories },
  });

  await ctx.reply("Yangi taom nomini kiriting:");
};

const showProductsForEdit = async (ctx) => {
  const products = await getProducts();

  if (!products.length) {
    await ctx.reply("Tahrirlash uchun taom yo'q.");
    return;
  }

  const rows = products.slice(0, 20).map((item) => [Markup.button.callback(`\u270F\uFE0F ${item.name}`, `admin:edit:${item._id}`)]);
  rows.push([Markup.button.callback("\u2B05\uFE0F Orqaga", "admin:menu")]);
  await ctx.reply("Tahrirlash uchun taomni tanlang:", Markup.inlineKeyboard(rows));
};

const showProductsForDelete = async (ctx) => {
  const products = await getProducts();

  if (!products.length) {
    await ctx.reply("O'chirish uchun taom yo'q.");
    return;
  }

  const rows = products.slice(0, 20).map((item) => [Markup.button.callback(`\u274C ${item.name}`, `admin:delete:${item._id}`)]);
  rows.push([Markup.button.callback("\u2B05\uFE0F Orqaga", "admin:menu")]);

  await ctx.reply("O'chirish uchun taomni tanlang:", Markup.inlineKeyboard(rows));
};

const showOrders = async (ctx) => {
  const orders = await getOrders();
  if (!orders.length) {
    await ctx.reply("Hozircha buyurtmalar yo'q.");
    return;
  }

  const rows = orders.slice(0, 15).map((order) => {
    const label = `#${order.orderNumber} | ${ORDER_STATUS_LABELS[order.status]}`;
    return [Markup.button.callback(label, `admin:order:${order._id}`)];
  });
  rows.push([Markup.button.callback("\u2B05\uFE0F Orqaga", "admin:menu")]);

  await ctx.reply("Buyurtmalar:", Markup.inlineKeyboard(rows));
};

bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery?.data || "";

  if (!data.startsWith("admin:")) {
    await ctx.answerCbQuery();
    return;
  }

  if (!isAdmin(ctx)) {
    await ctx.answerCbQuery("Ruxsat yo'q", { show_alert: true });
    return;
  }

  try {
    if (data === "admin:menu") {
      clearSession(ctx.chat.id);
      await ctx.reply("Admin panel", adminKeyboard());
      await ctx.answerCbQuery();
      return;
    }

    if (data === "admin:add_product") {
      await startAddProduct(ctx);
      await ctx.answerCbQuery();
      return;
    }

    if (data === "admin:edit_product") {
      await showProductsForEdit(ctx);
      await ctx.answerCbQuery();
      return;
    }

    if (data === "admin:delete_product") {
      await showProductsForDelete(ctx);
      await ctx.answerCbQuery();
      return;
    }

    if (data === "admin:orders") {
      await showOrders(ctx);
      await ctx.answerCbQuery();
      return;
    }

    if (data.startsWith("admin:edit:")) {
      const productId = data.split(":")[2];
      setSession(ctx.chat.id, {
        mode: "edit_product",
        step: "price",
        data: { productId },
      });
      await ctx.reply("Yangi narxni kiriting (son):");
      await ctx.answerCbQuery();
      return;
    }

    if (data.startsWith("admin:delete:")) {
      const productId = data.split(":")[2];
      await deleteProduct(productId);
      await ctx.reply("Taom o'chirildi.");
      await ctx.answerCbQuery("O'chirildi");
      return;
    }

    if (data.startsWith("admin:add_cat:")) {
      const categoryId = data.split(":")[2];
      const session = getSession(ctx.chat.id);
      if (session?.mode === "add_product") {
        session.data.categoryId = categoryId;
        await createProduct({ ...session.data, category: categoryId, isAvailable: true });
        clearSession(ctx.chat.id);
        await ctx.reply("Taom muvaffaqiyatli qo'shildi! ✅", adminKeyboard());
      }
      await ctx.answerCbQuery();
      return;
    }

    if (data.startsWith("admin:order:")) {
      const orderId = data.split(":")[2];
      const order = await getOrderById(orderId);
      const text = [
        `<b>Buyurtma #${order.orderNumber}</b>`,
        `Mijoz: ${order.customerName}`,
        `Telefon: ${order.customerPhone}`,
        `To'lov: ${order.paymentMethod === "cash" ? "Naqd" : "Karta"}`,
        `Jami: ${formatPrice(order.totalPrice)}`,
        `Status: ${ORDER_STATUS_LABELS[order.status]}`,
        "Mahsulotlar:",
        ...order.items.map((item) => `- ${item.name} x${item.quantity}`),
      ].join("\n");

      await ctx.reply(text, {
        parse_mode: "HTML",
        ...statusesKeyboard(order._id),
      });
      await ctx.answerCbQuery();
      return;
    }

    if (data.startsWith("admin:status:")) {
      const [, , orderId, status] = data.split(":");
      await setOrderStatus(orderId, status);
      await ctx.reply(`Status yangilandi: ${ORDER_STATUS_LABELS[status]}`);
      await ctx.answerCbQuery("Yangilandi");
      return;
    }

    await ctx.answerCbQuery();
  } catch (error) {
    await ctx.answerCbQuery("Xatolik", { show_alert: true });
    await ctx.reply(`Amal bajarishda xatolik yuz berdi: ${error.message}`);
  }
});

bot.on("text", async (ctx, next) => {
  const session = getSession(ctx.chat.id);
  if (!session || !isAdmin(ctx)) {
    return next();
  }

  const text = (ctx.message?.text || "").trim();

  try {
    if (session.mode === "add_product") {
      if (session.step === "name") {
        session.data.name = text;
        session.step = "description";
        setSession(ctx.chat.id, session);
        await ctx.reply("Tavsif kiriting:");
        return;
      }

      if (session.step === "description") {
        session.data.description = text;
        session.step = "price";
        setSession(ctx.chat.id, session);
        await ctx.reply("Narx kiriting (son):");
        return;
      }

      if (session.step === "price") {
        const price = Number(text.replace(/\s/g, ""));
        if (Number.isNaN(price) || price < 0) {
          await ctx.reply("Narx noto'g'ri. Qayta kiriting:");
          return;
        }
        session.data.price = price;
        session.step = "image";
        setSession(ctx.chat.id, session);
        await ctx.reply("Rasm URL kiriting (yoki '-' yuboring):");
        return;
      }

      if (session.step === "image") {
        session.data.image = text === "-" ? "" : text;
        session.step = "category_select";
        setSession(ctx.chat.id, session);

        const buttons = session.data.categories.map((cat) => [
          Markup.button.callback(cat.name, `admin:add_cat:${cat._id}`),
        ]);
        await ctx.reply("Kategoriyani tanlang:", Markup.inlineKeyboard(buttons));
        return;
      }
    }

    if (session.mode === "edit_product") {
      if (session.step === "price") {
        const price = Number(text);
        if (Number.isNaN(price) || price < 0) {
          await ctx.reply("Narx noto'g'ri. Qayta kiriting:");
          return;
        }
        session.data.price = price;
        session.step = "availability";
        setSession(ctx.chat.id, session);
        await ctx.reply("Mavjudlik holati (ha yoki yoq):");
        return;
      }

      if (session.step === "availability") {
        const normalized = text.toLowerCase();
        const isAvailable = normalized === "ha" || normalized === "yes";

        await updateProduct(session.data.productId, {
          price: session.data.price,
          isAvailable,
        });

        clearSession(ctx.chat.id);
        await ctx.reply("Taom yangilandi \u2705", adminKeyboard());
        return;
      }
    }
  } catch (error) {
    clearSession(ctx.chat.id);
    await ctx.reply(`Xatolik yuz berdi: ${error.message}. /admin ni qayta oching.`);
  }
});

bot.catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Bot error", err);
});

const start = async () => {
  const defaultCommands = [
    { command: "start", description: "Boshlash" },
    { command: "menu", description: "Mini App ni ochish" },
    { command: "myorders", description: "Buyurtmalarim" },
    { command: "contact", description: "Aloqa" },
  ];

  const adminCommands = [
    ...defaultCommands,
    { command: "admin", description: "Admin panel" },
  ];

  await bot.telegram.setMyCommands(defaultCommands, {
    scope: { type: "default" },
  });

  for (const adminId of env.adminIds) {
    const chatId = Number(adminId);
    if (Number.isNaN(chatId)) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid ADMIN_TELEGRAM_IDS value: ${adminId}`);
      continue;
    }

    await bot.telegram.setMyCommands(adminCommands, {
      scope: { type: "chat", chat_id: chatId },
    });
  }

  await bot.launch();
  // eslint-disable-next-line no-console
  console.log("Bot started");
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start bot", error);
  process.exit(1);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
