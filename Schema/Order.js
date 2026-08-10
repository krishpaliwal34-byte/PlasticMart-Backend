import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  sellerId: String,

  productId: String,

  productName: String,

  productPrice: Number,

  name: String,

  phone: String,

  pincode: String,

  address: String,

  area: String,

  city: String,

  state: String,

  // =========================
  // ORDER STATUS
  // =========================

  status: {
    type: String,
    default: "On the way",
  },

  // =========================
  // PAYMENT DETAILS
  // =========================

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  razorpayOrderId: {
    type: String,
    default: null,
  },

  razorpayPaymentId: {
    type: String,
    default: null,
  },

  razorpaySignature: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);

export default Order;