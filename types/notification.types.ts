import { UserPublic } from "./user.types";
import { PostType } from "./post.types";

export interface NotificationType {
  _id: string;
  sender: UserPublic;
  type: "like" | "comment" | "follow";
  post?: Pick<PostType, "_id" | "imageUrl">;
  isRead: boolean;
  createdAt: string;
}
