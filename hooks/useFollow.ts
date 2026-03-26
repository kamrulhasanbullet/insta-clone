import { useState } from "react";
import { useSession } from "next-auth/react";

export function useFollow(username: string, initialFollowing: boolean) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!session || loading) return;
    setLoading(true);
    const prev = following;
    setFollowing(!prev); // optimistic

    try {
      const method = prev ? "DELETE" : "POST";
      const res = await fetch(`/api/users/${username}/follow`, { method });
      if (!res.ok) setFollowing(prev);
    } catch {
      setFollowing(prev);
    } finally {
      setLoading(false);
    }
  };

  return { following, toggle, loading };
}
