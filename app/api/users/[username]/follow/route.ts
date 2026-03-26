import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FollowService } from "@/services/follow.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const result = await FollowService.follow(session.user.id, params.username);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const result = await FollowService.unfollow(
      session.user.id,
      params.username,
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
