import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { handleApiError } from "@/utils/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params; 
    const session = await getServerSession(authOptions);
    const user = await UserService.getUserByUsername(
      username,
      session?.user?.id,
    );
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
