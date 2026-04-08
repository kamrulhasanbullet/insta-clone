import { UserPublic } from "./user.types";

export interface PostType {
  _id: string;
  author: UserPublic;
  imageUrl: string;
  caption: string;
  tags: string[];
  location: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  comments?: CommentType[];
}

export interface CommentType {
  _id: string;
  post: string;
  author: UserPublic;
  text: string;
  likesCount: number;
  createdAt: string;
}
