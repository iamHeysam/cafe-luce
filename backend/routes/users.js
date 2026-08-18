/* =========================================================
   مدیریت کاربران پنل (فقط با توکن معتبر)
   - POST /api/users                      → ساخت مدیر جدید
   - GET  /api/users                      → لیست مدیرها
   - PATCH /api/users/:username/password  → تغییر رمز (و باطل‌کردن نشست‌ها)
   ========================================================= */

const express = require("express");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

const MIN_PASSWORD_LENGTH = 6;

/* ساخت مدیر جدید */
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const name = typeof username === "string" ? username.trim() : "";

    if (!name) {
      return res.status(400).json({ error: "نام کاربری را وارد کنید" });
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ error: `رمز باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد` });
    }

    const exists = await User.findOne({ username: name });
    if (exists) {
      return res.status(409).json({ error: "کاربری با این نام وجود دارد" });
    }

    const user = await User.create({
      username: name,
      passwordHash: User.hashPassword(password),
    });
    res.status(201).json({ username: user.username });
  } catch {
    res.status(500).json({ error: "خطای سرور" });
  }
});

/* لیست مدیرها (بدون هش رمز) */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username createdAt").sort({ createdAt: 1 });
    res.json(users);
  } catch {
    res.status(500).json({ error: "خطای سرور" });
  }
});

/* تغییر رمز خودِ کاربرِ واردشده — نیازمند رمز قبلی */
router.patch("/me/password", async (req, res) => {
  try {
    const { currentPassword, password } = req.body || {};

    if (typeof currentPassword !== "string" || !currentPassword) {
      return res.status(400).json({ error: "رمز قبلی را وارد کنید" });
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ error: `رمز باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد` });
    }

    const user = await User.findOne({ username: req.username });
    if (!user || !user.verifyPassword(currentPassword)) {
      return res.status(403).json({ error: "رمز قبلی اشتباه است" });
    }

    user.passwordHash = User.hashPassword(password);
    await user.save();

    // با تغییر رمز، همهٔ نشست‌های آن کاربر باطل می‌شود (دوباره ورود لازم است)
    await Token.deleteMany({ username: user.username });

    res.json({ username: user.username, message: "رمز تغییر کرد" });
  } catch {
    res.status(500).json({ error: "خطای سرور" });
  }
});

/* تغییر رمز توسط مدیر — همهٔ نشست‌های آن کاربر هم باطل می‌شود */
router.patch("/:username/password", async (req, res) => {
  try {
    const username = String(req.params.username || "").trim();
    const { password } = req.body || {};

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ error: `رمز باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد` });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "کاربر پیدا نشد" });
    }

    user.passwordHash = User.hashPassword(password);
    await user.save();

    // با تغییر رمز، همهٔ نشست‌های آن کاربر باطل می‌شود (دوباره ورود لازم است)
    await Token.deleteMany({ username });

    res.json({ username: user.username, message: "رمز تغییر کرد" });
  } catch {
    res.status(500).json({ error: "خطای سرور" });
  }
});

module.exports = router;
