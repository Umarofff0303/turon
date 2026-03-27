# Turon Telegram Mini Food App (MVP)

Full-stack MVP loyiha:
- `backend/` - Express + MongoDB REST API
- `bot/` - Telegraf bot (`/start`, `/myorders`, `/contact`, `/admin`)
- `webapp/` - Telegram Mini App (React + Vite + Tailwind)

## 1) Arxitektura

```text
Turon/
  backend/   -> REST API, DB models, order status, telegram notify
  bot/       -> Telegram bot UX + admin flow
  webapp/    -> Mini App UI (menu/cart/checkout/orders/admin web)
```

## 2) Tez ishga tushirish

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Bot
```bash
cd bot
cp .env.example .env
npm install
npm run dev
```

### WebApp
```bash
cd webapp
cp .env.example .env
npm install
npm run dev
```

Telegram ichida test qilganda `ngrok -> webapp (Vite)` ishlating. `webapp/.env` ichida `VITE_API_URL=/` bo'lsa, Vite `/api` so'rovlarini lokal backendga proxy qiladi va Mini App ichida `localhost` muammosi chiqmaydi.

## 3) Muhim ENV lar

### backend/.env
- `MONGODB_URI`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ADMIN_CHAT_IDS`
- `ADMIN_API_KEY`
- `CORS_ORIGIN`
  `CORS_ORIGIN` bitta origin yoki vergul bilan ajratilgan bir nechta origin bo'lishi mumkin.

### bot/.env
- `BOT_TOKEN`
- `BACKEND_URL`
- `WEBAPP_URL`
- `ADMIN_API_KEY`
- `ADMIN_TELEGRAM_IDS`

### webapp/.env
- `VITE_API_URL`
- `VITE_PROXY_TARGET`
- `VITE_RESTAURANT_NAME`

## 4) Asosiy endpointlar

- `POST /api/users/register-or-login`
- `GET /api/users/:telegramId`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/products`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/user/:telegramId`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

## 5) UX flow

`/start` -> bitta CTA (`Menuni ochish`) -> Mini App ochiladi -> darhol Home/Menu sahifa.

## 6) Status flow

`pending -> confirmed -> cooking -> on_the_way -> delivered/cancelled`

Status update bo‘lganda userga Telegram notification yuboriladi.

# Turon
# turon
