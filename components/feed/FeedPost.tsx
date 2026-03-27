"use client";

import { PostCard } from "@/components/post/PostCard";
import { PostType } from "@/types/post.types";

interface FeedPostProps {
  post: PostType;
}

export function FeedPost({ post }: FeedPostProps) {
  return <PostCard post={post} />;
}
