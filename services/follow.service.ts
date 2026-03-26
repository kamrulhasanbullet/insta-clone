import { connectDB } from "@/lib/mongodb";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NotificationService } from "./notification.service";
import { AppError } from "@/utils/apiError";

export class FollowService {
  static async follow(followerId: string, targetUsername: string) {
    await connectDB();

    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);

    const targetId = target._id.toString();
    if (followerId === targetId)
      throw new AppError("Cannot follow yourself", 400);

    const exists = await Follow.exists({
      follower: followerId,
      following: targetId,
    });
    if (exists) throw new AppError("Already following", 400);

    await Follow.create({ follower: followerId, following: targetId });

    // Update denormalized counts atomically
    await Promise.all([
      User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }),
      User.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } }),
    ]);

    NotificationService.create({
      recipient: targetId,
      sender: followerId,
      type: "follow",
    }).catch(console.error);

    return { following: true };
  }

  static async unfollow(followerId: string, targetUsername: string) {
    await connectDB();

    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);

    const targetId = target._id.toString();
    const deleted = await Follow.findOneAndDelete({
      follower: followerId,
      following: targetId,
    });

    if (!deleted) throw new AppError("Not following this user", 400);

    await Promise.all([
      User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }),
      User.findByIdAndUpdate(targetId, { $inc: { followersCount: -1 } }),
    ]);

    return { following: false };
  }
}
