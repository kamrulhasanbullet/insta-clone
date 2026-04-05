"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
} from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { StoryType } from "@/types/story.types";
import { StoryViewer } from "@/components/stories/StoryViewer";

export function StoriesBar() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<StoryType[]>([]);
  const [selectedStories, setSelectedStories] = useState<StoryType[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => setStories(data.stories ?? []))
      .catch(console.error);
  }, []);

  const handleStoryClick = async (authorUsername: string) => {
    const userStories = stories.filter(
      (s) => s.author.username === authorUsername,
    );
    if (userStories.length === 0) return;

    setSelectedStories(userStories);

    // Mark first story as viewed
    await fetch(`/api/stories/${userStories[0]._id}/view`, { method: "POST" });
    setStories((prev) =>
      prev.map((s) =>
        s.author.username === authorUsername && s._id === userStories[0]._id
          ? { ...s, isViewed: true }
          : s,
      ),
    );
  };

  const myStories = stories.filter(
    (s) => s.author.username === session?.user?.username,
  );
  const hasMyStory = myStories.length > 0;

  // unique users for other stories
  const otherUsers = stories
    .filter((s) => s.author.username !== session?.user?.username)
    .reduce((acc: StoryType[], story) => {
      const exists = acc.find(
        (s) => s.author.username === story.author.username,
      );
      if (!exists) acc.push(story);
      return acc;
    }, []);

  const handleClose = useCallback(() => {
    startTransition(() => {
      setSelectedStories([]);
    });
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-4 px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide"
      >
        {/* My Story */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {hasMyStory ? (
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <button
                  onClick={() =>
                    handleStoryClick(session?.user?.username ?? "")
                  }
                  className="cursor-pointer"
                >
                  <div
                    className="w-16 h-16 rounded-full p-0.5"
                    style={{
                      background: myStories.every((s) => s.isViewed)
                        ? "#d1d5db"
                        : "linear-gradient(to top right, #facc15, #ec4899, #9333ea)",
                    }}
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
                </button>

                {/* Add more stories */}
                <Link
                  href="/stories/create"
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <Plus size={10} className="text-white" strokeWidth={3} />
                </Link>
              </div>
              <span className="text-xs truncate max-w-16">
                Your story ({myStories.length})
              </span>
            </div>
          ) : (
            <Link
              href="/stories/create"
              className="flex flex-col items-center gap-1 cursor-pointer"
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

        {/* Other users' stories */}
        {otherUsers.map((story) => {
          const userStoryCount = stories.filter(
            (s) => s.author.username === story.author.username,
          ).length;
          const allViewed = stories
            .filter((s) => s.author.username === story.author.username)
            .every((s) => s.isViewed);

          return (
            <button
              key={story.author.username}
              onClick={() => handleStoryClick(story.author.username)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-full p-0.5"
                style={{
                  background: allViewed
                    ? "#d1d5db"
                    : "linear-gradient(to top right, #facc15, #ec4899, #9333ea)",
                }}
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
                {userStoryCount > 1 && ` (${userStoryCount})`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Viewer */}
      {selectedStories.length > 0 && (
        <StoryViewer stories={selectedStories} onClose={handleClose} />
      )}
    </>
  );
}
