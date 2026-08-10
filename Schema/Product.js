import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Seller", 
    required: true 
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  Weight: { type: String },
  Warranty: { type: String },
  category: { 
    type: String, 
    default: "others" 
  },
  description: {
    type: String,
    default: ""
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);