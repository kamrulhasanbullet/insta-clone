import { useState, useCallback, useRef } from "react";
import { PostType } from "@/types/post.types";

export function useFeed() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false); // ← duplicate call prevent করবে

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?page=${page}`);
      const data = await res.json();

      setPosts((prev) => {
        // ← duplicate filter করো
        const existingIds = new Set(prev.map((p) => p._id));
        const newPosts = data.posts.filter(
          (p: PostType) => !existingIds.has(p._id),
        );
        return [...prev, ...newPosts];
      });

      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore]);

  return { posts, loadMore, hasMore, loading };
}
