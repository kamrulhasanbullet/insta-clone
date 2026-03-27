import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const post = await PostService.getPostById(
      params.postId,
      session?.user?.id,
    );
    return NextResponse.json({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const result = await PostService.deletePost(params.postId, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
