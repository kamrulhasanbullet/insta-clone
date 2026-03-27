"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@/components/shared/Avatar";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { NotificationType } from "@/types/notification.types";
import { timeAgo } from "@/utils/formatDate";
import { cn } from "@/utils/cn";

interface NotificationItemProps {
  notification: NotificationType;
}

const iconMap: Record<string, React.ReactNode> = {
  like: <Heart className="w-5 h-5 fill-red-500 text-red-500" />,
  comment: <MessageCircle className="w-5 h-5" />,
  follow: <UserPlus className="w-5 h-5" />,
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const getNotificationText = () => {
    const action =
      notification.type === "like"
        ? "liked"
        : notification.type === "comment"
          ? "commented on"
          : "started following";

    return (
      <>
        <span className="font-semibold">{notification.sender.username}</span>{" "}
        {action}{" "}
        {notification.post && (
          <Link
            href={`/post/${notification.post._id}`}
            className="text-blue-500 hover:underline"
          >
            your post
          </Link>
        )}
        {notification.type === "follow" && "you"}.
      </>
    );
  };

  return (
    <Link
      href={`/profile/${notification.sender.username}`}
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
        !notification.isRead && "bg-blue-50 border-blue-100",
      )}
    >
      <Avatar
        src={notification.sender.avatarUrl}
        alt={notification.sender.username}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getNotificationText()}
            </p>
            <p className="text-xs text-gray-500">
              {timeAgo(notification.createdAt)}
            </p>
          </div>
          {iconMap[notification.type]}
        </div>

        {notification.post && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ml-12">
            <Image
              src={notification.post.imageUrl}
              alt="Post preview"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
