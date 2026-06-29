import NotificationModel from "../models/notification.model.js";

// =====================================================
// Get My Notifications
// =====================================================

export async function getMyNotifications(req,res) {
  try {

    const {page = 1,limit = 10,type,isRead,} = req.query;

    const query = {recipient: req.user.id,isDeleted: false,};

    if (type) {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead =
        isRead === "true";
    }

    const skip =(Number(page) - 1) * Number(limit);

    const [
      notifications,
      totalNotifications,
    ] = await Promise.all([

      NotificationModel.find(query)
        .populate(
          "sender",
          "name avatar role"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit)),

      NotificationModel.countDocuments(
        query
      ),

    ]);

    return res.status(200).json({

      success: true,

      pagination: {

        totalItems:
          totalNotifications,

        currentPage:
          Number(page),

        pageSize:
          Number(limit),

        totalPages: Math.ceil(
          totalNotifications /
            Number(limit)
        ),

      },

      notifications,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch notifications",

    });

  }
}

// =====================================================
// Get Unread Count
// =====================================================

export async function getUnreadCount(
  req,
  res
) {
  try {

    const count =
      await NotificationModel.countDocuments({

        recipient:
          req.user.id,

        isRead: false,

        isDeleted: false,

      });

    return res.status(200).json({

      success: true,

      count,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch unread count",

    });

  }
}

// =====================================================
// Mark Notification As Read
// =====================================================

export async function markNotificationAsRead(
  req,
  res
) {
  try {

    const { id } =
      req.params;

    const notification =
      await NotificationModel.findOne({

        _id: id,

        recipient:
          req.user.id,

        isDeleted: false,

      });

    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found",

      });

    }

    if (
      !notification.isRead
    ) {

      notification.isRead =
        true;

      notification.readAt =
        new Date();

      await notification.save();

    }

    return res.status(200).json({

      success: true,

      message:
        "Notification marked as read",

      notification,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to update notification",

    });

  }
}

// =====================================================
// Mark All Notifications As Read
// =====================================================

export async function markAllNotificationsAsRead(
  req,
  res
) {
  try {

    await NotificationModel.updateMany(

      {

        recipient:
          req.user.id,

        isRead: false,

        isDeleted: false,

      },

      {

        $set: {

          isRead: true,

          readAt:
            new Date(),

        },

      }

    );

    return res.status(200).json({

      success: true,

      message:
        "All notifications marked as read",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to update notifications",

    });

  }
}

// =====================================================
// Delete Notification
// =====================================================

export async function deleteNotification(
  req,
  res
) {
  try {

    const { id } = req.params;

    const notification =
      await NotificationModel.findOne({

        _id: id,

        recipient: req.user.id,

        isDeleted: false,

      });

    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found",

      });

    }

    notification.isDeleted = true;

    await notification.save();

    const unreadCount =
      await NotificationModel.countDocuments({

        recipient: req.user.id,

        isRead: false,

        isDeleted: false,

      });

    return res.status(200).json({

      success: true,

      message:
        "Notification deleted successfully",

      unreadCount,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete notification",

    });

  }
}

// =====================================================
// Delete All Notifications
// =====================================================

export async function deleteAllNotifications(
  req,
  res
) {
  try {

    await NotificationModel.updateMany(

      {

        recipient: req.user.id,

        isDeleted: false,

      },

      {

        $set: {

          isDeleted: true,

        },

      }

    );

    return res.status(200).json({

      success: true,

      message:
        "All notifications deleted successfully",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete notifications",

    });

  }
}