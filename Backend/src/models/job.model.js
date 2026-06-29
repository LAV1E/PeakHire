import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const jobSchema = new mongoose.Schema(
  {
    // ==========================
    // Ownership
    // ==========================

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    // ==========================
    // Basic Information
    // ==========================

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    // ==========================
    // Employment
    // ==========================

    employmentType: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
        "FREELANCE",
      ],
      required: true,
    },

    workplaceType: {
      type: String,
      enum: [
        "ONSITE",
        "REMOTE",
        "HYBRID",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "PUBLISHED",
        "CLOSED",
      ],
      default: "DRAFT",
    },

    // ==========================
    // Experience
    // ==========================

    experienceLevel: {
      type: String,
      enum: [
        "ENTRY",
        "JUNIOR",
        "MID",
        "SENIOR",
        "LEAD",
      ],
      required: true,
    },

    experienceMin: {
      type: Number,
      default: 0,
      min: 0,
    },

    experienceMax: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================
    // Salary
    // ==========================

    salaryMin: {
      type: Number,
      required: true,
      min: 0,
    },

    salaryMax: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    // ==========================
    // Hiring Requirements
    // ==========================

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    education: {
      type: String,
      enum: [
        "ANY",
        "BACHELOR",
        "MASTER",
        "PHD",
      ],
      default: "ANY",
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ==========================
    // Job Details
    // ==========================

    location: {
      type: String,
      required: true,
      trim: true,
    },

    responsibilities: {
      type: String,
      default: "",
    },

    requirements: {
      type: String,
      default: "",
    },

    benefits: {
      type: String,
      default: "",
    },

    applicationDeadline: {
      type: Date,
    },

    // ==========================
    // Analytics
    // ==========================

    viewsCount: {
      type: Number,
      default: 0,
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },

    // ==========================
    // AI
    // ==========================

    aiGeneratedDescription: {
      type: String,
      default: null,
    },

    // ==========================
    // Visibility & Lifecycle
    // ==========================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
    lastApplicationAt: {
    type: Date,
    default: null,
}
  },
  {
    timestamps: true,
  }
);

// ==========================
// Search Index
// ==========================

jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  department: "text",
  location: "text",
});

// ==========================
// Dashboard Index
// ==========================

jobSchema.index({
  company: 1,
  status: 1,
});

// ==========================
// Middleware
// ==========================

jobSchema.pre("save", function () {

  if (
    this.isModified("status") &&
    this.status === "PUBLISHED" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  if (this.isModified("title")) {
    this.slug = slugify(
      `${this.title}-${Date.now()}`
    );
  }


});


// jobSchema.pre("save", function () {

//   if (
//     this.isModified("status") &&
//     this.status === "PUBLISHED" &&
//     !this.publishedAt
//   ) {
//     this.publishedAt = new Date();
//   }

//   if (this.isModified("title")) {
//     this.slug = slugify(
//       `${this.title}-${Date.now()}`
//     );
//   }
// });
const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;