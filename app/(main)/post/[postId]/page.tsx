import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { CommentService } from "@/services/comment.service";
import { PostCard } from "@/components/post/PostCard";
import { CommentSection } from "@/components/post/CommentSection";
import { Skeleton } from "@/components/shared/Skeleton";

interface Props {
  params: Promise<{ postId: string }>; // ← Promise
}

export default async function PostPage({ params }: Props) {
  const { postId } = await params; // ← await

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Suspense fallback={<Skeleton className="w-full h-96 rounded-lg" />}>
        <PostContent postId={postId} />
      </Suspense>
    </div>
  );
}

async function PostContent({ postId }: { postId: string }) {
  const session = await getServerSession(authOptions);

  const [post, commentsData] = await Promise.all([
    PostService.getPostById(postId, session?.user?.id).catch(() => null),
    CommentService.getComments(postId).catch(() => ({
      comments: [],
      total: 0,
      hasMore: false,
    })),
  ]);

  if (!post) return notFound();

  const plainPost = JSON.parse(JSON.stringify(post));
  const plainComments = JSON.parse(JSON.stringify(commentsData));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <PostCard post={plainPost} />
      <CommentSection
        postId={postId}
        initialComments={plainComments.comments}
        initialHasMore={plainComments.hasMore}
      />
    </div>
  );
}
