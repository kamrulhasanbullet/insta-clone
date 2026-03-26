import { useState } from "react";
import { useSession } from "next-auth/react";

export function useLike(
  postId: string,
  initialLiked: boolean,
  initialCount: number,
) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!session || loading) return;
    setLoading(true);

    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/posts/${postId}/like`, { method });
      if (!res.ok) {
        // Revert on failure
        setLiked(liked);
        setCount(initialCount);
      }
    } catch {
      setLiked(liked);
      setCount(initialCount);
    } finally {
      setLoading(false);
    }
  };

  return { liked, count, toggle, loading };
}
