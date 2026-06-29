import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saves
savedJobSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

const SavedJobModel = mongoose.model(
  "SavedJob",
  savedJobSchema
);

export default SavedJobModel;