"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { PostType } from "@/types/post.types";
import { Skeleton } from "@/components/shared/Skeleton";
import { useState } from "react";

interface ProfileGridProps {
  posts: PostType[];
  loading?: boolean;
}

export function ProfileGrid({
  posts: initialPosts,
  loading = false,
}: ProfileGridProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = async (postId: string, authorUsername: string) => {
    if (session?.user?.username !== authorUsername) return;
    if (!confirm("Delete this post?")) return;

    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 pt-8 px-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-sm" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400">📸</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No posts yet
        </h3>
        <p className="text-sm text-gray-500">No photos or videos yet.</p>
      </div>
    );
  }

  return (
    <div className="pt-4 px-4 pb-20 md:pb-4">
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post._id}`}
            className="group relative aspect-square overflow-hidden bg-black"
          >
            <>
              <Image
                src={post.imageUrl}
                alt={post.caption || "Post"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 33vw, 200px"
              />
            </>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 opacity-0 group-hover:opacity-100">
              {/* Delete button — top right */}
              {session?.user?.username === post.author.username && (
                <button
                  onClick={() => handleDelete(post._id, post.author.username)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-colors"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              )}

              {/* Like & Comment count — bottom */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-4 text-white text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <Heart size={16} className="fill-white" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} className="fill-white" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
