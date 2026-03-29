import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { updateProfileSchema } from "@/lib/validations/user.schema";
import { handleApiError, AppError } from "@/utils/apiError";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const user = await UserService.updateProfile(session.user.id, parsed.data);
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
