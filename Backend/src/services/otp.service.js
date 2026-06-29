import OtpModel from "../models/otp.model.js";

import {
  generateOtp,
  hashOtp,
  getOtpExpiry,
} from "../utils/otp.utils.js";

export async function createOtp(
  user,
  type
) {
  const otp = generateOtp();

  const otpHash = hashOtp(otp);

  await OtpModel.deleteMany({
    email: user.email,
    type,
  });

  await OtpModel.create({
    email: user.email,
    user: user._id,
    otpHash,
    type,
    expiresAt: getOtpExpiry(5),
  });

  return otp;
}