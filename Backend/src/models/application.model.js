import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ==========================
    // Relationships
    // ==========================

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    // ==========================
    // Resume
    // ==========================

    resume: {
    type: String,
    default: null,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Candidate Details
    // ==========================

    expectedSalary: {
      type: Number,
      default: null,
      min: 0,
    },

    noticePeriod: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Recruitment Pipeline
    // ==========================

    status: {
      type: String,
      enum: [
        "APPLIED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "INTERVIEW",
        "OFFERED",
        "HIRED",
        "REJECTED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
      index: true,
    },

    recruiterNotes: {
      type: String,
      default: "",
    },

    // ==========================
    // Soft Delete
    // ==========================

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// Prevent Duplicate Applications
// ==========================

applicationSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

// ==========================
// Dashboard Index
// ==========================

applicationSchema.index({
  recruiter: 1,
  status: 1,
});

applicationSchema.index({
  company: 1,
  status: 1,
});

const ApplicationModel = mongoose.model(
  "Application",
  applicationSchema
);

export default ApplicationModel;