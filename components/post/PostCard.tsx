"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { useLike } from "@/hooks/useLike";
import { timeAgo } from "@/utils/formatDate";
import { PostType } from "@/types/post.types";
import { useCallback, useState } from "react";
import { StoryType } from "@/types/story.types";
import { StoryViewer } from "../stories/StoryViewer";

interface PostCardProps {
  post: PostType;
  onDelete?: (id: string) => void;
}

export function PostCard({ post }: PostCardProps) {
  const { liked, count, toggle } = useLike(
    post._id,
    post.isLiked,
    post.likesCount,
  );
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [story, setStory] = useState<StoryType | null>(null);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await fetch(`/api/posts/${post._id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: commentText }),
    });
    setCommentText("");
  };

  const handleAvatarClick = async () => {
    const res = await fetch(`/api/users/${post.author.username}/stories`);
    const data = await res.json();
    if (data.stories?.length > 0) {
      setStory(data.stories[0]);
    }
  };

  const handleStoryClose = useCallback(() => {
    setStory(null);
  }, []);

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-6 max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 hover:opacity-80">
          <button onClick={handleAvatarClick} className="cursor-pointer">
            <Avatar
              src={post.author.avatarUrl}
              alt={post.author.username}
              size="sm"
              className="ring-2 ring-pink-500 ring-offset-1"
            />
          </button>
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="text-sm font-semibold"
            >
              {post.author.username}
            </Link>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 468px"
          onDoubleClick={toggle}
        />
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="transition-transform active:scale-90"
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                size={24}
                className={
                  liked ? "fill-red-500 text-red-500" : "text-gray-800"
                }
              />
            </button>
            <button
              onClick={() => setShowCommentInput((v) => !v)}
              aria-label="Comment"
            >
              <MessageCircle size={24} className="text-gray-800" />
            </button>
          </div>
          <button aria-label="Save">
            <Bookmark size={24} className="text-gray-800" />
          </button>
        </div>

        {count > 0 && (
          <p className="text-sm font-semibold mb-1">
            {count.toLocaleString()} {count === 1 ? "like" : "likes"}
          </p>
        )}

        {post.caption && (
          <p className="text-sm">
            <Link
              href={`/profile/${post.author.username}`}
              className="font-semibold mr-1"
            >
              {post.author.username}
            </Link>
            {post.caption}
          </p>
        )}

        {post.commentsCount > 0 && (
          <Link
            href={`/post/${post._id}`}
            className="text-sm text-gray-500 mt-1 block"
          >
            View all {post.commentsCount} comments
          </Link>
        )}

        <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
          {timeAgo(post.createdAt)}
        </p>
      </div>

      {/* Comment input */}
      {showCommentInput && (
        <form
          onSubmit={handleComment}
          className="border-t border-gray-100 flex items-center px-4 py-2 gap-3"
        >
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="text-sm font-semibold text-blue-500 disabled:opacity-40"
          >
            Post
          </button>
        </form>
      )}

      {/* Story Viewer */}
      {story && <StoryViewer story={story} onClose={handleStoryClose} />}
    </article>
  );
}
