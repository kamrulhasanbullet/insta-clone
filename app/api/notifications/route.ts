import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { handleApiError, AppError } from "@/utils/apiError";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
    const result = await NotificationService.getForUser(session.user.id, page);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);
    await NotificationService.markAllRead(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
