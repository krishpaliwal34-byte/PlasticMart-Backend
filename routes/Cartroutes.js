import express from 'express';
import mongoose from 'mongoose';
import Cart from '../Schema/Cart.js';
import CartOrder from '../Schema/Cartorder.js';

const router = express.Router();

router.post('/save', async (req, res) => {
    const { userId, items } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        await Cart.findOneAndUpdate(
            { userId: userId }, 
            { items: items }, 
            { upsert: true, returnDocument: 'after' }
        );
        res.status(200).json({ message: "Cart saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cart Get Route
router.get('/get/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId: userId }); 
        res.status(200).json(cart ? cart.items : []);
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;