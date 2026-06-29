import InterviewModel from "../models/interview.model.js";
import ApplicationModel from "../models/application.model.js";
import {sendInterviewScheduledNotification,sendInterviewCancelledNotification,} from "../services/notificationTemplates.service.js";


export async function scheduleInterview(
  req,
  res
) {
  try {

    const {
      applicationId,
      title,
      scheduledAt,
      duration,
      mode,
      meetingLink,
      location,
      recruiterNotes,
      round,
      timezone,
    } = req.body;

    if (
      !applicationId ||
      !title ||
      !scheduledAt ||
      !duration ||
      !mode
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }


    const application =
      await ApplicationModel.findOne({
        _id: applicationId,
        isDeleted: false,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }


    if (
      application.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedStatus = [
      "UNDER_REVIEW",
      "SHORTLISTED",
         "INTERVIEW",
    ];

    if (
      !allowedStatus.includes(
        application.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview cannot be scheduled for this application",
      });
    }

    // ==========================
    // Interview Date
    // ==========================

    if (
      new Date(scheduledAt) <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview date must be in the future",
      });
    }

    // ==========================
    // Mode Validation
    // ==========================

    if (
      mode === "ONLINE" &&
      !meetingLink
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting link is required",
      });
    }

    if (
      mode === "OFFLINE" &&
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview location is required",
      });
    }

    // ==========================
    // Duplicate Interview
    // ==========================

    const existingInterview =
      await InterviewModel.findOne({
        application: applicationId,
        round: round || 1,
        status: "SCHEDULED",
        isDeleted: false,
      });

    if (existingInterview) {
      return res.status(409).json({
        success: false,
        message:
          "Interview already scheduled for this round",
      });
    }

    // ==========================
    // Create Interview
    // ==========================

    const interview =
      await InterviewModel.create({

        application:
          application._id,

        candidate:
          application.candidate,

        recruiter:
          application.recruiter,

        company:
          application.company,

        job:
          application.job,

        title,

        round:
          round || 1,

        scheduledAt,

        duration,

        timezone:
          timezone ||
          "Asia/Kolkata",

        mode,

        meetingLink:
          meetingLink || "",

        location:
          location || "",

        recruiterNotes:
          recruiterNotes || "",

      });
    
      await sendInterviewScheduledNotification({

        interview,

        sender: req.user.id,

        });
    // ==========================
    // Update Application
    // ==========================

    // application.status =
    //   "INTERVIEW";

    // await application.save();
    if (
        application.status !==
        "INTERVIEW"
    ){
        application.status =
        "INTERVIEW";

        await application.save();
    }

    return res.status(201).json({

      success: true,

      message:
        "Interview scheduled successfully",

      interview,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to schedule interview",
    });

  }
}

// =====================================================
// Get Recruiter Interviews
// =====================================================

