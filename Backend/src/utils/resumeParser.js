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
import PDFParser from "pdf2json";

// ======================================================
// Extract Resume Text
// ======================================================

export async function extractResumeText(resumeUrl) {
  try {
    // Download PDF
    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    const pdfBuffer = Buffer.from(response.data);

    const parser = new PDFParser();

    return await new Promise((resolve, reject) => {
      parser.on("pdfParser_dataError", (err) => {
        reject(err.parserError);
      });

      parser.on("pdfParser_dataReady", (pdfData) => {
        let text = "";

        pdfData.Pages.forEach((page) => {
          page.Texts.forEach((textItem) => {
            textItem.R.forEach((run) => {
              text += decodeURIComponent(run.T) + " ";
            });

            text += "\n";
          });

          text += "\n";
        });

        resolve(
          text.replace(/\s+/g, " ").trim()
        );
      });

      parser.parseBuffer(pdfBuffer);
    });

  } catch (error) {
    console.error("Resume Parser Error:", error);

    throw new Error("Failed to extract resume text");
  }
}