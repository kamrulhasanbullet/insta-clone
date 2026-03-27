"use client";

import Link from "next/link";
import { Avatar } from "@/components/shared/Avatar";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

interface PostHeaderProps {
  author: {
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  location?: string;
}

export function PostHeader({ author, location }: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link
        href={`/profile/${author.username}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <Avatar src={author.avatarUrl} alt={author.username} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{author.username}</p>
          {location && (
            <p className="text-xs text-gray-500 truncate">{location}</p>
          )}
        </div>
      </Link>

      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}
