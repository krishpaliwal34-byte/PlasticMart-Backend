import express from 'express';
import Category from '../Schema/Category.js'; 
import auth from '../middleware/auth.js'; 

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new category
router.post("/add", auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;