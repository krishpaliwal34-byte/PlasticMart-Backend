import express from 'express'
const router = express.Router();
import Feedback from '../Schema/Feedback.js'
import auth from '../middleware/Auth.js'
import User from '../Schema/User.js'; 

router.post('/add', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const userName = user ? user.name : "Anonymous";
        const newFeedback = await Feedback.create({
           productId: req.body.productId,
          userId: req.user.id, 
         rating: req.body.rating,
         comment: req.body.comment, 
        date: req.body.date,
        userName: userName
        });

        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
});

router.get('/get/:productId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ productId: req.params.productId });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:reviewId', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.reviewId);

        if (!feedback) {
            return res.status(404).json({ msg: "Review not found" });
        }
        if (feedback.userId !== req.user.id) {
            return res.status(403).json({ msg: "User not authorized" });
        }

        await Feedback.findByIdAndDelete(req.params.reviewId);
        res.json({ msg: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/update/:reviewId', auth, async (req, res) => {
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.reviewId, 
            { comment: req.body.comment }, 
            { new: true }
        );
        res.json(updatedFeedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router