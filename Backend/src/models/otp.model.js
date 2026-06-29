import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "EMAIL_VERIFICATION",
        "LOGIN",
        "FORGOT_PASSWORD",
      ],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.model("otp", otpSchema);

export default OtpModel;