import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { registerSchema } from "@/lib/validations/user.schema";
import { handleApiError } from "@/utils/apiError";

// GET /api/users?q=john — search users
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q) return NextResponse.json({ users: [] });
    const users = await UserService.searchUsers(q);
    return NextResponse.json({ users });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/users — register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }
    const user = await UserService.createUser(parsed.data);
    return NextResponse.json(
      { message: "User created", userId: user._id },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
