"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/shared/Avatar";
import { StoryType } from "@/types/story.types";
import { timeAgo } from "@/utils/formatDate";

interface StoryViewerProps {
  stories: StoryType[];
  initialIndex?: number;
  onClose: () => void;
}

export function StoryViewer({
  stories,
  initialIndex = 0,
  onClose,
}: StoryViewerProps) {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const onCloseRef = useRef(onClose);
  const deletingRef = useRef(false);
  const story = stories[currentIndex];
  const isOwn = session?.user?.username === story?.author.username;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!story) return;
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const closeTimeout = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onCloseRef.current();
      }
    }, 5100);

    return () => {
      clearInterval(interval);
      clearTimeout(closeTimeout);
    };
  }, [story?._id, currentIndex]);

  if (!story) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingRef.current) return;
    deletingRef.current = true;
    await fetch(`/api/stories/${story._id}`, { method: "DELETE" });
    onCloseRef.current();
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onCloseRef.current();
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCloseRef.current();
        }}
        className="absolute top-4 right-4 z-30 text-white p-2 rounded-full hover:bg-white/10"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-sm h-full max-h-[90vh] mx-auto">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4 flex gap-1">
          {stories.map((s, i) => (
            <div
              key={s._id}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 right-0 z-20 px-4 flex items-center justify-between">
          <Link
            href={`/profile/${story.author.username}`}
            onClick={(e) => {
              e.stopPropagation();
              onCloseRef.current();
            }}
            className="flex items-center gap-2"
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
              className="text-white p-2 rounded-full hover:bg-red-700"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Prev / Next tap areas — z-10 (header এর নিচে) */}
        <div className="absolute inset-0 flex z-10">
          <div className="flex-1 cursor-pointer" onClick={goPrev} />
          <div className="flex-1 cursor-pointer" onClick={goNext} />
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
          <div className="absolute bottom-8 left-0 right-0 px-4 z-20">
            <p className="text-white text-sm text-center bg-black/40 rounded-lg px-3 py-2">
              {story.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
