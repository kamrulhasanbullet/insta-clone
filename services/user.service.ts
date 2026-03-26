import { connectDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import Follow from "@/models/Follow";
import { AppError } from "@/utils/apiError";
import bcrypt from "bcryptjs";
import {
  RegisterInput,
  UpdateProfileInput,
} from "@/lib/validations/user.schema";

export class UserService {
  static async createUser(input: RegisterInput): Promise<IUser> {
    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email: input.email }, { username: input.username }],
    });

    if (existingUser) {
      if (existingUser.email === input.email)
        throw new AppError("Email already in use", 409);
      throw new AppError("Username already taken", 409);
    }

    const hashed = await bcrypt.hash(input.password, 12);
    const user = await User.create({ ...input, password: hashed });
    return user;
  }

  static async getUserByUsername(username: string, currentUserId?: string) {
    await connectDB();

    const user = await User.findOne({ username }).lean();
    if (!user) throw new AppError("User not found", 404);

    let isFollowing = false;
    let isFollowedBy = false;

    if (currentUserId && currentUserId !== user._id.toString()) {
      const [followDoc, followedByDoc] = await Promise.all([
        Follow.exists({ follower: currentUserId, following: user._id }),
        Follow.exists({ follower: user._id, following: currentUserId }),
      ]);
      isFollowing = !!followDoc;
      isFollowedBy = !!followedByDoc;
    }

    return { ...user, isFollowing, isFollowedBy };
  }

  static async searchUsers(query: string, limit = 10) {
    await connectDB();
    return User.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .select("username fullName avatarUrl isVerified")
      .lean();
  }

  static async updateProfile(
    userId: string,
    input: UpdateProfileInput & { avatarUrl?: string; avatarPublicId?: string },
  ) {
    await connectDB();
    const user = await User.findByIdAndUpdate(userId, input, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  static async getFollowers(username: string) {
    await connectDB();
    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    return Follow.find({ following: user._id })
      .populate("follower", "username fullName avatarUrl isVerified")
      .lean();
  }

  static async getFollowing(username: string) {
    await connectDB();
    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    return Follow.find({ follower: user._id })
      .populate("following", "username fullName avatarUrl isVerified")
      .lean();
  }
}
