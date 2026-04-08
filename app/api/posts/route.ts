import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { createPostSchema } from "@/lib/validations/post.schema";
import { handleApiError, AppError } from "@/utils/apiError";

// GET /api/posts?page=1 — feed
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
    const result = await PostService.getFeed(session.user.id, page);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/posts — create post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const post = await PostService.createPost(session.user.id, parsed.data);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
