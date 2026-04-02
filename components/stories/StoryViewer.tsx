"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/shared/Avatar";
import { StoryType } from "@/types/story.types";
import { timeAgo } from "@/utils/formatDate";

interface StoryViewerProps {
  story: StoryType;
  onClose: () => void;
}

export function StoryViewer({ story, onClose }: StoryViewerProps) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState(0);
  const isOwn = session?.user?.username === story.author.username;

  // Auto progress — 5 seconds per story
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5000ms / 100 = 50ms per tick

    return () => clearInterval(interval);
  }, [story._id, onClose]);

  const handleDelete = async () => {
    await fetch(`/api/stories/${story._id}`, { method: "DELETE" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white p-2 rounded-full hover:bg-white/10"
      >
        <X size={24} />
      </button>

      {/* Story content */}
      <div className="relative w-full max-w-sm h-full max-h-[90vh] mx-auto">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-4">
          <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 right-0 z-10 px-4 flex items-center justify-between">
          <Link
            href={`/profile/${story.author.username}`}
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <Avatar
              src={story.author.avatarUrl}
              alt={story.author.username}
              size="sm"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                {story.author.username}
              </p>
              <p className="text-white/70 text-xs">
                {timeAgo(story.createdAt)}
              </p>
            </div>
          </Link>

          {isOwn && (
            <button
              onClick={handleDelete}
              className="text-white p-2 rounded-full hover:bg-white/10"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Image */}
        <div className="w-full h-full relative">
          <Image
            src={story.imageUrl}
            alt="Story"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Caption */}
        {story.caption && (
          <div className="absolute bottom-8 left-0 right-0 px-4">
            <p className="text-white text-sm text-center bg-black/40 rounded-lg px-3 py-2">
              {story.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
