import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Saved from "@/models/Saved";
import { handleApiError, AppError } from "@/utils/apiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    await connectDB();
    await Saved.create({ user: session.user.id, post: postId });
    return NextResponse.json({ saved: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    await connectDB();
    await Saved.findOneAndDelete({ user: session.user.id, post: postId });
    return NextResponse.json({ saved: false });
  } catch (error) {
    return handleApiError(error);
  }
}
