import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    productId: { 
        type: String, 
        required: true 
    },
    userId: { type: String, required: true },
    userName: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    comment: { 
        type: String, 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    }
});


const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;