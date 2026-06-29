import fs from "fs";

import userModel from "../models/user.model.js";

import {uploadToCloudinary,deleteFromCloudinary,} from "../utils/cloudinary.utils.js";

// ======================================================
// Upload Avatar
// ======================================================

export async function uploadAvatar(req,res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old avatar

    if (
      user.avatar?.publicId
    ) {
      await deleteFromCloudinary(
        user.avatar.publicId,
        "image"
      );
    }

    // Upload new avatar

    const uploadedAvatar =
      await uploadToCloudinary(
        req.file.path,
        "PeekHire/Avatar"
      );

    // Delete local file

    fs.unlinkSync(req.file.path);

    // Save avatar

    user.avatar = uploadedAvatar;
    // user.avatar = {
    // url: uploadedAvatar.url,
    // publicId: uploadedAvatar.public_id,
    // };

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Avatar uploaded successfully",
      avatar: user.avatar,
    });

  } catch (error) {

    console.error(error);

    if (
      req.file &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload avatar",
    });

  }
}

// ======================================================
// Get My Profile
// ======================================================

export async function getMyProfile(
  req,
  res
) {
  try {

    const user =
      await userModel
        .findById(req.user.id)
        .select(
          "-password -emailVerificationOtp -emailVerificationOtpExpiry -resetPasswordToken -resetPasswordTokenExpiry"
        );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch profile",
    });

  }
}

// ======================================================
// Update Profile
// ======================================================

export async function updateProfile(
  req,
  res
) {
  try {

    const {
      bio,
      phone,
      location,
      dateOfBirth,
      gender,
      skills,
      experience,
      education,
      socialLinks,
    } = req.body;

    const user =
      await userModel.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (bio !== undefined)
      user.bio = bio;

    if (phone !== undefined)
      user.phone = phone;

    if (location !== undefined)
      user.location = location;

    if (
      dateOfBirth !== undefined
    )
      user.dateOfBirth =
        dateOfBirth;

    if (gender !== undefined)
      user.gender = gender;

    if (skills !== undefined)
      user.skills = skills;

    if (
      experience !== undefined
    )
      user.experience =
        experience;

    if (
      education !== undefined
    )
      user.education =
        education;

    if (
      socialLinks !==
      undefined
    )
      user.socialLinks =
        socialLinks;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      profile: user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
    });

  }
}

// ======================================================
// Public Profile
// ======================================================

export async function getPublicProfile(
  req,
  res
) {
  try {

    const { userId } =
      req.params;

    const user =
      await userModel
        .findById(userId)
        .select(
          "name avatar bio location skills experience education socialLinks resume"
        );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch candidate profile",
    });

  }
}