import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Saved from '@/models/Saved';
import '@/models/Post';
import '@/models/User';
import { handleApiError, AppError } from '@/utils/apiError';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AppError('Unauthorized', 401);

    await connectDB();

    const saved = await Saved.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'post',
        populate: { path: 'author', select: 'username fullName avatarUrl isVerified' },
      })
      .lean();

    const posts = saved
      .map((s: any) => ({
        ...s.post,
        isLiked: s.post?.likedBy?.some(
          (id: any) => id.toString() === session.user.id
        ) ?? false,
        likedBy: undefined,
      }))
      .filter(Boolean);

    return NextResponse.json({ posts });
  } catch (error) {
    return handleApiError(error);
  }
}