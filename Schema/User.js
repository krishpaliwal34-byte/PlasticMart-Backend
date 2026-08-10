import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
    name: {
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
    resetToken: String,
    resetTokenExpiry: Date
});

const User = mongoose.models.User || mongoose.model("User", LoginSchema);

export default User;