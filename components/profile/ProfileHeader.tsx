"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFollow } from "@/hooks/useFollow";
import { Avatar } from "@/components/shared/Avatar";
import { UserWithFollow } from "@/types/user.types";

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

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <div className="flex items-start gap-10 mb-8">
        {/* Avatar */}
        <div className="relative w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-orange-400 p-0.5 shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <Avatar src={user.avatarUrl} alt={user.username} size="xl" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h1 className="text-xl font-light">{user.username}</h1>
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center gap-2"
              >
                Edit profile
              </Link>
            ) : (
              <button
                onClick={toggle}
                disabled={loading}
                className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  following
                    ? "border border-gray-300 hover:bg-gray-50"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {loading ? "..." : following ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-4">
            {[
              { label: "posts", value: user.postsCount },
              { label: "followers", value: user.followersCount },
              { label: "following", value: user.followingCount },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <span className="font-semibold text-sm">
                  {value.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 ml-1">{label}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div>
            <p className="font-semibold text-sm">{user.fullName}</p>
            {user.bio && (
              <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-900 font-semibold"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
