/* روت دسته‌بندی‌ها — GET، POST، PATCH، DELETE */
const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");

const router = express.Router();

/* تبدیل سند به شکل تمیز برای فرانت‌اند */
function toDto(category, productCount = 0) {
  return {
    id: category._id,
    name: category.name,
    icon: category.icon,
    hidden: category.hidden,
    productCount,
  };
}

/*
  GET /api/categories
  → لیست همهٔ دسته‌بندی‌ها + تعداد محصولات هر دسته
*/
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });

    // شمارش محصولات هر دسته (یک بار از دیتابیس می‌خوانیم)
    const products = await Product.find().select("category");
    const counts = {};
    products.forEach((p) => {
      const key = String(p.category);
      counts[key] = (counts[key] || 0) + 1;
    });

    const result = categories.map((c) => toDto(c, counts[String(c._id)] || 0));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/*
  POST /api/categories
  → ساخت دستهٔ جدید
  body: { "name": "دسر و کیک", "icon": "<svg>...</svg>" }
  - name الزامی است، icon اختیاری است (می‌تواند کلید آیکون یا SVG خام باشد)
*/
router.post("/", async (req, res, next) => {
  try {
    const { name, icon, hidden } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "نام دسته الزامی است" });
    }

    const trimmedName = name.trim();
    const exists = await Category.findOne({ name: trimmedName });
    if (exists) {
      return res.status(409).json({ error: "دسته‌ای با این نام وجود دارد" });
    }

    const category = await Category.create({
      name: trimmedName,
      icon: typeof icon === "string" ? icon : "",
      hidden: typeof hidden === "boolean" ? hidden : false,
    });

    res.status(201).json(toDto(category));
  } catch (err) {
    next(err);
  }
});

/*
  PATCH /api/categories/:id
  → ویرایش دسته — فقط فیلدهایی که می‌فرستی عوض می‌شوند
  body (هر کدام اختیاری): { "name": "...", "icon": "<svg>...</svg>" }
*/
router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "شناسهٔ دسته نامعتبر است" });
    }

    const updates = {};

    if (req.body?.name !== undefined) {
      if (typeof req.body.name !== "string" || !req.body.name.trim()) {
        return res.status(400).json({ error: "نام دسته نمی‌تواند خالی باشد" });
      }
      const trimmedName = req.body.name.trim();
      const duplicate = await Category.findOne({
        name: trimmedName,
        _id: { $ne: req.params.id }, // غیر از خود این دسته
      });
      if (duplicate) {
        return res.status(409).json({ error: "دسته‌ای با این نام وجود دارد" });
      }
      updates.name = trimmedName;
    }

    if (req.body?.icon !== undefined) {
      updates.icon = typeof req.body.icon === "string" ? req.body.icon : "";
    }

    if (req.body?.hidden !== undefined) {
      if (typeof req.body.hidden !== "boolean") {
        return res.status(400).json({ error: "hidden باید true یا false باشد" });
      }
      updates.hidden = req.body.hidden;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "هیچ فیلدی برای ویرایش نفرستاده‌ای" });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true, // نسخهٔ به‌روزشده را برمی‌گرداند
    });
    if (!category) {
      return res.status(404).json({ error: "دسته‌ای با این شناسه پیدا نشد" });
    }

    res.json(toDto(category));
  } catch (err) {
    next(err);
  }
});

/*
  DELETE /api/categories/:id
  → حذف دسته + همهٔ محصولات داخل آن (cascade)
*/
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "شناسهٔ دسته نامعتبر است" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "دسته‌ای با این شناسه پیدا نشد" });
    }

    // حذف همهٔ محصولاتی که به این دسته وصل بودند
    const result = await Product.deleteMany({ category: req.params.id });

    res.json({
      message: `دستهٔ «${category.name}» حذف شد`,
      deletedProducts: result.deletedCount,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
