import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileGrid } from "@/components/profile/ProfileGrid";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { UserService } from "@/services/user.service";
import { PostService } from "@/services/post.service";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params; 

  return (
    <div>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent username={username} />
      </Suspense>
    </div>
  );
}

async function ProfileContent({ username }: { username: string }) {
  const session = await getServerSession(authOptions);

  const [user, posts] = await Promise.all([
    UserService.getUserByUsername(username, session?.user?.id).catch(
      () => null,
    ),
    PostService.getUserPosts(username, session?.user?.id).catch(() => []),
  ]);

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">User not found</p>
      </div>
    );
  }

  const plainUser = JSON.parse(JSON.stringify(user));
  const plainPosts = JSON.parse(JSON.stringify(posts));

  return (
    <>
      <ProfileHeader user={plainUser} />
      <hr className="border-gray-300 mx-4" />
      <ProfileGrid posts={plainPosts} />
    </>
  );
}
