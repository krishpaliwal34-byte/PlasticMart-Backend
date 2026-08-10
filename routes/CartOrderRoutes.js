import express from 'express';
import CartOrder from '../Schema/Cartorder.js';
import Cart from '../Schema/Cart.js'; 

const router = express.Router();


router.post('/create', async (req, res) => {
    const { userId, items, totalAmount, shippingAddress } = req.body; 
    
    try {
        const newOrder = new CartOrder({ 
            userId, 
            items,        
            totalAmount,
            shippingAddress
        });
        
        await newOrder.save();
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get-orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await CartOrder.find({ userId: userId }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/update-status/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        await CartOrder.findByIdAndUpdate(orderId, { status: status }); 
        res.json({ message: "Cart Order status updated!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;