/* مدل توکن ورود پنل — برای «مرا به خاطر بسپار» تا یک ماه در دیتابیس می‌ماند */
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    // بعد از این زمان دیگر معتبر نیست و توسط TTL ایندکس حذف می‌شود
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// حذف خودکار توکن‌های منقضی توسط MongoDB
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);
