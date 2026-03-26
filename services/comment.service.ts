import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { NotificationService } from "./notification.service";
import { AppError } from "@/utils/apiError";

export class CommentService {
  static async addComment(postId: string, authorId: string, text: string) {
    await connectDB();

    const post = await Post.findById(postId);
    if (!post) throw new AppError("Post not found", 404);

    const comment = await Comment.create({
      post: postId,
      author: authorId,
      text,
    });
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    await comment.populate("author", "username fullName avatarUrl isVerified");

    if (post.author.toString() !== authorId) {
      NotificationService.create({
        recipient: post.author.toString(),
        sender: authorId,
        type: "comment",
        post: postId,
        comment: comment._id.toString(),
      }).catch(console.error);
    }

    return comment;
  }

  static async getComments(postId: string, page = 1, limit = 20) {
    await connectDB();
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ post: postId, parentComment: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username fullName avatarUrl isVerified")
        .lean(),
      Comment.countDocuments({ post: postId, parentComment: null }),
    ]);

    return { comments, total, hasMore: page * limit < total };
  }

  static async deleteComment(commentId: string, userId: string) {
    await connectDB();
    const comment = await Comment.findById(commentId);
    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.author.toString() !== userId)
      throw new AppError("Unauthorized", 403);

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    return { success: true };
  }
}
