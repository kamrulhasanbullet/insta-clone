"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { PostType } from "@/types/post.types";
import { Skeleton } from "@/components/shared/Skeleton";

export default function SavedPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-20 md:pb-4">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 rounded-xl">
        <h1 className="text-lg font-semibold">Saved</h1>
      </div>

      {loading && (
        <div className="grid grid-cols-3 gap-1 mt-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Bookmark size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-semibold text-gray-700">No saved posts</p>
          <p className="text-sm mt-1">
            Save photos and videos to see them here.
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mt-1">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className="relative aspect-square group overflow-hidden bg-gray-100"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption || "Saved post"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 33vw, 300px"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
