"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { StoryType } from "@/types/story.types";
import { StoryViewer } from "@/components/stories/StoryViewer";

export function StoriesBar() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<StoryType[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => setStories(data.stories ?? []))
      .catch(console.error);
  }, []);

  const handleStoryClick = async (story: StoryType) => {
    setSelectedStory(story);
    // Mark as viewed
    await fetch(`/api/stories/${story._id}/view`, { method: "POST" });
    setStories((prev) =>
      prev.map((s) => (s._id === story._id ? { ...s, isViewed: true } : s)),
    );
  };

  const myStory = stories.find(
    (s) => s.author.username === session?.user?.username,
  );

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-4 px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide"
      >
        {/* Add Story */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {myStory ? (
            <button
              onClick={() => handleStoryClick(myStory)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  myStory.isViewed
                    ? "bg-gray-300"
                    : "bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                  <Avatar
                    src={session?.user?.image}
                    alt="Your story"
                    size="lg"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <span className="text-xs truncate max-w-16">Your story</span>
            </button>
          ) : (
            <Link
              href="/stories/create"
              className="flex flex-col items-center gap-1"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative">
                <Avatar
                  src={session?.user?.image}
                  alt="Your story"
                  size="lg"
                  className="w-full h-full opacity-60"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus size={10} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <span className="text-xs truncate max-w-16">Add story</span>
            </Link>
          )}
        </div>

        {/* Other stories */}
        {stories
          .filter((s) => s.author.username !== session?.user?.username)
          .map((story) => (
            <button
              key={story._id}
              onClick={() => handleStoryClick(story)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.isViewed
                    ? "bg-gray-300"
                    : "bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                  <Avatar
                    src={story.author.avatarUrl}
                    alt={story.author.username}
                    size="lg"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <span className="text-xs truncate max-w-16">
                {story.author.username}
              </span>
            </button>
          ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
}
