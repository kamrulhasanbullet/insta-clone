import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { handleApiError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const followers = await UserService.getFollowers(params.username);
    return NextResponse.json({ followers });
  } catch (error) {
    return handleApiError(error);
  }
}
