import ApplicationModel from "../models/application.model.js";
import {sendApplicationStatusNotification,} from "../services/notificationTemplates.service.js";
import JobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";

export async function applyJob(req, res) {
  try {
    const { jobId } = req.params;

    const {
      resume,
      coverLetter,
      expectedSalary,
      noticePeriod,
    } = req.body;

    // ==========================
    // Candidate
    // ==========================

    const candidate = await userModel
    .findById(req.user.id)
    .select("role resume");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs",
      });
    }

    // ==========================
    // Job
    // ==========================

    const job = await JobModel.findOne({
      _id: jobId,
      isDeleted: false,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    // ==========================
    // Deadline Check
    // ==========================

    
    if (
        job.applicationDeadline &&
        job.applicationDeadline.getTime() < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // ==========================
    // Duplicate Application
    // ==========================

    const alreadyApplied =
      await ApplicationModel.findOne({
        candidate: req.user.id,
        job: jobId,
        isDeleted: false,
      });

    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // ==========================
    // Resume
    // ==========================

    const resumeToUse =
      resume || candidate.resume;

    if (!resumeToUse) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a resume before applying",
      });
    }

    // ==========================
    // Create Application
    // ==========================

    const application =
      await ApplicationModel.create({
        candidate: candidate._id,

        recruiter: job.createdBy,

        company: job.company,

        job: job._id,

        resume: resumeToUse,

        coverLetter,

        expectedSalary,

        noticePeriod,
      });

    // ==========================
    // Update Job Analytics
    // ==========================

    // job.applicationsCount += 1;

    // job.lastApplicationAt =
    //   new Date();

    // await job.save();

    await JobModel.findByIdAndUpdate(job._id, {
    $inc: { applicationsCount: 1 },
    $set: { lastApplicationAt: new Date() },
    });

    return res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit application",
    });

  }
}

export async function getMyApplications(req, res) {
  try {
    const applications = await ApplicationModel.find({
      candidate: req.user.id,
      isDeleted: false,
    })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name location",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
}

export async function getApplicationsForJob(req, res) {
  try {
    const { jobId } = req.params;

    const job = await JobModel.findById(jobId);

    if (!job || job.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Recruiter Ownership Check
    if (
      req.user.role === "recruiter" &&
      job.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const applications =
      await ApplicationModel.find({
        job: jobId,
        isDeleted: false,
      })
        .populate(
          "candidate",
          "name email phone avatar resume"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      totalApplications:
        applications.length,
      applications,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch applications",
    });

  }
}

export async function getApplicationById(
  req,
  res
) {
  try {

    const { id } = req.params;

    const application =
      await ApplicationModel.findOne({
        _id: id,
        isDeleted: false,
      })
        .populate(
          "candidate",
          "name email phone avatar resume"
        )
        .populate(
          "job"
        )
        .populate(
          "company"
        );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    if (
      req.user.role === "recruiter" &&
      application.recruiter.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch application",
    });

  }
}

export async function updateApplicationStatus(
  req,
  res
) {
  try {

    const { id } = req.params;

    const {
      status,
      recruiterNotes,
    } = req.body;

    const application =
      await ApplicationModel.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    if (
      req.user.role === "recruiter" &&
      application.recruiter.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    const allowedStatus = [
      "UNDER_REVIEW",
      "SHORTLISTED",
      "INTERVIEW",
      "OFFERED",
      "HIRED",
      "REJECTED",
    ];

    if (
      status &&
      !allowedStatus.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid application status",
      });
    }
    

    if (
     application.status === "HIRED"
    ) {
    return res.status(400).json({
        success: false,
        message:
        "Cannot update a hired application",
    });
    }

    let statusChanged = false;

    if (status) {
    application.status = status;
    statusChanged = true;
    }

    if (recruiterNotes !== undefined) {
    application.recruiterNotes =
        recruiterNotes;
    }

    await application.save();

    if (statusChanged) {

    await sendApplicationStatusNotification({

        application,

        sender: req.user.id,

        status,

    });

    }

    return res.status(200).json({

    success: true,

    message:
        "Application updated successfully",

    application,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update application",
    });

  }
}

export async function withdrawApplication(
  req,
  res
) {
  try {

    const { id } = req.params;

    const application =
      await ApplicationModel.findOne({
        _id: id,
        candidate: req.user.id,
        isDeleted: false,
      });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }
     if (
        application.status === "WITHDRAWN"
        ) {
        return res.status(400).json({
            success: false,
            message:
            "Application already withdrawn",
        });
        }
    if (
      application.status ===
      "HIRED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot withdraw hired application",
      });
    }

    application.status =
      "WITHDRAWN";

    await application.save();
    
    await JobModel.findByIdAndUpdate(
    application.job,
    {
        $inc: {
        applicationsCount: -1,
        },
    }
    );
    return res.status(200).json({
      success: true,
      message:
        "Application withdrawn successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to withdraw application",
    });

  }
}

export async function deleteApplication(
  req,
  res
) {
  try {

    const { id } = req.params;

    const application =
      await ApplicationModel.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    application.isDeleted = true;

    await application.save();
    await JobModel.findByIdAndUpdate(
        application.job,
        {
            $inc: {
            applicationsCount: -1,
            },
        }
        );

    return res.status(200).json({
      success: true,
      message:
        "Application deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete application",
    });

  }
}