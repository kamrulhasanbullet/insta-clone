"use client";

import Image from "next/image";
import Link from "next/link";
import { PostType } from "@/types/post.types";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/utils/cn";

interface ProfileGridProps {
  posts: PostType[];
  loading?: boolean;
}

export function ProfileGrid({ posts, loading = false }: ProfileGridProps) {
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
        <p className="text-sm text-gray-500">
          When {posts[0]?.author.username} adds photos and videos here, they'll
          appear.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-8 px-4">
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post._id}`}
            className="group relative aspect-square overflow-hidden rounded-sm bg-black"
          >
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-200"
              sizes="(max-width: 768px) 33vw, 200px"
            />
            {/* Overlay stats */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end p-2 opacity-0 group-hover:opacity-100">
              <div className="flex gap-4 text-white text-sm">
                <span>{post.likesCount}</span>
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
