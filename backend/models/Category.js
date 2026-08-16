/* مدل دسته‌بندی — هر محصول به یک دسته تعلق دارد */
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
    // مخفی‌سازی موقت توسط مدیر: true = در سایت نمایش داده نشود
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true } // createdAt و updatedAt را خودکار می‌سازد
);

module.exports = mongoose.model("Category", categorySchema);
