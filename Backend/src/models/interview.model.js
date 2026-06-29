import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    // ==========================
    // Relations
    // ==========================

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

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
    // Interview Details
    // ==========================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 15,
    },

    mode: {
      type: String,
      enum: [
        "ONLINE",
        "OFFLINE",
      ],
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // ==========================
    // Status
    // ==========================

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      default: "SCHEDULED",
      index: true,
    },

    // ==========================
    // Notes
    // ==========================

    recruiterNotes: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // ==========================
    // Soft Delete
    // ==========================

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    round: {
    type: Number,
    default: 1,
    },

    timezone: {
    type: String,
    default: "Asia/Kolkata",
    },

  },
  {
    timestamps: true,
  }
);

// ==================================
// Compound Indexes
// ==================================

interviewSchema.index({
  recruiter: 1,
  scheduledAt: 1,
});

interviewSchema.index({
  candidate: 1,
  scheduledAt: 1,
});

interviewSchema.index({
  application: 1,
  status: 1,
});

const InterviewModel =
  mongoose.model(
    "Interview",
    interviewSchema
  );

export default InterviewModel;