"use client";

import { useState } from "react";
import { Avatar } from "@/components/shared/Avatar";
import { Heart, MoreHorizontal, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { timeAgo } from "@/utils/formatDate";
import { CommentType } from "@/types/comment.types";
import { cn } from "@/utils/cn";

interface CommentItemProps {
  comment: CommentType;
  onDelete: (commentId: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const isOwnComment = session?.user?.id === comment.author._id;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await fetch(`/api/posts/${comment.post}/comments/${comment._id}`, {
        method: "DELETE",
      });
      onDelete(comment._id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg">
      <Avatar
        src={comment.author.avatarUrl}
        alt={comment.author.username}
        size="xs"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-semibold text-sm truncate">
                {comment.author.username}
              </span>
              <span className="text-xs text-gray-500">
                · {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm break-words">{comment.text}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
              <Heart
                size={16}
                className={cn(
                  comment.likesCount > 0 && "fill-red-500 text-red-500",
                )}
              />
              {comment.likesCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  {comment.likesCount}
                </span>
              )}
            </button>

            {isOwnComment && (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <MoreHorizontal size={16} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
