import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import Follow from "@/models/Follow";
import "@/models/User";
import { AppError } from "@/utils/apiError";
import mongoose from "mongoose";

export class StoryService {
  // Feed stories — followed users all stories
  static async getFeedStories(userId: string) {
    await connectDB();

    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();
    const followingIds = follows.map((f) => f.following);
    followingIds.push(new mongoose.Types.ObjectId(userId));

    const now = new Date();

    const stories = await Story.find({
      author: { $in: followingIds },
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarUrl fullName")
      .lean();

    // current user oner stories first, then followed users stories
    const sorted = [
      ...stories.filter((s: any) => s.author._id.toString() === userId),
      ...stories.filter((s: any) => s.author._id.toString() !== userId),
    ];

    return sorted.map((s: any) => ({
      ...s,
      isViewed: s.viewers?.some((id: any) => id.toString() === userId) ?? false,
    }));
  }

  // User and followed users stories
  static async getUserStories(username: string, currentUserId: string) {
    await connectDB();

    const User = mongoose.model("User");
    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    const now = new Date();
    const stories = await Story.find({
      author: user._id,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: 1 })
      .populate("author", "username avatarUrl fullName")
      .lean();

    return stories.map((s) => ({
      ...s,
      isViewed: s.viewers.some((id) => id.toString() === currentUserId),
    }));
  }

  static async createStory(
    authorId: string,
    input: { imageUrl: string; imagePublicId: string; caption?: string },
  ) {
    await connectDB();
    const story = await Story.create({ author: authorId, ...input });
    return story.populate("author", "username avatarUrl fullName");
  }

  static async viewStory(storyId: string, userId: string) {
    await connectDB();
    await Story.findByIdAndUpdate(storyId, {
      $addToSet: { viewers: userId },
      $inc: { viewersCount: 1 },
    });
    return { success: true };
  }

  static async deleteStory(storyId: string, userId: string) {
    await connectDB();
    const story = await Story.findById(storyId);
    if (!story) throw new AppError("Story not found", 404);
    if (story.author.toString() !== userId)
      throw new AppError("Unauthorized", 403);
    await Story.findByIdAndDelete(storyId);
    return { success: true };
  }
}
