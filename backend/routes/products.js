/* روت محصولات — GET (لیست) و POST (افزودن) */
const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");

const router = express.Router();

/* تبدیل سند MongoDB به شکل تمیز برای فرانت‌اند */
function toDto(product) {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category
      ? {
          id: product.category._id,
          name: product.category.name,
          icon: product.category.icon,
        }
      : null,
    image: product.image,
    available: product.available,
    hidden: product.hidden,
  };
}

/*
  GET /api/products
  → لیست همهٔ محصولات
  → فیلتر اختیاری: GET /api/products?category=<شناسهٔ دسته>
*/
router.get("/", async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(filter).populate("category", "name icon");
    res.json(products.map(toDto));
  } catch (err) {
    next(err);
  }
});

/*
  POST /api/products
  → افزودن محصول جدید به یک دسته
  body: {
    "name": "لیموناد",          ← الزامی
    "category": "<شناسهٔ دسته>",  ← الزامی
    "description": "...",        ← اختیاری
    "image": "...",              ← اختیاری
    "available": true             ← اختیاری (پیش‌فرض true)
  }
*/
router.post("/", async (req, res, next) => {
  try {
    const { name, category, description, image, available, hidden } = req.body || {};

    // نام الزامی است
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "نام محصول الزامی است" });
    }

    // دسته باید معتبر و موجود باشد
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "شناسهٔ دسته معتبر نیست" });
    }
    const catExists = await Category.findById(category);
    if (!catExists) {
      return res.status(404).json({ error: "دسته‌ای با این شناسه پیدا نشد" });
    }

    // در یک دسته، نام تکراری مجاز نیست
    const trimmedName = name.trim();
    const duplicate = await Product.findOne({ name: trimmedName, category });
    if (duplicate) {
      return res
        .status(409)
        .json({ error: "محصولی با این نام در این دسته وجود دارد" });
    }

    const product = await Product.create({
      name: trimmedName,
      category,
      description: typeof description === "string" ? description : "",
      image: typeof image === "string" ? image : "",
      available: typeof available === "boolean" ? available : true,
      hidden: typeof hidden === "boolean" ? hidden : false,
    });

    // اطلاعات دسته را هم داخل پاسخ می‌گذاریم
    await product.populate("category", "name icon");
    res.status(201).json(toDto(product));
  } catch (err) {
    next(err);
  }
});

/*
  GET /api/products/:id
  → یک محصول با شناسهٔ آن (مثل: /api/products/64f1a2b3c4d5e6f7a8b9c0d1)
*/
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "شناسهٔ محصول نامعتبر است" });
    }

    const product = await Product.findById(req.params.id).populate(
      "category",
      "name icon"
    );
    if (!product) {
      return res.status(404).json({ error: "محصولی با این شناسه پیدا نشد" });
    }

    res.json(toDto(product));
  } catch (err) {
    next(err);
  }
});

/*
  PATCH /api/products/:id
  → ویرایش محصول — فقط فیلدهایی که می‌فرستی عوض می‌شوند
  body (هر کدام اختیاری): { "name", "category", "description", "image", "available" }
*/
router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "شناسهٔ محصول نامعتبر است" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "محصولی با این شناسه پیدا نشد" });
    }

    const body = req.body || {};
    const updates = {};
    let newCategoryId = product.category;

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return res.status(400).json({ error: "نام محصول نمی‌تواند خالی باشد" });
      }
      updates.name = body.name.trim();
    }

    if (body.category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(body.category)) {
        return res.status(400).json({ error: "شناسهٔ دسته معتبر نیست" });
      }
      const catExists = await Category.findById(body.category);
      if (!catExists) {
        return res.status(404).json({ error: "دسته‌ای با این شناسه پیدا نشد" });
      }
      newCategoryId = body.category;
      updates.category = body.category;
    }

    if (body.description !== undefined) {
      updates.description =
        typeof body.description === "string" ? body.description : "";
    }
    if (body.image !== undefined) {
      updates.image = typeof body.image === "string" ? body.image : "";
    }
    if (body.available !== undefined) {
      if (typeof body.available !== "boolean") {
        return res.status(400).json({ error: "available باید true یا false باشد" });
      }
      updates.available = body.available;
    }
    if (body.hidden !== undefined) {
      if (typeof body.hidden !== "boolean") {
        return res.status(400).json({ error: "hidden باید true یا false باشد" });
      }
      updates.hidden = body.hidden;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "هیچ فیلدی برای ویرایش نفرستاده‌ای" });
    }

    // نام تکراری در همان دسته (غیر از خود این محصول)
    if (updates.name) {
      const duplicate = await Product.findOne({
        name: updates.name,
        category: newCategoryId,
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res
          .status(409)
          .json({ error: "محصولی با این نام در این دسته وجود دارد" });
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("category", "name icon");

    res.json(toDto(updated));
  } catch (err) {
    next(err);
  }
});

/*
  DELETE /api/products/:id
  → حذف محصول
*/
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "شناسهٔ محصول نامعتبر است" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "محصولی با این شناسه پیدا نشد" });
    }

    res.json({ message: `محصول «${product.name}» حذف شد` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
