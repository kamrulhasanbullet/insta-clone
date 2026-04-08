"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { CommentSection } from "./CommentSection";
import { PostType } from "@/types/post.types";
import { useRouter } from "next/navigation";

interface PostModalProps {
  post: PostType;
}

export function PostModal({ post }: PostModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  useEffect(() => {
    setMounted(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [router]);

  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-6xl max-h-[90vh] flex bg-white rounded-3xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-20 p-2 text-white hover:bg-white/20 rounded-xl transition-all group"
          aria-label="Close post"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <div className="relative flex-1 min-w-0 max-w-2xl">
          <Image
            src={post.imageUrl}
            alt={post.caption || "Post image"}
            fill
            className="object-cover cursor-zoom-in hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 1024px) 60vw, 50vw"
          />
        </div>

        <div className="w-full max-w-md flex flex-col border-l border-gray-200">
          <PostHeader author={post.author} location={post.location} />

          <div className="flex-1 min-h-0 overflow-y-auto">
            <PostActions
              postId={post._id}
              likesCount={post.likesCount}
              isLiked={post.isLiked}
              commentsCount={commentsCount}
            />

            {post.caption && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <span className="font-semibold text-sm">
                    {post.author.username}
                  </span>
                  <p className="text-sm flex-1">{post.caption}</p>
                </div>
              </div>
            )}

            <CommentSection
              postId={post._id}
              initialComments={post.comments ?? []}
              initialHasMore={false}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
