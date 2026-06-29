import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

export async function analyzeResume(
  resumeText
) {
  try {

    const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume carefully.

Return ONLY valid JSON.

{
  "summary":"",
  "skills":[],
  "strengths":[],
  "missingSkills":[],
  "suggestions":[],
  "atsScore":0
}

Rules:

- Do not wrap the response inside \`\`\`json.
- Return only JSON.
- ATS score must be between 0 and 100.
- Suggestions should be practical.
- Missing skills should contain only technical skills.

Resume:

${resumeText}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    let text =
      response.text.trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {

    console.error(
      "Gemini Error:",
      error
    );

    // Gemini server busy
    if (
      error.status === 503
    ) {

      return {

        summary:
          "AI service is temporarily busy.",

        skills: [],

        strengths: [],

        missingSkills: [],

        suggestions: [
          "Please try again in a few seconds."
        ],

        atsScore: 0,

      };

    }

    // Invalid JSON from Gemini
    if (
      error instanceof SyntaxError
    ) {

      throw new Error(
        "Gemini returned an invalid response."
      );

    }

    throw error;

  }
}