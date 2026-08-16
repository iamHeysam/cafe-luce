/* =========================================================
   اسکریپت seed — داده‌های اولیه را در دیتابیس می‌گذارد
   ⚠️ اجرای آن، داده‌های قبلی دیتابیس cafe-luce را پاک می‌کند
   اجرا:  npm run seed
   ========================================================= */

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cafe-luce";

const DATA = {
  categories: [
    { name: "بار گرم بر پایه اسپرسو", icon: "espressoHot" },
    { name: "بار سرد بر پایه اسپرسو", icon: "espressoCold" },
    { name: "نوشیدنی گرم و دمنوش", icon: "frenchPress" },
    { name: "نوشیدنی سرد", icon: "coldGlass" },
  ],
  products: [
    { name: "اسپرسو سینگل", description: "اسپرسو کلاسیک تک شات", category: "بار گرم بر پایه اسپرسو" },
    { name: "اسپرسو دبل", description: "اسپرسو دو شات", category: "بار گرم بر پایه اسپرسو" },
    { name: "کاپوچینو", description: "کاپوچینو با فوم شیر", category: "بار گرم بر پایه اسپرسو" },
    { name: "کارامل ماکیاتو", description: "اسپرسو با شیر و سس کارامل", category: "بار گرم بر پایه اسپرسو" },
    { name: "ایس لاته", description: "لاته سرد با یخ", category: "بار سرد بر پایه اسپرسو" },
    { name: "ایس موکا", description: "موکا سرد با شکلات", category: "بار سرد بر پایه اسپرسو" },
    { name: "افوگاتو", description: "بستنی وانیلی با اسپرسو", category: "بار سرد بر پایه اسپرسو" },
    { name: "هات چاکلت", description: "شکلات داغ با خامه", category: "نوشیدنی گرم و دمنوش" },
    { name: "چای ماسالا", description: "چای با ادویه‌های هندی", category: "نوشیدنی گرم و دمنوش" },
    { name: "تی لاته زعفران پسته", description: "چای لاته با زعفران و پسته", category: "نوشیدنی گرم و دمنوش" },
    { name: "موهیتو کلاسیک", description: "نعناع، لیمو و سودا", category: "نوشیدنی سرد" },
    { name: "مارین", description: "نوشیدنی سرد خنک مخصوص", category: "نوشیدنی سرد" },
    { name: "ورونا", description: "نوشیدنی سرد خوش‌عطر", category: "نوشیدنی سرد" },
  ],
};

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ متصل شد به MongoDB");

    // پاک کردن داده‌های قبلی تا دوباره‌اجرا تمیز باشد
    await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

    // ساخت دسته‌ها و نگه‌داشتن نام → شناسه برای وصل کردن محصولات
    const categories = await Category.insertMany(DATA.categories);
    const categoryIdByName = {};
    categories.forEach((c) => (categoryIdByName[c.name] = c._id));

    const products = DATA.products.map((p) => ({
      ...p,
      category: categoryIdByName[p.category],
    }));
    await Product.insertMany(products);

    console.log(`   ${categories.length} دسته و ${products.length} محصول ساخته شد.`);
    console.log("✅ seed تمام شد.");
  } catch (err) {
    console.error("❌ خطا در seed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
