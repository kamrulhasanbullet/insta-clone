"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileGrid } from "@/components/profile/ProfileGrid";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  return (
    <div>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent username={username} />
      </Suspense>
    </div>
  );
}

async function ProfileContent({ username }: { username: string }) {
  let user: any = null;
  let posts: any[] = [];

  try {
    const [userRes, postsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${username}`),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${username}/posts`),
    ]);

    if (userRes.ok) user = await userRes.json();
    if (postsRes.ok) ({ posts } = await postsRes.json());
  } catch (error) {
    console.error("Failed to load profile:", error);
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">User not found</p>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader user={user.user} />
      <hr className="border-gray-300 mx-4" />
      <ProfileGrid posts={posts} />
    </>
  );
}
