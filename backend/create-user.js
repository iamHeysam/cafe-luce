/* =========================================================
   اسکریپت ساخت/به‌روزرسانی کاربر پنل
   اجرا:  node create-user.js <username> <password>
   مثال:  node create-user.js "A-Man" "12345678"

   اگر کاربر وجود داشته باشد فقط رمزش به‌روزرسانی می‌شود؛
   داده‌های منو (دسته‌ها/محصولات) دست نمی‌خورند.
   ========================================================= */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cafe-luce";

(async () => {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error("❌ استفاده: node create-user.js <username> <password>");
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ متصل شد به MongoDB");

    const passwordHash = User.hashPassword(password);
    const user = await User.findOneAndUpdate(
      { username },
      { username, passwordHash },
      { upsert: true, new: true }
    );

    console.log(`✅ کاربر «${user.username}» آماده شد.`);
  } catch (err) {
    console.error("❌ خطا در ساخت کاربر:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
