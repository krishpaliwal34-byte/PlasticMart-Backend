import mongoose from "mongoose";
const connectDB = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/PlasticMart")
        console.log("Database is connect")
    }
    catch(err){
     console.log("Database is not connect")
    }
}
export default connectDB;