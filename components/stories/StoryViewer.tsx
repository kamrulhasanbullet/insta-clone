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
  onDelete?: (storyId: string) => void;
}

export function StoryViewer({
  stories,
  initialIndex = 0,
  onClose,
  onDelete,
}: StoryViewerProps) {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const onCloseRef = useRef(onClose);

  const story = stories[currentIndex];
  const isOwn = session?.user?.username === story?.author.username;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!story || showDeleteModal) return;
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
  }, [story?._id, currentIndex, showDeleteModal]);

  if (!story) return null;

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await fetch(`/api/stories/${story._id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteModal(false);
    onDelete?.(story._id);
    onCloseRef.current();
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteModal) return;
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onCloseRef.current();
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteModal) return;
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
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="text-white bg-black p-2 rounded-full hover:bg-red-700/80 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Prev / Next tap areas */}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl w-72 overflow-hidden shadow-xl">
              <div className="px-6 py-5 text-center border-b border-gray-100">
                <h3 className="text-base font-semibold">Delete Story?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This story will be permanently deleted.
                </p>
              </div>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-full py-3 text-sm font-semibold text-red-500 hover:bg-gray-50 transition-colors border-b border-gray-100 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(false);
                }}
                className="w-full py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
