
// import cloudinary from "../config/cloudinary.config.js";

// export async function uploadToCloudinary(
//   filePath,
//   folder
// ) {
//   try {
//     const result =
//       await cloudinary.uploader.upload(
//         filePath,
//         {
//           folder,
//           resource_type: "auto",
//         }
//       );

//     return {
//       url: result.secure_url,
//       publicId: result.public_id,
//     };
//   } catch (error) {
//     console.error(
//       "Cloudinary Upload Error:",
//       error
//     );

//     throw new Error(
//       "Cloudinary upload failed"
//     );
//   }
// }

// export async function deleteFromCloudinary(
//   publicId,
//   resourceType = "image"
// ) {
//   try {
//     return await cloudinary.uploader.destroy(
//       publicId,
//       {
//         resource_type: resourceType,
//       }
//     );
//   } catch (error) {
//     console.error(
//       "Cloudinary Delete Error:",
//       error
//     );

//     throw new Error(
//       "Cloudinary delete failed"
//     );
//   }
// }


////UPATED FOR VERCEL 

import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";

// ======================================================
// Upload to Cloudinary (Memory Buffer)
// ======================================================

export function uploadToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

// ======================================================
// Delete From Cloudinary
// ======================================================

export async function deleteFromCloudinary(
  publicId,
  resourceType = "image"
) {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);

    throw new Error("Cloudinary delete failed");
  }
}