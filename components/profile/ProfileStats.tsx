"use client";

import { User, Users, UserPlus } from "lucide-react";

interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
}: ProfileStatsProps) {
  const stats = [
    { label: "posts", value: postsCount, icon: User },
    { label: "followers", value: followersCount, icon: Users },
    { label: "following", value: followingCount, icon: UserPlus },
  ];

  return (
    <div className="flex gap-8 mb-6 px-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Icon size={16} className="text-gray-500" />
            <span className="text-2xl font-bold">{value.toLocaleString()}</span>
          </div>
          <span className="text-sm text-gray-500 capitalize">{label}</span>
        </div>
      ))}
    </div>
  );
}
