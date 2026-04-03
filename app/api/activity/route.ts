import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";
import { handleApiError, AppError } from "@/utils/apiError";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    await connectDB();

    const type = req.nextUrl.searchParams.get("type") ?? "likes";

    if (type === "likes") {
      // user who has liked posts
      const posts = await Post.find({ likedBy: session.user.id })
        .sort({ updatedAt: -1 })
        .select("_id imageUrl caption updatedAt")
        .lean();

      const items = posts.map((post) => ({
        _id: post._id,
        post: {
          _id: post._id,
          imageUrl: post.imageUrl,
          caption: post.caption,
        },
        createdAt: post.updatedAt,
      }));

      return NextResponse.json({ items });
    }

    if (type === "comments") {
      // user who has commented
      const comments = await Comment.find({ author: session.user.id })
        .sort({ createdAt: -1 })
        .populate("post", "_id imageUrl caption")
        .lean();

      const items = comments
        .filter((c: any) => c.post) 
        .map((c: any) => ({
          _id: c._id,
          text: c.text,
          post: {
            _id: c.post._id,
            imageUrl: c.post.imageUrl,
            caption: c.post.caption,
          },
          createdAt: c.createdAt,
        }));

      return NextResponse.json({ items });
    }

    return NextResponse.json({ items: [] });
  } catch (error) {
    return handleApiError(error);
  }
}
