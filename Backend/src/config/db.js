import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {

    const connection = await mongoose.connect(config.MONGO_URI);
    console.log(
      `MongoDB Connected successfully`
    );
  } catch (error) {
    console.error("Database Connection Failed:", error.message);

    // Stop the server if DB connection fails
    process.exit(1);
  }
};

export default connectDB;