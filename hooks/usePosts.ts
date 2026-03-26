import { useState, useCallback } from "react";
import { PostType } from "@/types/post.types";

export function useFeed() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?page=${page}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  return { posts, loadMore, hasMore, loading };
}
