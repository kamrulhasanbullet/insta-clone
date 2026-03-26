'use client';

import { useEffect } from 'react';
import { PostCard } from '@/components/post/PostCard';
import { Skeleton } from '@/components/shared/Skeleton';
import { useFeed } from '@/hooks/usePosts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export function Feed() {
  const { posts, loadMore, hasMore, loading } = useFeed();

  useEffect(() => {
    loadMore();
  }, []);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  if (!loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-semibold mb-2">No posts yet</p>
        <p className="text-sm">Follow people to see their posts here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <>
          <Skeleton className="w-full max-w-lg h-96 rounded-lg mb-4" />
          <Skeleton className="w-full max-w-lg h-96 rounded-lg mb-4" />
        </>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {!hasMore && posts.length > 0 && (
        <p className="text-sm text-gray-400 py-8">You're all caught up! 🎉</p>
      )}
    </div>
  );
}