export async function getRecruiterInterviews(
  req,
  res
) {
  try {

    const {
      status,
      mode,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      recruiter: req.user.id,
      isDeleted: false,
    };

    if (status) {
      query.status = status;
    }

    if (mode) {
      query.mode = mode;
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const [
      interviews,
      totalInterviews,
    ] = await Promise.all([

      InterviewModel.find(query)

        .populate(
          "candidate",
          "name email avatar"
        )

        .populate(
          "company",
          "name logo"
        )

        .populate(
          "job",
          "title location"
        )

        .populate(
          "application",
          "status"
        )

        .sort({
          status:1,
          scheduledAt: 1,
        })

        .skip(skip)

        .limit(Number(limit)),

      InterviewModel.countDocuments(
        query
      ),

    ]);

    return res.status(200).json({

      success: true,

      totalInterviews,

      currentPage:
        Number(page),

      totalPages:
        Math.ceil(
          totalInterviews /
            Number(limit)
        ),

      interviews,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch interviews",

    });

  }
}

// =====================================================
// Get Candidate Interviews
// =====================================================

export async function getCandidateInterviews(
  req,
  res
) {
  try {

    const {
      status,
      mode,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      candidate: req.user.id,
      isDeleted: false,
    };

    if (status) {
      query.status = status;
    }

    if (mode) {
      query.mode = mode;
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const [
      interviews,
      totalInterviews,
    ] = await Promise.all([

      InterviewModel.find(query)

        .populate(
          "company",
          "name logo"
        )

        .populate(
          "job",
          "title location"
        )

        .populate(
          "recruiter",
          "name email"
        )

        .sort({
          scheduledAt: 1,
        })

        .skip(skip)

        .limit(Number(limit)),

      InterviewModel.countDocuments(
        query
      ),

    ]);

    return res.status(200).json({

      success: true,

      totalInterviews,

      currentPage: Number(page),

      totalPages: Math.ceil(
        totalInterviews /
          Number(limit)
      ),

      interviews,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interviews",
    });

  }
}

// =====================================================
// Get Interview By Id
// =====================================================

    export async function getInterviewById(
    req,
    res
    ) {
    try {

        const { id } = req.params;

        const interview =
        await InterviewModel.findOne({
            _id: id,
            isDeleted: false,
        })
            .populate(
            "candidate",
            "name email avatar"
            )
            .populate(
            "recruiter",
            "name email"
            )
            .populate(
            "company",
            "name logo location"
            )
            .populate(
            "job",
            "title location employmentType"
            )
            .populate(
            "application",
            "status expectedSalary coverLetter"
            );

        if (!interview) {
        return res.status(404).json({
            success: false,
            message: "Interview not found",
        });
        }

        if (
        req.user.role === "candidate" &&
        interview.candidate._id.toString() !== req.user.id
        ) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
        }

        if (
        req.user.role === "recruiter" &&
        interview.recruiter._id.toString() !== req.user.id
        ) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
        }

        return res.status(200).json({
        success: true,
        interview,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
        success: false,
        message: "Failed to fetch interview",
        });

    }
    }

// =====================================================
// Update Interview
// =====================================================

export async function updateInterview(
  req,
  res
) {
  try {

    const { id } = req.params;

    const {
      scheduledAt,
      duration,
      meetingLink,
      location,
      recruiterNotes,
      feedback,
      rating,
      status,
    } = req.body;

    const interview =
      await InterviewModel.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (
      interview.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      interview.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled interview cannot be updated",
      });
    }

    if (
      scheduledAt !== undefined
    ) {

      const interviewDate =
        new Date(scheduledAt);

      if (
        isNaN(
          interviewDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview date",
        });
      }

      if (
        interviewDate <=
        new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Interview date must be in the future",
        });
      }

      interview.scheduledAt =
        interviewDate;

    }

    if (
      duration !== undefined
    ) {
      interview.duration =
        duration;
    }

    if (
      meetingLink !== undefined
    ) {
      interview.meetingLink =
        meetingLink;
    }

    if (
      location !== undefined
    ) {
      interview.location =
        location;
    }

    if (
      recruiterNotes !==
      undefined
    ) {
      interview.recruiterNotes =
        recruiterNotes;
    }

    if (
      feedback !== undefined
    ) {
      interview.feedback =
        feedback;
    }

    if (
      rating !== undefined
    ) {
      interview.rating =
        rating;
    }

    if (
      status !== undefined
    ) {

      const allowedStatus = [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ];

      if (
        !allowedStatus.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview status",
        });
      }

      interview.status =
        status;

      if (
        status ===
        "COMPLETED"
      ) {

        await ApplicationModel.findByIdAndUpdate(
          interview.application,
          {
            status:
              "UNDER_REVIEW",
          }
        );

      }

    }

    await interview.save();

    return res.status(200).json({

      success: true,

      message:
        "Interview updated successfully",

      interview,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to update interview",

    });

  }
}

// =====================================================
// Cancel Interview
// =====================================================

export async function cancelInterview(
  req,
  res
) {
  try {

    const { id } =
      req.params;

    const interview =
      await InterviewModel.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    if (
      interview.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    if (
      interview.status ===
      "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed interview cannot be cancelled",
      });
    }

    if (
      interview.status ===
      "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview is already cancelled",
      });
    }

    interview.status =
      "CANCELLED";

    await interview.save();
     
    await sendInterviewCancelledNotification({

    interview,

    sender: req.user.id,

    });
    return res.status(200).json({

      success: true,

      message:
        "Interview cancelled successfully",

      interview,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to cancel interview",

    });

  }
}