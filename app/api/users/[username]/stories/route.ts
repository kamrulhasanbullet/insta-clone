import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StoryService } from "@/services/story.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const stories = await StoryService.getUserStories(
      username,
      session.user.id,
    );
    return NextResponse.json({ stories });
  } catch (error) {
    return handleApiError(error);
  }
}
