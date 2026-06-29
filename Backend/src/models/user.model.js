import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    avatar: {
    url: {
        type: String,
        default: null,
    },

    publicId: {
        type: String,
        default: null,
    },
    },
    resume: {
    url: {
        type: String,
        default: null,
    },

    publicId: {
        type: String,
        default: null,
    },
    },
    // ==========================
    // Candidate Profile
    // ==========================

    bio: {
    type: String,
    trim: true,
    maxlength: 500,
    default: "",
    },

    location: {
    type: String,
    trim: true,
    default: "",
    },

    dateOfBirth: {
    type: Date,
    default: null,
    },

    gender: {
    type: String,
    enum: [
        "male",
        "female",
        "other",
    ],
    default: null,
    },

    skills: [
    {
        type: String,
        trim: true,
    },
    ],

    experience: [
    {
        company: {
        type: String,
        trim: true,
        },

        role: {
        type: String,
        trim: true,
        },

        employmentType: {
        type: String,
        enum: [
            "FULL_TIME",
            "PART_TIME",
            "INTERNSHIP",
            "CONTRACT",
            "FREELANCE",
        ],
        default: "FULL_TIME",
        },

        location: {
        type: String,
        trim: true,
        },

        startDate: Date,

        endDate: Date,

        isCurrent: {
        type: Boolean,
        default: false,
        },

        description: {
        type: String,
        default: "",
        },
    },
    ],

    education: [
    {
        college: {
        type: String,
        trim: true,
        },

        degree: {
        type: String,
        trim: true,
        },

        fieldOfStudy: {
        type: String,
        trim: true,
        },

        startYear: Number,

        endYear: Number,

        cgpa: {
        type: String,
        default: "",
        },
    },
    ],

    socialLinks: {
    github: {
        type: String,
        default: "",
    },

    linkedin: {
        type: String,
        default: "",
    },

    portfolio: {
        type: String,
        default: "",
    },

    leetcode: {
        type: String,
        default: "",
    },

    codeforces: {
        type: String,
        default: "",
    },

    hackerrank: {
        type: String,
        default: "",
    },
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should contain at least 6 characters"],
      select: false,
    },

    provider: {
      type: String,
      enum: ["email", "otp"],
      default: "email",
    },

   companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOtp: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationOtpExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
    // ==========================
// AI Resume Analysis
// ==========================

resumeAnalysis: {

  summary: {
    type: String,
    default: "",
  },

  skills: [
    {
      type: String,
    },
  ],

  strengths: [
    {
      type: String,
    },
  ],

  missingSkills: [
    {
      type: String,
    },
  ],

  suggestions: [
    {
      type: String,
    },
  ],

  atsScore: {
    type: Number,
    default: 0,
  },

  analyzedAt: {
    type: Date,
    default: null,
  },

},
 
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("user", userSchema);

export  default  UserModel;