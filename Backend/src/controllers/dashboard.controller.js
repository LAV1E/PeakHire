import mongoose from "mongoose";

import userModel from "../models/user.model.js";
import ApplicationModel from "../models/application.model.js";
import SavedJobModel from "../models/savedJob.model.js";
import JobModel from "../models/job.model.js";
import CompanyModel from "../models/company.model.js";

import { calculateProfileCompletion } from "../utils/profileCompletion.js";

// =====================================================
// Candidate Dashboard
// =====================================================

export async function getCandidateDashboard(
  req,
  res
) {
  try {

    const candidateId =
      new mongoose.Types.ObjectId(
        req.user.id
      );

    const [
      user,
      applicationAnalytics,
      savedJobsCount,
    ] = await Promise.all([

      userModel.findById(candidateId),

      ApplicationModel.aggregate([

        {
          $match: {
            candidate: candidateId,
            isDeleted: false,
          },
        },

        {
          $facet: {

            totalApplications: [
              {
                $count: "count",
              },
            ],

            statusBreakdown: [
              {
                $group: {
                  _id: "$status",
                  count: {
                    $sum: 1,
                  },
                },
              },
            ],

            recentApplications: [

              {
                $sort: {
                  createdAt: -1,
                },
              },

              {
                $limit: 5,
              },

              {
                $lookup: {
                  from: "jobs",
                  localField: "job",
                  foreignField: "_id",
                  as: "job",
                },
              },

              {
                $unwind: "$job",
              },

              {
                $lookup: {
                  from: "companies",
                  localField:
                    "job.company",
                  foreignField: "_id",
                  as: "company",
                },
              },

              {
                $unwind: {
                  path: "$company",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $project: {

                  status: 1,

                  createdAt: 1,

                  "job._id": 1,

                  "job.title": 1,

                  "job.location": 1,

                  "company.name": 1,

                },
              },

            ],

          },

        },

      ]),

      SavedJobModel.countDocuments({
        candidate: candidateId,
      }),

    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    // ===================================
    // Profile Completion
    // ===================================

    const profileCompletion =
      calculateProfileCompletion(
        user
      );

    // ===================================
    // Status Breakdown
    // ===================================

    // const applicationStats = {};

    // applicationAnalytics[0]
    //   ?.statusBreakdown
    //   ?.forEach((item) => {

    //     applicationStats[item._id] =
    //       item.count;

    //   });

    const applicationStats = {
        UNDER_REVIEW: 0,
        SHORTLISTED: 0,
        INTERVIEW: 0,
        OFFERED: 0,
        HIRED: 0,
        REJECTED: 0,
        WITHDRAWN: 0,
        };

        applicationAnalytics[0]
        ?.statusBreakdown
        ?.forEach((item) => {
            applicationStats[item._id] =
            item.count;
        });

    return res.status(200).json({

      success: true,

      dashboard: {

        profile: {

          completion:
            profileCompletion,

          resumeUploaded:
            !!user.resume?.url,

          avatarUploaded:
            !!user.avatar?.url,

        },

        savedJobs: {

          count:
            savedJobsCount,

        },

        applications: {

          count:

            applicationAnalytics[0]
              ?.totalApplications[0]
              ?.count || 0,

          stats:
            applicationStats,

          recent:

            applicationAnalytics[0]
              ?.recentApplications ||
            [],

        },

      },

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch candidate dashboard",

    });

  }
}

// ======================================================
// Recruiter Dashboard
// ======================================================

export async function getRecruiterDashboard(
  req,
  res
) {
  try {

    const recruiterId =
      new mongoose.Types.ObjectId(
        req.user.id
      );

    const [
      company,
      jobAnalytics,
      applicationAnalytics,
    ] = await Promise.all([

      CompanyModel.findOne({
        owner: recruiterId,
      }).select(
        "name logo location verificationStatus"
      ),

      JobModel.aggregate([

        {
          $match: {
            createdBy: recruiterId,
            isDeleted: false,
          },
        },

        {
          $facet: {

            stats: [

              {
                $group: {

                  _id: null,

                  total: {
                    $sum: 1,
                  },

                  published: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$status",
                            "PUBLISHED",
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },

                  draft: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$status",
                            "DRAFT",
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },

                  closed: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$status",
                            "CLOSED",
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },

                },
              },

            ],

            recentJobs: [

              {
                $sort: {
                  createdAt: -1,
                },
              },

              {
                $limit: 5,
              },

              {
                $project: {
                  title: 1,
                  status: 1,
                  location: 1,
                  createdAt: 1,
                  applicationsCount: 1,
                },
              },

            ],

          },

        },

      ]),

      ApplicationModel.aggregate([

        {
          $match: {
            recruiter: recruiterId,
            isDeleted: false,
          },
        },

        {
          $facet: {

            totalApplications: [

              {
                $count: "count",
              },

            ],

            statusBreakdown: [

              {
                $group: {

                  _id: "$status",

                  count: {
                    $sum: 1,
                  },

                },
              },

            ],

            recentApplications: [

              {
                $sort: {
                  createdAt: -1,
                },
              },

              {
                $limit: 5,
              },

              {
                $lookup: {
                  from: "users",
                  localField:
                    "candidate",
                  foreignField:
                    "_id",
                  as: "candidate",
                },
              },

              {
                $unwind:
                  "$candidate",
              },

              {
                $lookup: {
                  from: "jobs",
                  localField: "job",
                  foreignField:
                    "_id",
                  as: "job",
                },
              },

              {
                $unwind: "$job",
              },

              {
                $project: {

                  status: 1,

                  createdAt: 1,

                  "candidate.name": 1,

                  "candidate.email": 1,

                  "job.title": 1,

                },
              },

            ],

          },

        },

      ]),

    ]);

    const applicationStats = {
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      OFFERED: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    applicationAnalytics[0]
      ?.statusBreakdown
      ?.forEach((item) => {

        applicationStats[item._id] =
          item.count;

      });

    const jobStats =
      jobAnalytics[0]?.stats[0] || {};

    return res.status(200).json({

      success: true,

      dashboard: {

        company,

        jobs: {

          total:
            jobStats.total || 0,

          published:
            jobStats.published || 0,

          draft:
            jobStats.draft || 0,

          closed:
            jobStats.closed || 0,

          recent:
            jobAnalytics[0]
              ?.recentJobs || [],

        },

        applications: {

          count:

            applicationAnalytics[0]
              ?.totalApplications[0]
              ?.count || 0,

          stats:
            applicationStats,

          recent:

            applicationAnalytics[0]
              ?.recentApplications ||
            [],

        },

      },

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch recruiter dashboard",

    });

  }
}

// ======================================================
// Admin Dashboard
// ======================================================

export async function getAdminDashboard(
  req,
  res
) {
  try {

    const [
      userAnalytics,
      companyAnalytics,
      jobAnalytics,
      applicationAnalytics,
    ] = await Promise.all([

      // ==========================
      // Users
      // ==========================

      userModel.aggregate([
        {
          $facet: {

            totalUsers: [
              {
                $count: "count",
              },
            ],

            roleBreakdown: [
              {
                $group: {
                  _id: "$role",
                  count: {
                    $sum: 1,
                  },
                },
              },
            ],

            recentUsers: [
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 5,
              },
              {
                $project: {
                  name: 1,
                  email: 1,
                  role: 1,
                  createdAt: 1,
                },
              },
            ],

          },
        },
      ]),

      // ==========================
      // Companies
      // ==========================

      CompanyModel.aggregate([
        {
          $facet: {

            totalCompanies: [
              {
                $count: "count",
              },
            ],

            verificationStats: [
              {
                $group: {
                  _id: "$verificationStatus",
                  count: {
                    $sum: 1,
                  },
                },
              },
            ],

            recentCompanies: [
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 5,
              },
              {
                $project: {
                  name: 1,
                  location: 1,
                  verificationStatus: 1,
                  createdAt: 1,
                },
              },
            ],

          },
        },
      ]),

      // ==========================
      // Jobs
      // ==========================

      JobModel.aggregate([
        {
          $facet: {

            totalJobs: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $count: "count",
              },
            ],

            statusBreakdown: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $group: {
                  _id: "$status",
                  count: {
                    $sum: 1,
                  },
                },
              },
            ],

            recentJobs: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 5,
              },
              {
                $project: {
                  title: 1,
                  status: 1,
                  location: 1,
                  createdAt: 1,
                },
              },
            ],

          },
        },
      ]),

      // ==========================
      // Applications
      // ==========================

      ApplicationModel.aggregate([
        {
          $facet: {

            totalApplications: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $count: "count",
              },
            ],

            statusBreakdown: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $group: {
                  _id: "$status",
                  count: {
                    $sum: 1,
                  },
                },
              },
            ],

            recentApplications: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 5,
              },
              {
                $lookup: {
                  from: "users",
                  localField: "candidate",
                  foreignField: "_id",
                  as: "candidate",
                },
              },
              {
                $unwind: "$candidate",
              },
              {
                $lookup: {
                  from: "jobs",
                  localField: "job",
                  foreignField: "_id",
                  as: "job",
                },
              },
              {
                $unwind: "$job",
              },
              {
                $project: {
                  status: 1,
                  createdAt: 1,
                  "candidate.name": 1,
                  "candidate.email": 1,
                  "job.title": 1,
                },
              },
            ],

          },
        },
      ]),

    ]);

    // ==========================
    // User Stats
    // ==========================

    const userStats = {
      candidate: 0,
      recruiter: 0,
      admin: 0,
    };

    userAnalytics[0].roleBreakdown.forEach(
      (item) => {
        userStats[item._id] = item.count;
      }
    );

    // ==========================
    // Company Stats
    // ==========================

    const companyStats = {
      PENDING: 0,
      VERIFIED: 0,
      REJECTED: 0,
      SUSPENDED: 0,
    };

    companyAnalytics[0].verificationStats.forEach(
      (item) => {
        companyStats[item._id] = item.count;
      }
    );

    // ==========================
    // Job Stats
    // ==========================

    const jobStats = {
      DRAFT: 0,
      PUBLISHED: 0,
      CLOSED: 0,
    };

    jobAnalytics[0].statusBreakdown.forEach(
      (item) => {
        jobStats[item._id] = item.count;
      }
    );

    // ==========================
    // Application Stats
    // ==========================

    const applicationStats = {
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      OFFERED: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    applicationAnalytics[0].statusBreakdown.forEach(
      (item) => {
        applicationStats[item._id] = item.count;
      }
    );

    return res.status(200).json({

      success: true,

      dashboard: {

        users: {

          total:
            userAnalytics[0]
              ?.totalUsers[0]?.count || 0,

          ...userStats,

          recent:
            userAnalytics[0]
              ?.recentUsers || [],

        },

        companies: {

          total:
            companyAnalytics[0]
              ?.totalCompanies[0]?.count || 0,

          ...companyStats,

          recent:
            companyAnalytics[0]
              ?.recentCompanies || [],

        },

        jobs: {

          total:
            jobAnalytics[0]
              ?.totalJobs[0]?.count || 0,

          stats:
            jobStats,

          recent:
            jobAnalytics[0]
              ?.recentJobs || [],

        },

        applications: {

          total:
            applicationAnalytics[0]
              ?.totalApplications[0]?.count || 0,

          stats:
            applicationStats,

          recent:
            applicationAnalytics[0]
              ?.recentApplications || [],

        },

      },

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin dashboard",
    });

  }
}