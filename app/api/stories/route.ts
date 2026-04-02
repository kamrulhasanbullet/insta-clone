import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StoryService } from "@/services/story.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const stories = await StoryService.getFeedStories(session.user.id);
    return NextResponse.json({ stories });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    const body = await req.json();
    const story = await StoryService.createStory(session.user.id, body);
    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
