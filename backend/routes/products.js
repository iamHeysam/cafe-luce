/* روت محصولات — مرحله ۱: فقط GET */
const express = require("express");
const mongoose = require("mongoose");
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

module.exports = router;
