# کافه لوچه — بک‌اند API

REST API با **Node.js + Express + MongoDB** (Mongoose).

**قابلیت‌ها:** خواندن عمومی (GET) + مدیریت کامل (POST/PATCH/DELETE) با ورود مبتنی بر رمز.
سایت عمومی فقط از GET استفاده می‌کند؛ عملیات تغییر با توکن ورود محافظت می‌شوند.

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

## افزودن محصول (POST /api/products)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "لیموناد", "category": "<شناسهٔ دسته>"}'
```

- `name` (الزامی) — نام محصول
- `category` (الزامی) — شناسهٔ دسته (از GET /api/categories بگیر)
- `description`، `image`، `available` — اختیاری

## ویرایش محصول (PATCH /api/products/:id)

```bash
curl -X PATCH http://localhost:5000/api/products/<شناسهٔ محصول> \
  -H "Content-Type: application/json" \
  -d '{"name": "موهیتو توت‌فرنگی", "available": false}'
```

فقط فیلدهایی که می‌فرستی عوض می‌شوند (نام، دسته، توضیحات، تصویر، موجودی، hidden).

## مخفی‌کردن موقت محصول

مثل دسته‌ها، هر محصول فیلد `hidden` دارد (پیش‌فرض `false`):

```bash
curl -X PATCH http://localhost:5000/api/products/<شناسهٔ محصول> \
  -H "Content-Type: application/json" \
  -d '{"hidden": true}'
```

و برای برگرداندن: `{"hidden": false}`. محصول مخفی در `GET /api/products` با `hidden: true` می‌آید اما در سایت نمایش داده نمی‌شود.

## حذف محصول (DELETE /api/products/:id)

```bash
curl -X DELETE http://localhost:5000/api/products/<شناسهٔ محصول>
```

## ورود به پنل (نام کاربری + رمز)

کاربران در MongoDB ذخیره می‌شوند (مدل `User`، رمز هش‌شده با scrypt).
عملیات تغییر (افزودن/ویرایش/حذف) نیاز به توکن دارند:

```bash
# ۰) کاربر بساز (اگر هنوز ساخته نشده)
npm run create-user -- "A-Man" "12345678"

# ۱) توکن بگیر
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "A-Man", "password": "12345678"}'

# ۲) توکن را در هدر بفرست
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <توکن>" \
  -d '{"name": "دسر و کیک"}'
```

- ساخت/به‌روزرسانی کاربر: `npm run create-user -- <username> <password>` (داده‌های منو دست نمی‌خورد)
- `GET` ها بدون توکن در دسترس‌اند (سایت از آن‌ها استفاده می‌کند)
- پنل مدیریت (`panel.html`) قبل از ورود، فرم رمز نشان می‌دهد و توکن را در sessionStorage نگه می‌دارد

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
├── server.js          ← نقطهٔ شروع: Express + اتصال MongoDB + محافظت از عملیات تغییر
├── seed.js            ← پر کردن دیتابیس با دادهٔ نمونه
├── models/
│   ├── Category.js    ← مدل دسته‌بندی
│   └── Product.js     ← مدل محصول
└── routes/
    ├── auth.js        ← POST /api/login + میان‌افزار requireAuth (توکن)
    ├── categories.js  ← GET/POST/PATCH/DELETE /api/categories
    └── products.js    ← GET/POST/PATCH/DELETE /api/products
```

## پنل مدیریت

پنل گرافیکی در `frontend/panel.html` است (همراه با `frontend/js/panel.js` و `frontend/css/panel.css`).
با رمز پنل وارد می‌شود و دسته‌ها و آیتم‌های منو را مستقیماً از همین API مدیریت می‌کند:
افزودن، ویرایش و حذف دسته و محصول، به‌همراه دکمهٔ خروجی JSON و بازنشانی به دادهٔ پیش‌فرض.

## ساختار پروژه فرانت‌اند

```
frontend/
├── index.html         ← سایت عمومی منو
├── panel.html         ← پنل مدیریت (نیازمند رمز)
├── css/
│   ├── style.css      ← استایل سایت
│   └── panel.css      ← استایل پنل مدیریت
└── js/
    ├── app.js         ← منطق سایت (خواندن از API + fallback)
    └── panel.js       ← منطق پنل (ورود + مدیریت از طریق API)
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
