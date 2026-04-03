"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { timeAgo } from "@/utils/formatDate";

interface ActivityItem {
  _id: string;
  post: {
    _id: string;
    imageUrl: string;
    caption: string;
  };
  createdAt: string;
}

export default function YourActivityPage() {
  const [activeTab, setActiveTab] = useState<"likes" | "comments">("likes");
  const [likes, setLikes] = useState<ActivityItem[]>([]);
  const [comments, setComments] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/activity?type=${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (activeTab === "likes") setLikes(data.items ?? []);
        else setComments(data.items ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  const items = activeTab === "likes" ? likes : comments;

  return (
    <div className="pb-20 md:pb-4">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">Your Activity</h1>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "likes"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
          >
            <Heart
              size={16}
              className={activeTab === "likes" ? "fill-black" : ""}
            />
            Likes
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "comments"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
          >
            <MessageCircle
              size={16}
              className={activeTab === "comments" ? "fill-black" : ""}
            />
            Comments
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-1 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-48 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          {activeTab === "likes" ? (
            <Heart size={48} className="mb-4 opacity-50" />
          ) : (
            <MessageCircle size={48} className="mb-4 opacity-50" />
          )}
          <p className="text-base font-semibold text-gray-600">
            No {activeTab} yet
          </p>
          <p className="text-sm mt-1">
            {activeTab === "likes"
              ? "Posts you like will appear here."
              : "Posts you commented on will appear here."}
          </p>
        </div>
      )}

      {/* Items */}
      {!loading && items.length > 0 && (
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <Link
              key={item._id}
              href={`/post/${item.post._id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              {/* Post thumbnail */}
              <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={item.post.imageUrl}
                  alt="Post"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {activeTab === "likes" ? (
                    <Heart
                      size={14}
                      className="fill-red-500 text-red-500 shrink-0"
                    />
                  ) : (
                    <MessageCircle
                      size={14}
                      className="text-gray-500 shrink-0"
                    />
                  )}
                  <p className="text-sm text-gray-700 truncate">
                    {item.post.caption || "No caption"}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {timeAgo(item.createdAt)}
                </p>
              </div>

              {/* Arrow */}
              <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={item.post.imageUrl}
                  alt="Post"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
