import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function generateAccessToken(
  user
) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(
  user
) {
  return jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}