import express from 'express';
import Order from '../Schema/Order.js'; 
import auth from '../middleware/Auth.js';

const router = express.Router();

// 1. Purchase Route (ऑर्डर प्लेस करना)
router.post('/purchase', auth, async (req, res) => {
    try {
        const { 
            sellerId, productId, productName, productPrice, 
            name, phone, pincode, address, area, city, state 
        } = req.body;

        const newOrder = await Order.create({
            userId: req.user.id, // टोकन से यूजर आईडी लें
            sellerId, productId, productName, productPrice, 
            name, phone, pincode, address, area, city, state 
        });

        res.status(201).json({ msg: "Order Success", order: newOrder });
    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
});

router.get("/get-all/:sellerId", async (req, res) => {
    try {
        const { sellerId } = req.params;
        const orders = await Order.find({ sellerId: sellerId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err });
    }
});

// 2. Get My Orders (कस्टमर के लिए)
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching orders" });
    }
});
// OrderRoutes.js में इसे अपडेट करें
router.get('/my-orders/:userId', async (req, res) => { // :userId जोड़ें
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching orders" });
    }
});

// 3. Get Seller's Orders (सेलर के लिए - सिर्फ अपने ऑर्डर्स देखें)
router.get("/seller-orders", auth, async (req, res) => {
    if (req.user.role !== 'seller') return res.status(403).json({ msg: "Access Denied" });
    
    try {
        const orders = await Order.find({ sellerId: req.user.id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update Status (सिर्फ सेलर अपने ऑर्डर्स का स्टेटस अपडेट कर सके)
router.put("/update-status/:orderId", auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);
        
        if (order.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own orders" });
        }

        await Order.findByIdAndUpdate(req.params.orderId, { status: status }); 
        res.json({ message: "Status updated!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;