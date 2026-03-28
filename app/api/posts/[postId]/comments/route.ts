import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommentService } from "@/services/comment.service";
import { createCommentSchema } from "@/lib/validations/post.schema";
import { handleApiError, AppError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }, 
) {
  try {
    const { postId } = await params; // ← await
    const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
    const result = await CommentService.getComments(postId, page);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }, 
) {
  try {
    const { postId } = await params; // ← await
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const body = await req.json();
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }
    const comment = await CommentService.addComment(
      postId,
      session.user.id,
      parsed.data.text,
    );
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
