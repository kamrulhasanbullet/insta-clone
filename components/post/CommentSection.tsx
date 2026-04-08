"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/shared/Avatar";
import { CommentType } from "@/types/comment.types";
import { timeAgo } from "@/utils/formatDate";

interface Props {
  postId: string;
  initialComments: CommentType[];
  initialHasMore: boolean;
  onCommentAdded?: (comment: CommentType) => void;
}

export function CommentSection({
  postId,
  initialComments,
  onCommentAdded, 
}: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !session) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      onCommentAdded?.(data.comment);
      setText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-100">
      {session && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
        >
          <Avatar
            src={session.user.image || ""}
            alt={session.user.username || ""}
            size="xs"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="text-sm font-semibold text-blue-500 disabled:opacity-40"
          >
            {loading ? "..." : "Post"}
          </button>
        </form>
      )}

      <div className="px-4 py-2 space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No comments yet
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start gap-3">
            <Avatar
              src={comment.author.avatarUrl}
              alt={comment.author.username}
              size="xs"
            />
            <div>
              <span className="text-sm font-semibold mr-2">
                {comment.author.username}
              </span>
              <span className="text-sm">{comment.text}</span>
              <p className="text-xs text-gray-400 mt-0.5">
                {timeAgo(comment.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
