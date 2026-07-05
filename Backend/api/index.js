import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import app from "../src/app.js";

dotenv.config();

await connectDB();

export default app;