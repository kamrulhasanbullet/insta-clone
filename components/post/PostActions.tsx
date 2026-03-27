"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useLike } from "@/hooks/useLike";
import { cn } from "@/utils/cn";

interface PostActionsProps {
  postId: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
}

export function PostActions({
  postId,
  likesCount,
  isLiked,
  commentsCount,
}: PostActionsProps) {
  const { liked, count, toggle, loading } = useLike(
    postId,
    isLiked,
    likesCount,
  );

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          disabled={loading}
          className="h-11 w-11 p-0 hover:bg-gray-100"
        >
          <Heart
            size={24}
            className={cn(
              liked ? "fill-red-500 text-red-500" : "text-gray-700",
              loading && "text-gray-400",
            )}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 p-0 hover:bg-gray-100"
        >
          <MessageCircle size={24} className="text-gray-700" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 p-0 hover:bg-gray-100"
        >
          <Share2 size={24} className="text-gray-700" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 p-0 hover:bg-gray-100"
      >
        <Bookmark size={24} className="text-gray-700" />
      </Button>

      {likesCount > 0 && (
        <p className="text-sm font-semibold text-gray-900 absolute left-4 bottom-12">
          {count.toLocaleString()} {count === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
}
