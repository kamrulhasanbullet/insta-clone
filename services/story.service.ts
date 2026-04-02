import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import Follow from "@/models/Follow";
import "@/models/User";
import { AppError } from "@/utils/apiError";
import mongoose from "mongoose";

export class StoryService {
  // Feed stories — followed users এর stories
  static async getFeedStories(userId: string) {
    await connectDB();

    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();
    const followingIds = follows.map((f) => f.following);
    followingIds.push(new mongoose.Types.ObjectId(userId));

    const now = new Date();

    // প্রতিটা user এর latest story group করো
    const stories = await Story.aggregate([
      {
        $match: {
          author: { $in: followingIds },
          expiresAt: { $gt: now },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$author",
          latestStory: { $first: "$$ROOT" },
          storiesCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: "$latestStory._id",
          imageUrl: "$latestStory.imageUrl",
          caption: "$latestStory.caption",
          createdAt: "$latestStory.createdAt",
          expiresAt: "$latestStory.expiresAt",
          viewers: "$latestStory.viewers",
          storiesCount: 1,
          author: {
            _id: "$author._id",
            username: "$author.username",
            avatarUrl: "$author.avatarUrl",
            fullName: "$author.fullName",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // current user কে first এ রাখো
    const sorted = [
      ...stories.filter((s) => s.author._id.toString() === userId),
      ...stories.filter((s) => s.author._id.toString() !== userId),
    ];

    return sorted.map((s) => ({
      ...s,
      isViewed: s.viewers?.some((id: any) => id.toString() === userId) ?? false,
    }));
  }

  // User এর সব stories
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
