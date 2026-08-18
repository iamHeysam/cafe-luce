/* مدل کاربر پنل — رمز با scrypt هش و با salt تصادفی ذخیره می‌شود */
const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    // فرمت: "salt:hash" به صورت hex — رمز خام هرگز ذخیره نمی‌شود
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

/* هش‌کردن رمز با scrypt و salt تصادفی */
userSchema.statics.hashPassword = function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

/* بررسی رمز ورودی با هش ذخیره‌شده */
userSchema.methods.verifyPassword = function verifyPassword(password) {
  const [salt, hash] = String(this.passwordHash).split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
};

module.exports = mongoose.model("User", userSchema);
