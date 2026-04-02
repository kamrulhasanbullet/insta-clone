import { UserPublic } from "./user.types";

export interface StoryType {
  _id: string;
  author: UserPublic;
  imageUrl: string;
  caption: string;
  storiesCount: number;
  isViewed: boolean;
  expiresAt: string;
  createdAt: string;
}
