import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";



dotenv.config();

connectDB()

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running ")
})