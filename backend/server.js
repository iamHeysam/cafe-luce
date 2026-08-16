/* =========================================================
   کافه لوچه — سرور API
   مرحله ۱: فقط GET — محصولات و دسته‌بندی‌ها از MongoDB
   ========================================================= */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");

const app = express();

// اجازهٔ دسترسی از فرانت‌اند (مرورگر) به API
app.use(cors());
// خواندن JSON که در body درخواست‌ها می‌آید
app.use(express.json());

/* ---------- صفحهٔ اصلی — راهنمای endpoint ها ---------- */
app.get("/", (req, res) => {
  res.json({
    name: "کافه لوچه API",
    version: "1.0.0",
    مرحله: "۱ — فقط GET",
    endpoints: {
      "GET /api/products": "لیست همهٔ محصولات",
      "GET /api/products?category=<شناسهٔ دسته>": "محصولات یک دستهٔ خاص",
      "GET /api/products/:id": "یک محصول با شناسهٔ آن",
      "GET /api/categories": "لیست همهٔ دسته‌بندی‌ها",
    },
  });
});

/* ---------- روت‌های API ---------- */
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

/* ---------- مسیرهای ناشناخته در /api ---------- */
app.use("/api", (req, res) => {
  res.status(404).json({ error: "این مسیر وجود ندارد" });
});

/* ---------- مدیریت خطا ---------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "خطای سرور" });
});

/* ---------- شروع سرور + اتصال به MongoDB ---------- */
// اگر PORT تنظیم نشده یا صفر باشد (مثلاً بعضی محیط‌ها)، 5000 استفاده می‌شود
const rawPort = Number(process.env.PORT);
const PORT = rawPort > 0 ? rawPort : 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cafe-luce";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ متصل شد به MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 سرور اجرا شد: http://localhost:${PORT}`);
      console.log(`   محصولات:   http://localhost:${PORT}/api/products`);
      console.log(`   دسته‌بندی:  http://localhost:${PORT}/api/categories`);
    });
  })
  .catch((err) => {
    console.error("❌ اتصال به MongoDB ناموفق بود:", err.message);
    process.exit(1);
  });
