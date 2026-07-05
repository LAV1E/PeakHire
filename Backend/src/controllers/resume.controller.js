// import fs from "fs";

// import userModel from "../models/user.model.js";

// import {
//   uploadToCloudinary,
//   deleteFromCloudinary,
// } from "../utils/cloudinary.utils.js";


// // ======================================================
// // Upload Resume
// // ======================================================

// export async function uploadResume(
//   req,
//   res
// ) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Resume file is required",
//       });
//     }

//     const user =
//       await userModel.findById(
//         req.user.id
//       );

//     if (!user) {
//       fs.unlinkSync(req.file.path);

//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Delete previous resume if exists

//     if (
//       user.resume?.publicId
//     ) {
//       await deleteFromCloudinary(
//         user.resume.publicId
//       );
//     }

//     // Upload Resume

//     const uploadedResume =
//       await uploadToCloudinary(
//         req.file.path,
//         "PeekHire/Resume"
//       );
//      console.log(uploadedResume);
//     // Delete Local File

//     fs.unlinkSync(req.file.path);

//     // Save Resume

//     user.resume =
//       uploadedResume;

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         "Resume uploaded successfully",
//       resume: user.resume,
//     });

//   } catch (error) {

//     console.error(error);

//     if (
//       req.file &&
//       fs.existsSync(req.file.path)
//     ) {
//       fs.unlinkSync(req.file.path);
//     }

//     return res.status(500).json({
//       success: false,
//       message:
//         "Resume upload failed",
//     });

//   }
// }



// // ======================================================
// // Get Resume
// // ======================================================

// export async function getMyResume(
//   req,
//   res
// ) {
//   try {

//     const user =
//       await userModel.findById(
//         req.user.id
//       );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       resume: user.resume,
//     });

//   } catch (error) {

//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch resume",
//     });

//   }
// }



// // ======================================================
// // Update Resume
// // ======================================================

// export async function updateResume(
//   req,
//   res
// ) {
//   try {

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Resume file is required",
//       });
//     }

//     const user =
//       await userModel.findById(
//         req.user.id
//       );

//     if (!user) {

//       fs.unlinkSync(req.file.path);

//       return res.status(404).json({
//         success: false,
//         message:
//           "User not found",
//       });

//     }

//     // Delete Old Resume

//     if (
//       user.resume?.publicId
//     ) {
//       await deleteFromCloudinary(
//         user.resume.publicId
//       );
//     }

//     // Upload New Resume

//     const uploadedResume =
//       await uploadToCloudinary(
//         req.file.path,
//         "PeekHire/Resume"
//       );

//     fs.unlinkSync(req.file.path);

//     user.resume = {
//       url: uploadedResume.secure_url,
//       publicId:
//         uploadedResume.public_id,
//     };

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         "Resume updated successfully",
//       resume: user.resume,
//     });

//   } catch (error) {

//     console.error(error);

//     if (
//       req.file &&
//       fs.existsSync(req.file.path)
//     ) {
//       fs.unlinkSync(req.file.path);
//     }

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to update resume",
//     });

//   }
// }



// // ======================================================
// // Delete Resume
// // ======================================================

// export async function deleteResume(
//   req,
//   res
// ) {
//   try {

//     const user =
//       await userModel.findById(
//         req.user.id
//       );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "User not found",
//       });
//     }

//     if (
//       !user.resume?.publicId
//     ) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Resume not found",
//       });
//     }

//     // await deleteFromCloudinary(
//     //   user.resume.publicId
//     // );
//     await deleteFromCloudinary(
//     user.resume.publicId,
//     "image"
//     );

//     user.resume = {
//       url: null,
//       publicId: null,
//     };

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         "Resume deleted successfully",
//     });

//   } catch (error) {

//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to delete resume",
//     });

//   }
// }


////update for vercel 
import userModel from "../models/user.model.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js";

// ======================================================
// Upload Resume
// ======================================================

export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete previous resume if exists
    if (user.resume?.publicId) {
      await deleteFromCloudinary(
        user.resume.publicId,
        "image"
      );
    }

    // Upload Resume
    const uploadedResume = await uploadToCloudinary(
      req.file,
      "PeekHire/Resume"
    );

    user.resume = uploadedResume;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
    });
  }
}

// ======================================================
// Get Resume
// ======================================================

export async function getMyResume(req, res) {
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
      resume: user.resume,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
}

// ======================================================
// Update Resume
// ======================================================

export async function updateResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old resume
    if (user.resume?.publicId) {
      await deleteFromCloudinary(
        user.resume.publicId,
        "image"
      );
    }

    // Upload new resume
    const uploadedResume = await uploadToCloudinary(
      req.file,
      "PeekHire/Resume"
    );

    user.resume = uploadedResume;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: user.resume,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
}

// ======================================================
// Delete Resume
// ======================================================

export async function deleteResume(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resume?.publicId) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await deleteFromCloudinary(
      user.resume.publicId,
      "image"
    );

    user.resume = {
      url: null,
      publicId: null,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
}