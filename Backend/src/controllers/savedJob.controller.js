import SavedJobModel from "../models/savedJob.model.js";
import JobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";

// =====================================================
// Save Job
// =====================================================

export async function saveJob(req, res) {
  try {
    const { jobId } = req.params;

    // Candidate Check
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can save jobs",
      });
    }

    // Job Check
    const job = await JobModel.findOne({
      _id: jobId,
      isDeleted: false,
      status: "PUBLISHED",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Duplicate Check
    const alreadySaved =
      await SavedJobModel.findOne({
        candidate: req.user.id,
        job: jobId,
      });

    if (alreadySaved) {
      return res.status(409).json({
        success: false,
        message: "Job already saved",
      });
    }

    const savedJob =
      await SavedJobModel.create({
        candidate: req.user.id,
        job: jobId,
      });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save job",
    });

  }
}

// =====================================================
// Get My Saved Jobs
// =====================================================

export async function getSavedJobs(
  req,
  res
) {
  try {

    let savedJobs =
      await SavedJobModel.find({
        candidate: req.user.id,
      })
        .populate({
          path: "job",
          match: {
            isDeleted: false,
            status: "PUBLISHED",
          },
          populate: {
            path: "company",
            select: "name logo location",
          },
        })
        .sort({
          createdAt: -1,
        });

    // Remove deleted / unpublished jobs

    savedJobs = savedJobs.filter(
      (savedJob) => savedJob.job
    );

    return res.status(200).json({
      success: true,
      totalSavedJobs:
        savedJobs.length,
      savedJobs,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch saved jobs",
    });

  }
}

// =====================================================
// Remove Saved Job
// =====================================================

export async function removeSavedJob(
  req,
  res
) {
  try {

    const { jobId } = req.params;

    const savedJob =
      await SavedJobModel.findOne({
        candidate: req.user.id,
        job: jobId,
      });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message:
          "Saved job not found",
      });
    }

    await savedJob.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Saved job removed successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove saved job",
    });

  }
}

// =====================================================
// Check Saved Status
// =====================================================

export async function checkSavedJob(
  req,
  res
) {
  try {

    const { jobId } = req.params;

    const saved =
      await SavedJobModel.findOne({
        candidate: req.user.id,
        job: jobId,
      });

    return res.status(200).json({
      success: true,
      isSaved: !!saved,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to check saved job",
    });

  }
}