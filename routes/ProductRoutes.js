import express from "express";
import Product from "../Schema/Product.js";
import auth from "../middleware/Auth.js"; 

const router = express.Router();

// 1. Get All Products by SellerId 
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.params.sellerId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add Product
router.post("/add", auth, async (req, res) => {
  try {
    const { id, name, image, price, Weight, Warranty, category, description, sellerId } = req.body;
    const newProduct = await Product.create({
      id, name, image, price, Weight, Warranty, category, description, sellerId
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update Product
router.put("/update/:id", auth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});

// 4. Delete Product
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get All Products 
router.get("/all-products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;