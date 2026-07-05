// import axios from "axios";
// import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// // ======================================================
// // Extract Resume Text
// // ======================================================

// export async function extractResumeText(
//   resumeUrl
// ) {
//   try {

//     const response =
//       await axios.get(
//         resumeUrl,
//         {
//           responseType: "arraybuffer",
//         }
//       );

//     // Convert Buffer -> Uint8Array
//     const pdfData =
//       new Uint8Array(
//         response.data
//       );

//     const pdf =
//       await getDocument({
//         data: pdfData,
//       }).promise;

//     let text = "";

//     for (
//       let pageNumber = 1;
//       pageNumber <= pdf.numPages;
//       pageNumber++
//     ) {

//       const page =
//         await pdf.getPage(
//           pageNumber
//         );

//       const content =
//         await page.getTextContent();

//       const pageText =
//         content.items
//           .map((item) => {

//             if ("str" in item) {
//               return item.str;
//             }

//             return "";

//           })
//           .join(" ");

//       text += pageText + "\n";

//     }

//     return text
//       .replace(/\s+/g, " ")
//       .trim();

//   } catch (error) {

//     console.error(
//       "Resume Parser Error:",
//       error
//     );

//     throw new Error(
//       "Failed to extract resume text"
//     );

//   }
// }


///vercel update 
import axios from "axios";
import pdf from "pdf-parse";

// ======================================================
// Extract Resume Text
// ======================================================

export async function extractResumeText(resumeUrl) {
  try {
    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    const data = await pdf(buffer);

    return data.text
      .replace(/\s+/g, " ")
      .trim();

  } catch (error) {
    console.error("Resume Parser Error:", error);

    throw new Error("Failed to extract resume text");
  }
}