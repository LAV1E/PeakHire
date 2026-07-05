// import multer from "multer";
// import fs from "fs";
// import path from "path";

// // ======================================================
// // Create Upload Folder
// // ======================================================

// const uploadPath = "uploads";

// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, {
//     recursive: true,
//   });
// }

// // ======================================================
// // Storage
// // ======================================================

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, uploadPath);
//   },

//   filename(req, file, cb) {
//     const uniqueName =
//       Date.now() +
//       "-" +
//       Math.round(Math.random() * 1e9);

//     cb(
//       null,
//       uniqueName +
//         path.extname(file.originalname)
//     );
//   },
// });

// // ======================================================
// // Upload Factory
// // ======================================================

// function createUploader(
//   allowedMimeTypes,
//   maxFileSize
// ) {
//   return multer({
//     storage,

//     limits: {
//       fileSize: maxFileSize,
//     },

//     fileFilter(req, file, cb) {
//       if (
//         allowedMimeTypes.includes(
//           file.mimetype
//         )
//       ) {
//         return cb(null, true);
//       }

//       cb(
//         new Error(
//           "Invalid file type."
//         )
//       );
//     },
//   });
// }

// // ======================================================
// // Resume Upload
// // ======================================================

// export const uploadResume =
//   createUploader(
//     [
//       "application/pdf",

//       "application/msword",

//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ],

//     5 * 1024 * 1024
//   );

// // ======================================================
// // Avatar Upload
// // ======================================================

// export const uploadAvatar =
//   createUploader(
//     [
//       "image/jpeg",

//       "image/png",

//       "image/webp",
//     ],

//     2 * 1024 * 1024
//   );

// // ======================================================
// // Company Logo
// // ======================================================

// export const uploadCompanyLogo =
//   createUploader(
//     [
//       "image/jpeg",

//       "image/png",

//       "image/svg+xml",

//       "image/webp",
//     ],

//     2 * 1024 * 1024
//   );



/////UPDATED FOR VERCEL 

import multer from "multer";

// ======================================================
// Memory Storage (Vercel Compatible)
// ======================================================

const storage = multer.memoryStorage();

// ======================================================
// Upload Factory
// ======================================================

function createUploader(
  allowedMimeTypes,
  maxFileSize
) {
  return multer({
    storage,

    limits: {
      fileSize: maxFileSize,
    },

    fileFilter(req, file, cb) {
      if (
        allowedMimeTypes.includes(
          file.mimetype
        )
      ) {
        return cb(null, true);
      }

      cb(new Error("Invalid file type."));
    },
  });
}

// ======================================================
// Resume Upload
// ======================================================

export const uploadResume = createUploader(
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  5 * 1024 * 1024
);

// ======================================================
// Avatar Upload
// ======================================================

export const uploadAvatar = createUploader(
  [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  2 * 1024 * 1024
);

// ======================================================
// Company Logo
// ======================================================

export const uploadCompanyLogo = createUploader(
  [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
  ],
  2 * 1024 * 1024
);