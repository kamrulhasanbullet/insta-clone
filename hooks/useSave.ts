import { useState } from "react";
import { useSession } from "next-auth/react";

export function useSave(postId: string, initialSaved: boolean) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!session || loading) return;
    setLoading(true);
    const prev = saved;
    setSaved(!prev); 

    try {
      const method = prev ? "DELETE" : "POST";
      const res = await fetch(`/api/posts/${postId}/save`, { method });
      if (!res.ok) setSaved(prev); 
    } catch {
      setSaved(prev);
    } finally {
      setLoading(false);
    }
  };

  return { saved, toggle, loading };
}
