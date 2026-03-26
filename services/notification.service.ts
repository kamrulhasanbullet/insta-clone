import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NotificationType } from "@/types/notification.types";

interface CreateNotificationInput {
  recipient: string;
  sender: string;
  type: "like" | "comment" | "follow";
  post?: string;
  comment?: string;
}

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    await connectDB();
    return Notification.create(input);
  }

  static async getForUser(userId: string, page = 1, limit = 20) {
    await connectDB();
    const skip = (page - 1) * limit;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username fullName avatarUrl")
        .populate("post", "imageUrl")
        .lean(),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    return {
      notifications,
      unreadCount,
      hasMore: page * limit < notifications.length + skip,
    };
  }

  static async markAllRead(userId: string) {
    await connectDB();
    return Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );
  }
}
