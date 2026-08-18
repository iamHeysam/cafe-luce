/* =========================================================
   احراز هویت پنل — ورود با نام کاربری + رمز
   - POST /api/login → اگر کاربر و رمز درست بود یک توکن برمی‌گرداند
   - requireAuth → میان‌افزار: فقط با توکن معتبر اجازهٔ ادامه می‌دهد
   کاربران در MongoDB ذخیره می‌شوند (مدل User، رمز هش‌شده).
   توکن‌ها در حافظه‌اند؛ با ری‌استارت سرور پاک می‌شوند (دوباره لاگین لازم است).
   ========================================================= */

const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// توکن‌های معتبر (در حافظه)
const tokens = new Set();

/*
  POST /api/login
  body: { "username": "A-Man", "password": "..." }
  → موفق: 200 با { token } | ناموفق: 401
*/
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(401).json({ error: "نام کاربری یا رمز اشتباه است" });
  }

  const user = await User.findOne({ username: username.trim() }).catch(() => null);
  if (!user || !user.verifyPassword(password)) {
    return res.status(401).json({ error: "نام کاربری یا رمز اشتباه است" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  tokens.add(token);
  res.json({ token, username: user.username });
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
