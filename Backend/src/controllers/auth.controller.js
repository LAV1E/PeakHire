import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import OtpModel from "../models/otp.model.js";
import SessionModel from "../models/session.model.js";
import config from "../config/config.js";
import { createOtp } from "../services/otp.service.js";
import { createSession } from "../services/session.service.js";
import { sendEmail } from "../services/email.service.js";
import { getOtpHtml } from "../utils/emailTemplates.js";
import {hashOtp,} from "../utils/otp.utils.js";
import {generateAccessToken, generateRefreshToken,} from "../utils/token.utils.js";


export async function registerUser(req, res) {
  try {
    const {name,email,password,role,} = req.body;

    // Validation
    if (!name ||!email ||!password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required",
      });
    }

    // Allowed Roles
    const allowedRoles = ["candidate","recruiter",];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role selected",
      });
    }

    // Existing User Check
    const existingUser = await userModel.findOne({ email,});

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered",
      });
    }

    // Create User
    const user = await userModel.create({
        name,
        email,
        password,
        role,
        isEmailVerified: false,
      });

    // Generate Verification OTP
    const otp = await createOtp( user,"EMAIL_VERIFICATION");

    // Send Email
    console.log("Generated OTP:", otp);
    console.log("Before sendEmail");
    await sendEmail(
      user.email,
      "Verify Your Email",
      `Your OTP is ${otp}`,
      getOtpHtml(
        otp,
        "Email Verification"
      )
    );
    
    console.log("After sendEmail");
    
    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
        user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while registering user",
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find User
    const user = await userModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Email Verification Check
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in",
      });
    }

    // Account Status Check
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // Password Validation
    const isValidPassword =
      await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update Last Login
    user.lastLogin = new Date();
    await user.save();

    // Generate Tokens
    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    const sessionCount =
        await SessionModel.countDocuments({
            user: user._id,
        });

        if (sessionCount >= 5) {

          await SessionModel.findOneAndDelete(
          { user: user._id },
          {
            sort: { createdAt: 1 },
          }
        );
        // return res.status(403).json({
        //     success: false,
        //     message:
        //     "Maximum device limit reached",
        // });
    }

    // Create Session
    await createSession(
      req,
      user,
      refreshToken
    );

    // Access Token Cookie
    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          24 * 60 * 60 * 1000,
      }
    );

    // Refresh Token Cookie
    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged in successfully",

      accessToken,

      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
          user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while logging in",
    });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Current User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
}

export async function logoutUser(
  req,
  res
) {
  try {
    const refreshTokenValue =
      req.cookies.refreshToken;

    if (refreshTokenValue) {
      await SessionModel.deleteOne({
        refreshToken:
          refreshTokenValue,
      });
    }

    res.clearCookie(
      "accessToken"
    );

    res.clearCookie(
      "refreshToken"
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Logout failed",
    });
  }
}

export async function logoutAllDevices(
  req,
  res
) {
  try {
    await SessionModel.deleteMany({
      user: req.user.id,
    });

    res.clearCookie(
      "accessToken"
    );

    res.clearCookie(
      "refreshToken"
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged out from all devices",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Operation failed",
    });
  }
}

export async function getSessions(
  req,
  res
) {
  try {
    const sessions =
    await SessionModel.find({
        user: req.user.id,
    }).select("-refreshToken");

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch sessions",
    });
  }
}

export async function verifyEmail(
  req,
  res
) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required",
      });
    }

    const otpHash = hashOtp(otp);

    const otpDoc =
      await OtpModel.findOne({
        email,
        otpHash,
        type: "EMAIL_VERIFICATION",
      });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await userModel.findByIdAndUpdate(
      otpDoc.user,
      {
        isEmailVerified: true,
      }
    );

    await OtpModel.deleteMany({
      email,
      type: "EMAIL_VERIFICATION",
    });

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify email",
    });
  }
}

export async function sendLoginOtp(
  req,
  res
) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }

    const otp = await createOtp(
      user,
      "LOGIN"
    );

    await sendEmail(
      user.email,
      "Login OTP",
      `Your OTP is ${otp}`,
      getOtpHtml(otp, "Login")
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
}

export async function verifyLoginOtp(
  req,
  res
) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required",
      });
    }

    const otpHash = hashOtp(otp);

    const otpDoc =
      await OtpModel.findOne({
        email,
        otpHash,
        type: "LOGIN",
      });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user =
      await userModel.findById(
        otpDoc.user
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Account is inactive",
      });
    }

    await OtpModel.deleteMany({
      email,
      type: "LOGIN",
    });

    user.lastLogin = new Date();
    await user.save();

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    await createSession(
      req,
      user,
      refreshToken
    );

    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          24 * 60 * 60 * 1000,
      }
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged in successfully",

      accessToken,
      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
          user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed",
    });
  }
}

export async function forgotPassword(
  req,
  res
) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = await createOtp(
      user,
      "FORGOT_PASSWORD"
    );

    await sendEmail(
      user.email,
      "Reset Password OTP",
      `Your OTP is ${otp}`,
      getOtpHtml(
        otp,
        "Password Reset"
      )
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset OTP sent",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to send reset OTP",
    });
  }
}

export async function resetPassword(
  req,
  res
) {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and new password are required",
      });
    }

    const otpHash = hashOtp(otp);

    const otpDoc =
      await OtpModel.findOne({
        email,
        otpHash,
        type: "FORGOT_PASSWORD",
      });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user =
      await userModel.findById(
        otpDoc.user
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;

    await user.save();

    await OtpModel.deleteMany({
      email,
      type: "FORGOT_PASSWORD",
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset password",
    });
  }
}

export async function refreshToken(
  req,
  res
) {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "Refresh token missing",
      });
    }

    const decoded =
      jwt.verify(
        refreshToken,
        config.JWT_SECRET
      );

    const session =
      await SessionModel.findOne({
        refreshToken,
      });

    if (!session) {
      return res.status(401).json({
        success: false,
        message:
          "Session expired",
      });
    }

    const user =
      await userModel.findById(
        decoded.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const accessToken =
      generateAccessToken(user);

    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        sameSite: "strict",
        maxAge:
          24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid refresh token",
    });
  }
}