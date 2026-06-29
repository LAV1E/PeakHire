import JobModel from "../models/job.model.js";
import CompanyModel from "../models/company.model.js";

export async function createJob(req, res) {
  try {

    const jobData = req.body;

    // ==========================
    // Required Fields
    // ==========================

    const requiredFields = [
      "title",
      "description",
      "department",
      "employmentType",
      "workplaceType",
      "experienceLevel",
      "salaryMin",
      "salaryMax",
      "location",
    ];

    for (const field of requiredFields) {
      if (
        jobData[field] === undefined ||
        jobData[field] === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // ==========================
    // Find Company
    // ==========================

    const company = await CompanyModel.findOne({
      owner: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Recruiter doesn't own any company",
      });
    }

    // ==========================
    // Company Verification
    // ==========================

    if (!company.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Company is not verified yet",
      });
    }

    // ==========================
    // Salary Validation
    // ==========================

    if (
      Number(jobData.salaryMin) >
      Number(jobData.salaryMax)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum salary cannot be greater than maximum salary",
      });
    }

    // ==========================
    // Experience Validation
    // ==========================

    if (
      Number(jobData.experienceMin) >
      Number(jobData.experienceMax)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum experience cannot be greater than maximum experience",
      });
    }

    // ==========================
    // Deadline Validation
    // ==========================

    if (jobData.applicationDeadline) {

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const deadline = new Date(
        jobData.applicationDeadline
      );

      if (deadline < today) {
        return res.status(400).json({
          success: false,
          message:
            "Application deadline cannot be in the past",
        });
      }
    }

    // ==========================
    // Secure Fields
    // ==========================

    jobData.company = company._id;

    jobData.createdBy = req.user.id;

    delete jobData.slug;
    delete jobData.viewsCount;
    delete jobData.applicationsCount;
    delete jobData.isDeleted;
    delete jobData.isFeatured;
    delete jobData.publishedAt;

    // ==========================
    // Create Job
    // ==========================

    const job =
      await JobModel.create(jobData);

    return res.status(201).json({
      success: true,
      message:
        "Job created successfully",
      job,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to create job",
    });

  }
}

export async function getMyJobs(req, res) {
  try {
    // Find Recruiter's Company
    const company = await CompanyModel.findOne({
      owner: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Get Jobs
    const jobs = await JobModel.find({
      company: company._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
}

export async function getJobById(req, res) {
  try {
    const { id } = req.params;

    const job = await JobModel.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("company")
      .populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Increment view count
    await JobModel.findByIdAndUpdate(id, {
      $inc: {
        viewsCount: 1,
      },
    });

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
}

export async function updateJob(req, res) {
  try {
    const { id } = req.params;

    const job = await JobModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Recruiter can update only own company's job
    if (
      req.user.role === "recruiter" &&
      job.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "department",
      "employmentType",
      "workplaceType",
      "status",
      "experienceLevel",
      "experienceMin",
      "experienceMax",
      "salaryMin",
      "salaryMax",
      "currency",
      "skills",
      "education",
      "openings",
      "location",
      "responsibilities",
      "requirements",
      "benefits",
      "applicationDeadline",
      "aiGeneratedDescription",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    if (job.salaryMin > job.salaryMax) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum salary cannot be greater than maximum salary",
      });
    }

    if (job.experienceMin > job.experienceMax) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum experience cannot be greater than maximum experience",
      });
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
}

export async function deleteJob(req, res) {
  try {
    const { id } = req.params;

    const job = await JobModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      req.user.role === "recruiter" &&
      job.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    job.isDeleted = true;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
}

export async function getAllJobs(req, res) {
  try {
    const jobs = await JobModel.find({
      status: "PUBLISHED",
      isDeleted: false,
    })
      .populate("company", "name location")
      .sort({
        publishedAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
}

export async function searchJobs(req, res) {
  try {
    const { keyword } = req.query;

    const jobs = await JobModel.find({
      $text: {
        $search: keyword,
      },
      status: "PUBLISHED",
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
}

export async function getFeaturedJobs(req, res) {
  try {
    const jobs = await JobModel.find({
      isFeatured: true,
      status: "PUBLISHED",
      isDeleted: false,
    })
      .populate("company", "name")
      .sort({
        publishedAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch featured jobs",
    });
  }
}

export async function advancedJobSearch(req, res) {
  try {

    let {
      keyword,
      location,
      company,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sort = "latest",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    // ==========================
    // Base Filters
    // ==========================

    const matchStage = {
      isDeleted: false,
      status: "PUBLISHED",
    };

    // ==========================
    // Keyword Search
    // ==========================

    if (keyword) {

      matchStage.$or = [

        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          department: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          requirements: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          skills: {
            $elemMatch: {
              $regex: keyword,
              $options: "i",
            },
          },
        },

      ];

    }

    // ==========================
    // Location
    // ==========================

    if (location) {

      matchStage.location = {
        $regex: location,
        $options: "i",
      };

    }

    // ==========================
    // Company
    // ==========================

    if (company) {

      matchStage.company = company;

    }

    // ==========================
    // Employment Type
    // ==========================

    if (employmentType) {

      matchStage.employmentType =
        employmentType.toUpperCase();

    }

    // ==========================
    // Experience Level
    // ==========================

    if (experienceLevel) {

      matchStage.experienceLevel =
        experienceLevel.toUpperCase();

    }

    // ==========================
    // Salary Range
    // ==========================

    if (minSalary) {

      matchStage.salaryMin = {
        $gte: Number(minSalary),
      };

    }

    if (maxSalary) {

      matchStage.salaryMax = {
        $lte: Number(maxSalary),
      };

    }

    // ==========================
    // Sorting
    // ==========================

    let sortStage = {
      createdAt: -1,
    };

    switch (sort) {

      case "salaryHigh":

        sortStage = {
          salaryMax: -1,
        };

        break;

      case "salaryLow":

        sortStage = {
          salaryMin: 1,
        };

        break;

      case "latest":

        sortStage = {
          createdAt: -1,
        };

        break;

      case "oldest":

        sortStage = {
          createdAt: 1,
        };

        break;

    }

    // ==========================
    // Aggregation
    // ==========================

    const result =
      await JobModel.aggregate([

        {
          $match: matchStage,
        },

        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "company",
          },
        },

        {
          $unwind: "$company",
        },

        {
          $sort: sortStage,
        },

        {
          $facet: {

            jobs: [

              {
                $skip:
                  (page - 1) * limit,
              },

              {
                $limit: limit,
              },

            ],

            total: [

              {
                $count: "count",
              },

            ],

          },

        },

      ]);

    const jobs =
      result[0].jobs;

    const totalJobs =
      result[0].total[0]?.count || 0;

    return res.status(200).json({

      success: true,

      page,

      totalPages: Math.ceil(
        totalJobs / limit
      ),

      totalJobs,

      jobs,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to search jobs",

    });

  }
}