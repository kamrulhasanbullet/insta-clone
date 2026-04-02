import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StoryService } from "@/services/story.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { storyId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const result = await StoryService.deleteStory(storyId, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
