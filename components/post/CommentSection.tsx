"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Send } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { CommentType } from "@/types/comment.types";
import { cn } from "@/utils/cn";

interface CommentSectionProps {
  postId: string;
  comments: CommentType[];
  commentsCount: number;
  onCommentAdded: (comment: CommentType) => void;
}

export function CommentSection({
  postId,
  comments,
  commentsCount,
  onCommentAdded,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !session) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newComment }),
        });

        if (res.ok) {
          const comment = await res.json();
          onCommentAdded(comment.comment);
          setNewComment("");
        }
      } catch (error) {
        console.error("Failed to post comment:", error);
      } finally {
        setLoading(false);
      }
    },
    [newComment, session, postId, onCommentAdded],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t border-gray-200">
      {/* Comments List */}
      {showComments && comments.length > 0 && (
        <div className="max-h-96 overflow-y-auto px-4 py-3 space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={(commentId) => {
                // Handle delete logic
              }}
            />
          ))}
        </div>
      )}

      {/* Comment Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 px-4 py-3 bg-gray-50"
      >
        <Avatar
          src={session?.user?.image || ""}
          alt={session?.user?.name || ""}
          size="xs"
        />

        <div className="flex-1 flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              commentsCount === 0
                ? "Add a comment..."
                : showComments
                  ? "Add a comment..."
                  : `${commentsCount} comments`
            }
            rows={1}
            className="flex-1 resize-none bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-24"
            disabled={!session}
          />

          <Button
            type="submit"
            disabled={!newComment.trim() || loading || !session}
            size="sm"
            className="px-4 h-10"
          >
            {loading ? (
              <Send className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Show Comments Toggle */}
      {commentsCount > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="w-full text-left px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          View all {commentsCount} comments
        </button>
      )}
    </div>
  );
}
