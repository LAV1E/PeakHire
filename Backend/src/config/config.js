import dotenv from "dotenv";
// import cloudinary from "./cloudinary.config.js";
dotenv.config();

if(!process.env.PORT){
    throw new Error("PORT is not in environment variables")
}
if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not in environment variables")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not in environment variables")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not in environment variables")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not in environment variables")
}
if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not in environment variables")
}
if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not in environment variables")
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error(
    "CLOUDINARY_CLOUD_NAME is missing"
  );
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error(
    "CLOUDINARY_API_KEY is missing"
  );
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error(
    "CLOUDINARY_API_SECRET is missing"
  );
}
if(!process.env.GEMINI_API_KEY){
    throw new Error(
    "GEMINI_API_KEY is missing"
  );
}


const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER:process.env.GOOGLE_USER,
  CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
  GEMINI_API_KEY:process.env.GEMINI_API_KEY,
};
console.log({
  GOOGLE_USER: config.GOOGLE_USER,
  CLIENT_ID: !!config.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: !!config.GOOGLE_CLIENT_SECRET,
  REFRESH_TOKEN: !!config.GOOGLE_REFRESH_TOKEN,
});

export default config;