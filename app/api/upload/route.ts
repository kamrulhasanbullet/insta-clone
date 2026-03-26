import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { handleApiError, AppError } from "@/utils/apiError";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError("Unauthorized", 401);

    const { image, folder } = await req.json();
    if (!image) throw new AppError("No image provided", 400);

    const result = await uploadImage(image, folder ?? "instagram_clone/posts");
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
