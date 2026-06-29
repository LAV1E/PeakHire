import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
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
    // Offer Details
    // ==========================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    employmentType: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    offerLetter: {

    url:{
        type:String,
        default:"",
    },

    publicId:{
        type:String,
        default:"",
    }

},

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Candidate Decision
    // ==========================

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED",
      ],
      default: "PENDING",
      index: true,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    // ==========================
    // Soft Delete
    // ==========================

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

  },
  {
    timestamps: true,
  }
);

// ==========================
// Indexes
// ==========================

offerSchema.index({
  recruiter: 1,
  status: 1,
});

offerSchema.index({
  candidate: 1,
  status: 1,
});

// offerSchema.index({
//   application: 1,
// });

const OfferModel =
  mongoose.model(
    "Offer",
    offerSchema
  );

export default OfferModel;