"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  LogOut,
  Bookmark,
  Activity,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/utils/cn";
import { FaInstagram } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useUnreadCount } from "@/hooks/useNotifications";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/post/create", label: "Create", icon: PlusSquare },
  { href: "/notifications", label: "Notifications", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const unreadCount = useUnreadCount(); 

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 xl:w-72 border-r border-gray-200 bg-white px-4 py-6 z-40">
      <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-4">
        <FaInstagram size={28} className="text-pink-600" />
        <span className="text-xl font-bold tracking-tight hidden xl:block">
          Instagram
        </span>
      </Link>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors",
              pathname === href && "font-bold",
            )}
          >
            {/* Icon with badge */}
            <div className="relative">
              <Icon
                size={24}
                strokeWidth={pathname === href ? 2.5 : 1.5}
                className={cn(
                  href === "/notifications" &&
                    unreadCount > 0 &&
                    "text-red-500",
                )}
              />
              {href === "/notifications" && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="hidden xl:block">{label}</span>
          </Link>
        ))}

        {session && (
          <Link
            href={`/profile/${session.user.username}`}
            className={cn(
              "flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors",
              pathname.startsWith("/profile") && "font-bold",
            )}
          >
            <Avatar
              src={session.user.image || ""}
              alt={session.user.username || ""}
              size="xs"
            />
            <span className="hidden xl:block">Profile</span>
          </Link>
        )}
      </nav>

      {/* More button */}
      <div ref={moreRef} className="relative">
        {showMore && (
          <div className="absolute bottom-14 left-0 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
            <Link
              href="/saved"
              onClick={() => setShowMore(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Bookmark size={20} />
              Saved
            </Link>
            <Link
              href="/activity"
              onClick={() => setShowMore(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Activity size={20} />
              Your Activity
            </Link>
            <hr className="border-gray-100" />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              Log out
            </button>
          </div>
        )}

        <button
          onClick={() => setShowMore((v) => !v)}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {showMore ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <MoreHorizontal size={24} strokeWidth={1.5} />
          )}
          <span className="hidden xl:block">More</span>
        </button>
      </div>
    </aside>
  );
}
