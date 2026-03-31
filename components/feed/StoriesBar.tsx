"use client";

import Link from "next/link";
import { Avatar } from "@/components/shared/Avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function StoriesBar() {
  const { data: session } = useSession();

  const stories = [
    {
      id: "new",
      username: "Create",
      avatarUrl: "/story-placeholder.png",
      isNew: true,
    },
    // Add more stories here
  ];

  return (
    <div className="flex gap-4 px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
      {session && (
        <Link
          href="/post/create"
          className="flex flex-col items-center gap-1 shrink-0"
        >
          <div className="w-16 h-16 rounded-full bg-linear-to-r from-pink-500 to-orange-500 p-0.5 shrink-0">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt="Your story"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <span className="text-xs text-center leading-tight max-w-16 truncate">
            Your Story
          </span>
        </Link>
      )}

      {stories.map((story) => (
        <Link
          key={story.id}
          href={`/stories/${story.id}`}
          className="flex flex-col items-center gap-1 shrink-0"
        >
          <div className="relative w-16 h-16 shrink-0">
            <div className="w-16 h-16 bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full p-0.5">
              <Avatar src={story.avatarUrl} alt={story.username} size="lg" />
            </div>
            {story.isNew && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-50 flex items-center justify-center">
                <div className="w-2 h-2 bg-linear-to-r from-pink-500 to-orange-500 rounded-full" />
              </div>
            )}
          </div>
          <span className="text-xs text-center leading-tight max-w-16 truncate">
            {story.username}
          </span>
        </Link>
      ))}
    </div>
  );
}
