import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Already connected
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // Connection is already being established
    if (mongoose.connection.readyState === 2) {
      await mongoose.connection.asPromise();
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
};

export default connectDB;