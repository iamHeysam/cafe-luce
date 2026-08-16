/* =========================================================
   احراز هویت سادهٔ پنل — فقط رمز (بدون نام کاربری)
   - POST /api/login → اگر رمز درست بود یک توکن برمی‌گرداند
   - requireAuth → میان‌افزار: فقط با توکن معتبر اجازهٔ ادامه می‌دهد
   توکن‌ها در حافظه‌اند؛ با ری‌استارت سرور پاک می‌شوند (دوباره لاگین لازم است).
   ========================================================= */

const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// رمز از فایل .env خوانده می‌شود (اگر نبود، یک رمز پیش‌فرض)
const PANEL_PASSWORD = process.env.PANEL_PASSWORD || "luce2026";

// توکن‌های معتبر (در حافظه)
const tokens = new Set();

/*
  POST /api/login
  body: { "password": "..." }
  → موفق: 200 با { token } | ناموفق: 401
*/
router.post("/login", (req, res) => {
  const { password } = req.body || {};
  if (typeof password === "string" && password === PANEL_PASSWORD) {
    const token = crypto.randomBytes(32).toString("hex");
    tokens.add(token);
    return res.json({ token });
  }
  res.status(401).json({ error: "رمز اشتباه است" });
});

/* میان‌افزار حفاظت — هدر Authorization: Bearer <token> */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token && tokens.has(token)) {
    return next();
  }
  res.status(401).json({ error: "برای این عملیات باید وارد شوید" });
}

module.exports = { router, requireAuth };
