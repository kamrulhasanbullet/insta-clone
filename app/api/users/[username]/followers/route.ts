import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { handleApiError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const followers = await UserService.getFollowers(username);
    return NextResponse.json({ followers });
  } catch (error) {
    return handleApiError(error);
  }
}
