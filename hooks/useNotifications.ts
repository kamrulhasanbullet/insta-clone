"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { NotificationType } from "@/types/notification.types";

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchNotifications = useCallback(
    async (pageNum: number = 1) => {
      if (!session?.user?.id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/notifications?page=${pageNum}`);
        const data = await res.json();

        if (pageNum === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        setUnreadCount(data.unreadCount);
        setHasMore(data.hasMore);
        setPage(pageNum + 1);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [session?.user?.id],
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchNotifications(page);
    }
  }, [fetchNotifications, page, hasMore, loading]);

  const markAllRead = useCallback(async () => {
    if (!session?.user?.id || unreadCount === 0) return;

    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }, [session?.user?.id, unreadCount]);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!session?.user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications(1);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, session?.user?.id]);

  return {
    notifications,
    unreadCount,
    loading: loading || initialLoad,
    hasMore,
    loadMore,
    markAllRead,
    refetch: () => fetchNotifications(1),
  };
}
