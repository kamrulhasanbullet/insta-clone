"use client";

import { useState, useCallback, useEffect } from "react";
import { NotificationType } from "@/types/notification.types";

// Global state shared across all components using this hook
let globalUnreadCount = 0;
const listeners = new Set<(count: number) => void>();

function setGlobalUnread(count: number) {
  globalUnreadCount = count;
  listeners.forEach((fn) => fn(count));
}

export function useUnreadCount() {
  const [count, setCount] = useState(globalUnreadCount);

  useEffect(() => {
    const listener = (c: number) => setCount(c);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    fetch("/api/notifications?page=1")
      .then((res) => res.json())
      .then((data) => setGlobalUnread(data.unreadCount ?? 0))
      .catch(console.error);
  }, []);

  return count;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(globalUnreadCount);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const listener = (c: number) => setUnreadCount(c);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const fetchNotifications = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${pageNum}`);
      const data = await res.json();

      if (pageNum === 1) {
        setNotifications(data.notifications ?? []);
      } else {
        setNotifications((prev) => [...prev, ...(data.notifications ?? [])]);
      }

      setGlobalUnread(data.unreadCount ?? 0);
      setHasMore(data.hasMore ?? false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  }, [loading, hasMore, page, fetchNotifications]);

  const markAllRead = useCallback(async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setGlobalUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAllRead,
  };
}
