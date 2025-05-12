import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is connected to ${connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};