"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostType } from "@/types/post.types";
import { Skeleton } from "@/components/shared/Skeleton";
import { SearchBar } from "@/components/search/SearchBar";

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const res = await fetch("/api/posts?explore=true");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch explore posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-2 mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        placeholder="Search for posts and users"
        className="mb-8 max-w-md"
      />

      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post._id}`}
            className="group relative overflow-hidden rounded-lg aspect-square block"
          >
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-200"
              sizes="(max-width: 768px) 33vw, 400px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-1">Try searching for something else</p>
        </div>
      )}
    </div>
  );
}
