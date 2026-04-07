"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFollow } from "@/hooks/useFollow";
import { Avatar } from "@/components/shared/Avatar";
import { UserWithFollow } from "@/types/user.types";
import { useCallback, useState } from "react";
import { StoryType } from "@/types/story.types";
import { StoryViewer } from "../stories/StoryViewer";
import { FollowListModal } from "./FollowListModal";

interface ProfileHeaderProps {
  user: UserWithFollow;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.username === user.username;
  const { following, toggle, loading } = useFollow(
    user.username,
    user.isFollowing,
  );
  const [stories, setStories] = useState<StoryType[]>([]);
  const [followModal, setFollowModal] = useState<
    "followers" | "following" | null
  >(null);

  const handleAvatarClick = async () => {
    const res = await fetch(`/api/users/${user.username}/stories`);
    const data = await res.json();
    if (data.stories?.length > 0) {
      setStories(data.stories);
    }
  };

  const handleStoryClose = useCallback(() => {
    setStories([]);
  }, []);

  return (
    <div className="px-4 pt-20 pb-6 md:py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          {/* Avatar */}
          <div className="mx-auto shrink-0 md:mx-0">
            <div className="relative h-36 w-36 overflow-hidden rounded-full bg-linear-to-br from-pink-400 to-orange-400 p-0.5">
              <div
                onClick={handleAvatarClick}
                className="h-full w-full overflow-hidden rounded-full bg-white cursor-pointer"
              >
                <Avatar src={user.avatarUrl} alt={user.username} size="xl" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4 md:flex-wrap md:justify-start">
              <h1 className="hidden md:block font-light md:text-2xl">
                {user.username}
              </h1>

              {!isOwnProfile && (
                <button
                  onClick={toggle}
                  disabled={loading}
                  className={`w-full rounded-lg px-6 py-2 text-sm font-semibold transition-colors md:w-auto ${
                    following
                      ? "border border-gray-300 hover:bg-gray-50"
                      : user.isFollowedBy
                        ? "border border-blue-500 text-blue-500 hover:bg-blue-50" // ← Follow Back
                        : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {loading
                    ? "..."
                    : following
                      ? "Following"
                      : user.isFollowedBy
                        ? "Follow Back"
                        : "Follow"}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 md:justify-start md:gap-8 mb-4">
              <div className="text-center">
                <span className="font-semibold text-sm md:text-base">
                  {user.postsCount.toLocaleString()}
                </span>
                <span className="ml-1 text-sm text-gray-600">posts</span>
              </div>

              {/* Followers — clickable */}
              <button
                onClick={() => setFollowModal("followers")}
                className="text-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="font-semibold text-sm md:text-base">
                  {user.followersCount.toLocaleString()}
                </span>
                <span className="ml-1 text-sm text-gray-600">followers</span>
              </button>

              {/* Following — clickable */}
              <button
                onClick={() => setFollowModal("following")}
                className="text-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="font-semibold text-sm md:text-base">
                  {user.followingCount.toLocaleString()}
                </span>
                <span className="ml-1 text-sm text-gray-600">following</span>
              </button>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <p className="font-semibold text-sm">{user.fullName}</p>

              {user.bio && (
                <p className="whitespace-pre-wrap text-sm">{user.bio}</p>
              )}

              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold text-blue-900 wrap-break-words"
                >
                  {user.website}
                </a>
              )}

              {isOwnProfile && (
                <div className="pt-2">
                  <Link
                    href="/profile/edit"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 md:w-auto"
                  >
                    Edit profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {stories.length > 0 && (
        <StoryViewer
          stories={stories}
          onClose={handleStoryClose}
          onDelete={(id) =>
            setStories((prev) => prev.filter((s) => s._id !== id))
          }
        />
      )}

      {/* Follow List Modal */}
      {followModal && (
        <FollowListModal
          username={user.username}
          type={followModal}
          onClose={() => setFollowModal(null)}
        />
      )}
    </div>
  );
}
