import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function authUser(
  req,
  res,
  next
) {
  try {
    const token =
      req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access token missing",
      });
    }

    const decoded =
      jwt.verify(
        token,
        config.JWT_SECRET
      );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
}