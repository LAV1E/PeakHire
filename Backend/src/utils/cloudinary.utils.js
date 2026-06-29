// import cloudinary from "../config/cloudinary.config.js";

// export async function uploadToCloudinary(
//   filePath,
//   folder
// ) {
//   return cloudinary.uploader.upload(
//     filePath,
//     {
//       folder,
//       resource_type: "auto",
//     }
//   );
// }

// export async function deleteFromCloudinary(
//   publicId
// ) {
//   return cloudinary.uploader.destroy(
//     publicId,
//     {
//       resource_type: "raw",
//     }
//   );
// }



import cloudinary from "../config/cloudinary.config.js";

export async function uploadToCloudinary(
  filePath,
  folder
) {
  try {
    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
          folder,
          resource_type: "auto",
        }
      );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(
      "Cloudinary Upload Error:",
      error
    );

    throw new Error(
      "Cloudinary upload failed"
    );
  }
}

export async function deleteFromCloudinary(
  publicId,
  resourceType = "image"
) {
  try {
    return await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary Delete Error:",
      error
    );

    throw new Error(
      "Cloudinary delete failed"
    );
  }
}