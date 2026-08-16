import express from 'express';
import User from '../Schema/User.js';   
import Seller from '../Schema/Seller.js'; 
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import auth from '../middleware/Auth.js';
import crypto from 'crypto';

const SECRET = 'superkey';
const router = express.Router();

// 1. Signup
// 1. Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, SellerName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        msg: "Email, password and role are required",
      });
    }

    // =========================
    // SELLER SIGNUP
    // =========================
    if (role === "seller") {
      if (!SellerName) {
        return res.status(400).json({
          msg: "Seller Name is required",
        });
      }

      const sellerExist = await Seller.findOne({ email });

      if (sellerExist) {
        return res.status(400).json({
          msg: "Seller Already Exist",
        });
      }

      const hashpass = await bcrypt.hash(password, 10);

      await Seller.create({
        SellerName,
        email,
        password: hashpass,
      });

      return res.status(201).json({
        msg: "Seller Registered Successfully",
      });
    }

    // =========================
    // USER SIGNUP
    // =========================
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        msg: "User Already Exist",
      });
    }

    if (!name) {
      return res.status(400).json({
        msg: "Name is required",
      });
    }

    const hashpass = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashpass,
    });

    return res.status(201).json({
      msg: "User Registered Successfully",
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      msg: "Signup failed",
      error: error.message,
    });
  }
});

// 2. Login
router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;
    let user;

    if (role === 'seller') {
        user = await Seller.findOne({ email });
    } else {
        user = await User.findOne({ email });
    }

    if (!user) return res.status(400).json({ msg: "Account not found" });

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) return res.status(401).json({ msg: "Incorrect Password" });

    const token = jwt.sign(
        { id: user._id, email: user.email, role: role },
        SECRET,
        { expiresIn: "1h" }
    );
    res.json({ 
        msg: "Login Successful", 
        token, 
        email: user.email, 
        userId: user._id,
        role: role 
    });
});

// 3. Forgot Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, role } = req.body;

    const Model = role === "seller" ? Seller : User;

    const foundUser = await Model.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({
        msg: "User Not Found",
      });
    }

    const ResetToken = crypto.randomBytes(32).toString("hex");

    foundUser.resetToken = ResetToken;
    foundUser.resetTokenExpiry = new Date(Date.now() + 3600000);

    await foundUser.save();

    const resetLink =
        `https://plastic-mart-frontend.vercel.app/reset-password/${ResetToken}`;;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PlasticMart Password Reset",
      text: `Click here to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      msg: "Password Reset Link Has Been Sent",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      msg: "Email Error",
    });
  }
});

// 4. Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password, role } = req.body;
    const Model = role === 'seller' ? Seller : User;
    const user = await Model.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: "Token Invalid or Expired" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ msg: "Password Updated Successfully" });
});

// 5. Upload Avatar
router.post("/upload-avatar", async (req, res) => {
    try {
        const { userId, imageBase64, role } = req.body;
        const Model = role === 'seller' ? Seller : User;
        await Model.findByIdAndUpdate(userId, { profilePic: imageBase64 });
        res.json({ message: "Image saved!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 6. Update Profile Name
router.put("/update-profile", async (req, res) => {
    try {
        const { userId, name, role } = req.body;
        
        if (role === 'seller') {
            await Seller.findByIdAndUpdate(userId, { SellerName: name });
        } else {
            await User.findByIdAndUpdate(userId, { name });
        }
        res.json({ message: "Updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});
// 8. Dashboard राउट
router.get("/dashboard", auth, async (req, res) => {
    try {
        const Model = req.user.role === 'seller' ? Seller : User;
        const user = await Model.findById(req.user.id);
        res.json({
            name: req.user.role === 'seller' ? user.SellerName : user.name, 
            profilePic: user.profilePic || "",
            role: req.user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
});

export default router;