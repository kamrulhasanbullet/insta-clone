import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params; // ← await
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const result = await PostService.likePost(postId, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params; // ← await
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const result = await PostService.unlikePost(postId, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
