import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Follow from "@/models/Follow";
import { NotificationService } from "./notification.service";
import { AppError } from "@/utils/apiError";
import { CreatePostInput } from "@/lib/validations/post.schema";
import mongoose from "mongoose";
import Saved from "@/models/Saved";

export class PostService {
  static async createPost(authorId: string, input: CreatePostInput) {
    await connectDB();

    const post = await Post.create({ author: authorId, ...input });
    await User.findByIdAndUpdate(authorId, { $inc: { postsCount: 1 } });

    return post.populate("author", "username fullName avatarUrl isVerified");
  }

  static async deletePost(postId: string, userId: string) {
    await connectDB();
    const post = await Post.findById(postId);
    if (!post) throw new AppError("Post not found", 404);
    if (post.author.toString() !== userId)
      throw new AppError("Unauthorized", 403);

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });
    return { success: true };
  }

  static async getFeed(userId: string, page = 1, limit = 12) {
    await connectDB();

    // Get IDs of users the current user follows
    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();
    const followingIds = follows.map((f) => f.following);
    followingIds.push(new mongoose.Types.ObjectId(userId)); // include own posts

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username fullName avatarUrl isVerified")
        .lean(),
      Post.countDocuments({ author: { $in: followingIds } }),
    ]);

    const savedDocs = await Saved.find({ user: userId }).select("post").lean();
    const savedPostIds = new Set(savedDocs.map((s) => s.post.toString()));

    // Attach isLiked flag
    const postsWithLike = posts.map((post) => ({
      ...post,
      isLiked: post.likedBy.some((id) => id.toString() === userId),
      isSaved: savedPostIds.has(post._id.toString()),
      likedBy: undefined,
    }));

    return {
      posts: postsWithLike,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  }

  static async getUserPosts(username: string, currentUserId?: string) {
    await connectDB();
    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username fullName avatarUrl isVerified")
      .lean();

    let savedPostIds = new Set<string>();
    if (currentUserId) {
      const savedDocs = await Saved.find({ user: currentUserId })
        .select("post")
        .lean();
      savedPostIds = new Set(savedDocs.map((s) => s.post.toString()));
    }

    return posts.map((post) => ({
      ...post,
      isLiked: currentUserId
        ? post.likedBy.some((id) => id.toString() === currentUserId)
        : false,
      isSaved: savedPostIds.has(post._id.toString()),
      likedBy: undefined,
    }));
  }

  static async getPostById(postId: string, currentUserId?: string) {
    await connectDB();
    const post = await Post.findById(postId)
      .populate("author", "username fullName avatarUrl isVerified")
      .lean();
    if (!post) throw new AppError("Post not found", 404);

    let isSaved = false;
    if (currentUserId) {
      const savedDoc = await Saved.exists({
        user: currentUserId,
        post: postId,
      });
      isSaved = !!savedDoc;
    }

    return {
      ...post,
      isLiked: currentUserId
        ? post.likedBy.some((id) => id.toString() === currentUserId)
        : false,
      isSaved,
      likedBy: undefined,
    };
  }

  static async likePost(postId: string, userId: string) {
    await connectDB();
    const post = await Post.findById(postId);
    if (!post) throw new AppError("Post not found", 404);

    const alreadyLiked = post.likedBy.some((id) => id.toString() === userId);
    if (alreadyLiked) throw new AppError("Already liked", 400);

    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likedBy: userId },
      $inc: { likesCount: 1 },
    });

    // Fire notification (async, non-blocking)
    if (post.author.toString() !== userId) {
      NotificationService.create({
        recipient: post.author.toString(),
        sender: userId,
        type: "like",
        post: postId,
      }).catch(console.error);
    }

    return { liked: true };
  }

  static async unlikePost(postId: string, userId: string) {
    await connectDB();
    const post = await Post.findById(postId);
    if (!post) throw new AppError("Post not found", 404);

    await Post.findByIdAndUpdate(postId, {
      $pull: { likedBy: userId },
      $inc: { likesCount: -1 },
    });

    return { liked: false };
  }
}
