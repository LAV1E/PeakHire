import userModel from "../models/user.model.js";
import CompanyModel from "../models/company.model.js";
import JobModel from "../models/job.model.js";
import ApplicationModel from "../models/application.model.js";
import InterviewModel from "../models/interview.model.js";
import OfferModel from "../models/offer.model.js";

export async function getAdminDashboard(req, res) {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalCompanies,
      pendingCompanies,
      totalJobs,
      totalApplications,
      totalInterviews,
      totalOffers,

      recentUsers,
      recentCompanies,
      recentJobs,
      recentApplications,
      recentInterviews,
      recentOffers,
      pendingCompaniesList,
    ] = await Promise.all([

      // ==========================
      // Dashboard Cards
      // ==========================

      userModel.countDocuments(),

      userModel.countDocuments({
        role: "candidate",
      }),

      userModel.countDocuments({
        role: "recruiter",
      }),

      CompanyModel.countDocuments(),

      CompanyModel.countDocuments({
        isVerified: false,
      }),

      JobModel.countDocuments(),

      ApplicationModel.countDocuments(),

      InterviewModel.countDocuments(),

      OfferModel.countDocuments(),

      // ==========================
      // Recent Users
      // ==========================

      userModel
        .find()
        .select("name email role isActive createdAt")
        .sort({ createdAt: -1 })
        .limit(10),

      // ==========================
      // Recent Companies
      // ==========================

      CompanyModel.find()
        .populate("owner", "name email")
        .populate("verifiedBy", "name email")
        .select(
          "name owner isVerified verifiedBy verifiedAt createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(10),

      // ==========================
      // Recent Jobs
      // ==========================

      JobModel.find()
        .populate("company", "name")
        .populate("createdBy", "name email")
        .select(
          "title status company createdBy createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(10),

      // ==========================
      // Recent Applications
      // ==========================

      ApplicationModel.find()
        .populate("candidate", "name email")
        .populate("recruiter", "name email")
        .populate("company", "name")
        .populate("job", "title")
        .select(
          "candidate recruiter company job status createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(10),

      // ==========================
      // Recent Interviews
      // ==========================

      InterviewModel.find()
        .populate("candidate", "name email")
        .populate("recruiter", "name email")
        .populate("company", "name")
        .populate("job", "title")
        .select(
          "candidate recruiter company job title scheduledAt status createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(10),

      // ==========================
      // Recent Offers
      // ==========================

      OfferModel.find()
        .populate("candidate", "name email")
        .populate("recruiter", "name email")
        .populate("company", "name")
        .populate("job", "title")
        .select(
          "candidate recruiter company job title salary status joiningDate expiryDate createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(10),

      // ==========================
      // Pending Companies
      // ==========================

      CompanyModel.find({
        isVerified: false,
      })
        .populate("owner", "name email")
        .select(
          "name owner createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalCompanies,
        pendingCompanies,
        totalJobs,
        totalApplications,
        totalInterviews,
        totalOffers,
      },

      recentUsers,

      recentCompanies,

      recentJobs,

      recentApplications,

      recentInterviews,

      recentOffers,

      pendingCompaniesList,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
}

export async function getAllUsers(
  req,
  res
) {
  try {

    const users =
      await userModel
        .find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({

      success: true,

      total: users.length,

      users,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch users",

    });

  }
}

export async function blockUser(
  req,
  res
) {
  try {

    const user =
      await userModel.findByIdAndUpdate(

        req.params.id,

        {
          isActive: false,
        },

        {
          new: true,
        }

      );

    return res.status(200).json({

      success: true,

      message:
        "User blocked successfully",

      user,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to block user",

    });

  }
}

export async function unblockUser(
  req,
  res
) {
  try {

    const user =
      await userModel.findByIdAndUpdate(

        req.params.id,

        {
          isActive: true,
        },

        {
          new: true,
        }

      );

    return res.status(200).json({

      success: true,

      message:
        "User unblocked successfully",

      user,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to unblock user",

    });

  }
}

export async function deleteUser(
  req,
  res
) {
  try {

    await userModel.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({

      success: true,

      message:
        "User deleted successfully",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete user",

    });

  }
}
export async function getPendingCompanies(
  req,
  res
) {
  try {

    const companies =
      await CompanyModel.find({

        isVerified: false,

      }).populate(
        "createdBy",
        "name email"
      );

    return res.status(200).json({

      success: true,

      total: companies.length,

      companies,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch pending companies",

    });

  }
}

export async function approveCompany(
  req,
  res
) {
  try {

    const company =
      await CompanyModel.findByIdAndUpdate(

        req.params.id,

        {
          isVerified: true,
        },

        {
          new: true,
        }

      );

    return res.status(200).json({

      success: true,

      message:
        "Company approved successfully",

      company,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to approve company",

    });

  }
}

export async function deleteCompany(
  req,
  res
) {
  try {

    await CompanyModel.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({

      success: true,

      message:
        "Company deleted successfully",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete company",

    });

  }
}

export async function getPlatformAnalytics(
  req,
  res
) {
  try {

    const analytics = {

      usersByRole:
        await userModel.aggregate([

          {
            $group: {

              _id: "$role",

              count: {
                $sum: 1,
              },

            },

          },

        ]),

      jobsByStatus:
        await JobModel.aggregate([

          {
            $group: {

              _id: "$status",

              count: {
                $sum: 1,
              },

            },

          },

        ]),

      applicationsByStatus:
        await ApplicationModel.aggregate([

          {
            $group: {

              _id: "$status",

              count: {
                $sum: 1,
              },

            },

          },

        ]),

    };

    return res.status(200).json({

      success: true,

      analytics,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch analytics",

    });

  }
}