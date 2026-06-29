import userModel from "../models/user.model.js";

import { extractResumeText } from "../utils/resumeParser.js";

import { analyzeResume } from "../services/ai.service.js";

// ======================================================
// Analyze Resume
// ======================================================

export async function analyzeMyResume(
  req,
  res
) {
  try {

    const user =
      await userModel.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }

    if (!user.resume?.url) {

      return res.status(404).json({

        success: false,

        message: "Resume not uploaded",

      });

    }

    // =====================================
    // Return Cached Analysis
    // =====================================

    if (
      user.resumeAnalysis?.analyzedAt
    ) {

      return res.status(200).json({

        success: true,

        cached: true,

        analysis:
          user.resumeAnalysis,

      });

    }

    // =====================================
    // Extract Resume
    // =====================================

    const resumeText =
      await extractResumeText(
        user.resume.url
      );

    // =====================================
    // AI Analysis
    // =====================================

    const analysis =
      await analyzeResume(
        resumeText
      );

    // =====================================
    // Save Analysis
    // =====================================

    user.resumeAnalysis = {

      ...analysis,

      analyzedAt:
        new Date(),

    };

    await user.save();

    return res.status(200).json({

      success: true,

      cached: false,

      analysis,

    });

  } catch (error) {

  console.error(
    "AI Controller Error:",
    error
  );

  return res.status(500).json({

    success: false,

    message: error.message,

  });

}
}