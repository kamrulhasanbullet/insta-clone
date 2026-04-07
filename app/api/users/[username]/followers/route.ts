import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { handleApiError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const following = await UserService.getFollowing(username);
    return NextResponse.json({ following });
  } catch (error) {
    return handleApiError(error);
  }
}
