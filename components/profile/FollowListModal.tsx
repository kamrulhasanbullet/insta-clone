"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/shared/Skeleton";
import { useFollow } from "@/hooks/useFollow";
import { useSession } from "next-auth/react";

interface FollowUser {
  _id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  isVerified: boolean;
}

interface FollowListModalProps {
  username: string;
  type: "followers" | "following";
  onClose: () => void;
}

function FollowUserItem({
  user,
  onClose,
}: {
  user: FollowUser;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.username === user.username;
  const { following, toggle, loading } = useFollow(user.username, false);

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
      <Link
        href={`/profile/${user.username}`}
        onClick={onClose}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <Avatar src={user.avatarUrl} alt={user.username} size="md" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{user.username}</p>
          <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
        </div>
      </Link>

      {!isOwnProfile && (
        <button
          onClick={toggle}
          disabled={loading}
          className={`ml-3 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            following
              ? "border border-gray-300 hover:bg-gray-50"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "..." : following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

export function FollowListModal({
  username,
  type,
  onClose,
}: FollowListModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${username}/${type}`)
      .then((res) => res.json())
      .then((data) => {
        if (type === "followers") {
          setUsers(data.followers?.map((f: any) => f.follower) ?? []);
        } else {
          setUsers(data.following?.map((f: any) => f.following) ?? []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username, type]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 max-h-[70vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-semibold capitalize">{type}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="space-y-1 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">No {type} yet</p>
            </div>
          )}

          {!loading &&
            users.map((user) => (
              <FollowUserItem key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>
    </div>
  );
}
