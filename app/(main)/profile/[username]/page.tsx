import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
// import { ProfileGrid } from "@/components/profile/ProfileGrid";
import { UserService } from "@/services/user.service";
import { PostService } from "@/services/post.service";

interface Props {
  params: { username: string };
}

export default async function ProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const [user, posts] = await Promise.all([
    UserService.getUserByUsername(params.username, session?.user?.id).catch(
      () => null,
    ),
    PostService.getUserPosts(params.username, session?.user?.id).catch(
      () => [],
    ),
  ]);

  if (!user) notFound();

  return (
    <>
      <ProfileHeader user={user as any} />
      <hr className="border-gray-300" />
      {/* <ProfileGrid posts={posts as any} /> */}
    </>
  );
}
