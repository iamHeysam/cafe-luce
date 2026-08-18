/* =========================================================
   احراز هویت پنل — ورود با نام کاربری + رمز
   - POST /api/login → اگر کاربر و رمز درست بود یک توکن برمی‌گرداند
   - requireAuth → میان‌افزار: فقط با توکن معتبر اجازهٔ ادامه می‌دهد
   کاربران و توکن‌ها در MongoDB ذخیره می‌شوند؛ توکن یک ماه اعتبار دارد
   (مدل User با رمز هش‌شده و مدل Token با TTL).
   ========================================================= */

const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

// مدت اعتبار توکن — یک ماه
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/*
  POST /api/login
  body: { "username": "A-Man", "password": "..." }
  → موفق: 200 با { token } | ناموفق: 401
*/
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(401).json({ error: "رمز اشتباه است" });
  }

  const user = await User.findOne({ username: username.trim() });
  if (!user || !user.verifyPassword(password)) {
    return res.status(401).json({ error: "رمز اشتباه است" });
  }

    const token = crypto.randomBytes(32).toString("hex");
    await Token.create({
      token,
      username: user.username,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });
    res.json({ token, username: user.username });
  } catch {
    res.status(500).json({ error: "خطای سرور" });
  }
});

/* میان‌افزار حفاظت — هدر Authorization: Bearer <token> */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "برای این عملیات باید وارد شوید" });
  }
  try {
    const found = await Token.findOne({ token });
    if (!found || found.expiresAt <= new Date()) {
      if (found) await Token.deleteOne({ token });
      return res.status(401).json({ error: "برای این عملیات باید وارد شوید" });
    }
    req.username = found.username;
    next();
  } catch {
    res.status(500).json({ error: "خطای سرور" });
  }
}

module.exports = { router, requireAuth };
