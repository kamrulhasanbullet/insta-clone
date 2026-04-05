"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check } from "lucide-react";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Spinner } from "@/components/shared/Spinner";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/shared/Skeleton";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    loadMore,
    hasMore,
  } = useNotifications();
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const handleMarkAllRead = async () => {
    if (markingAllRead || unreadCount === 0) return;
    setMarkingAllRead(true);
    try {
      await markAllRead();
    } finally {
      setMarkingAllRead(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-gray-500">
        <p>Please sign in to view notifications</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-4">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="text-sm text-blue-500 font-semibold hover:text-blue-600 disabled:opacity-50 flex items-center gap-1"
            >
              {markingAllRead ? <Spinner size="sm" /> : <Check size={16} />}
              Mark all read
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-xs text-gray-500">{unreadCount} unread</p>
        )}
      </div>

      {/* Notifications List */}
      {loading && notifications.length === 0 ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-48 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <Bell size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No notifications yet</p>
          <p className="text-sm mt-1">
            You'll see notifications here when others interact with you
          </p>
        </div>
      ) : (
        <div className="space-y-px">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))}

          {hasMore && (
            <div className="p-4 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
