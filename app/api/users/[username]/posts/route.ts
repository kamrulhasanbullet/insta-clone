import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { handleApiError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const posts = await PostService.getUserPosts(
      params.username,
      session?.user?.id,
    );
    return NextResponse.json({ posts });
  } catch (error) {
    return handleApiError(error);
  }
}
