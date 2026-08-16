# کافه لوچه — بک‌اند API (مرحله ۱)

REST API با **Node.js + Express + MongoDB** (Mongoose).

**مرحله ۱ (فعلی): فقط GET** — محصولات و دسته‌بندی‌ها را می‌دهد.
مرحله بعدی: POST (افزودن)، PUT/PATCH (ویرایش)، DELETE (حذف).

## پیش‌نیازها

- Node.js (نسخه ۱۸ به بالا)
- MongoDB که روی سیستم اجرا باشد (روی پورت 27017)

## نصب و اجرا

```bash
cd backend
npm install        # نصب پکیج‌ها (یک بار)
npm run seed       # پر کردن دیتابیس با داده‌های نمونه
npm run dev        # اجرای سرور (با --watch خودکار ری‌استارت می‌شود)
```

سرور روی `http://localhost:5000` بالا می‌آید.

## تست در مرورگر (ساده‌ترین راه)

- `http://localhost:5000/` — راهنمای endpoint ها
- `http://localhost:5000/api/products` — لیست همهٔ محصولات
- `http://localhost:5000/api/products?category=<شناسهٔ دسته>` — محصولات یک دسته
- `http://localhost:5000/api/products/<شناسهٔ محصول>` — یک محصول
- `http://localhost:5000/api/categories` — لیست دسته‌بندی‌ها

## افزودن دسته (POST)

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "دسر و کیک", "icon": "<svg viewBox=\"0 0 24 24\">...</svg>"}'
```

- `name` (الزامی) — نام دسته
- `icon` (اختیاری) — کلید آیکون آماده (مثل `espressoHot`) یا SVG خام

## ویرایش دسته (PATCH)

```bash
curl -X PATCH http://localhost:5000/api/categories/<شناسهٔ دسته> \
  -H "Content-Type: application/json" \
  -d '{"name": "دسر و بستنی"}'
```

فقط فیلدهایی که می‌فرستی عوض می‌شوند (نام، آیکون یا هر دو).

## حذف دسته (DELETE)

```bash
curl -X DELETE http://localhost:5000/api/categories/<شناسهٔ دسته>
```

دسته و همهٔ محصولات داخلش حذف می‌شوند.

## مخفی‌کردن موقت دسته

هر دسته یک فیلد `hidden` دارد (پیش‌فرض `false`). برای مخفی‌کردن:

```bash
curl -X PATCH http://localhost:5000/api/categories/<شناسهٔ دسته> \
  -H "Content-Type: application/json" \
  -d '{"hidden": true}'
```

و برای برگرداندن: `{"hidden": false}`. دستهٔ مخفی در `GET /api/categories` با `hidden: true` می‌آید اما سایت آن را نشان نمی‌دهد.

## ساختار پروژه

```
backend/
├── server.js          ← نقطهٔ شروع: Express + اتصال MongoDB
├── seed.js            ← پر کردن دیتابیس با دادهٔ نمونه
├── models/
│   ├── Category.js    ← مدل دسته‌بندی
│   └── Product.js     ← مدل محصول
└── routes/
    ├── categories.js  ← GET /api/categories
    └── products.js    ← GET /api/products و GET /api/products/:id
```

## شکل خروجی

یک محصول:

```json
{
  "id": "66f1a2b3c4d5e6f7a8b9c0d1",
  "name": "کاپوچینو",
  "description": "کاپوچینو با فوم شیر",
  "category": { "id": "66f1a2b3c4d5e6f7a8b9c0d0", "name": "بار گرم بر پایه اسپرسو", "icon": "espressoHot" },
  "image": "",
  "available": true
}
```

## تنظیمات (اختیاری)

فایل `.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cafe-luce
```

اگر MongoDB شما آدرس یا پورت دیگری دارد، `MONGODB_URI` را عوض کنید.
