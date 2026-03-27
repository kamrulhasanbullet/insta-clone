import { UserPublic } from "./user.types";

export interface CommentType {
  _id: string;
  post: string;
  author: UserPublic;
  text: string;
  likesCount: number;
  parentComment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  text: string;
}
