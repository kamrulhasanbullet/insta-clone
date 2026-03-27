"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  const redirectIfNotAuth = useCallback(
    (path: string = "/") => {
      if (!isAuthenticated && !isLoading) {
        router.push("/login");
      }
    },
    [isAuthenticated, isLoading, router],
  );

  return {
    session,
    isAuthenticated,
    isLoading,
    logout,
    redirectIfNotAuth,
  };
}
