import mongoose from 'mongoose';

const CartOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            price: Number,
            quantity: Number,
            sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" } 
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { 
        name: String,
        phone: String,
        address: String,
        pincode: String
    },
    status: { type: String, default: "Order Placed" }, 
    date: { type: Date, default: Date.now }
});

const CartOrder = mongoose.models.CartOrder || mongoose.model('CartOrder', CartOrderSchema);

export default CartOrder;