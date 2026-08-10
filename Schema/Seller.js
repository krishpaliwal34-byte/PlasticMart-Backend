import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
    SellerName: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: ""
    },
    gstNumber: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Seller = mongoose.models.Seller || mongoose.model("Seller", SellerSchema);

export default Seller;