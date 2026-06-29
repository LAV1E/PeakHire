import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

     sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        },

        isSystemNotification: {
        type: Boolean,
        default: false,
        },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "APPLICATION",
          "INTERVIEW",
          "JOB",
          "COMPANY",
          "PROFILE",
          "OFFER",
          "SYSTEM",
        ],
        required: true,
        index: true,
      },

      entityId: {
        type:
          mongoose.Schema.Types.ObjectId,
        default: null,
      },

      entityType: {
        type: String,
        enum: [
          "APPLICATION",
          "INTERVIEW",
          "JOB",
          "COMPANY",
          "PROFILE",
          "OFFER",
        ],
        default: null,
      },

      redirectUrl: {
        type: String,
        default: "",
        trim: true,
      },

      isRead: {
        type: Boolean,
        default: false,
        index: true,
      },

      readAt: {
        type: Date,
        default: null,
      },

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

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

const NotificationModel =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default NotificationModel;