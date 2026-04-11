"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, PlusSquare, Heart } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/utils/cn";
import { useUnreadCount } from "@/hooks/useNotifications";
import { BsInstagram } from "react-icons/bs";

const navItems = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/explore",
    label: "Explore",
    icon: Search,
    match: (p: string) => p === "/explore",
  },
  {
    href: "/post/create",
    label: "Create",
    icon: PlusSquare,
    match: (p: string) => p === "/post/create",
  },
  {
    href: "/notifications",
    label: "Activity",
    icon: Heart,
    match: (p: string) => p === "/notifications",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const unreadCount = useUnreadCount(); 

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden z-50 shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(({ href, icon: Icon, label, match }) => {
            const isActive = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all",
                  isActive ? "text-black" : "text-gray-500 hover:text-gray-900",
                )}
              >
                {/* Icon with badge */}
                <div className="relative">
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 1.5}
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
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}

          {session && (
            <Link
              href={`/profile/${session.user.username}`}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all",
                pathname.startsWith("/profile")
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              <Avatar
                src={session.user.image}
                alt={session.user.username || ""}
                size="xs"
                className={
                  pathname.startsWith("/profile") ? "ring-2 ring-black" : ""
                }
              />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          )}
        </div>
      </nav>

      {pathname.startsWith("/profile") && (
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 md:hidden z-40 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
              <BsInstagram size={24} className="text-pink-600" />
            </Link>
            <span className="text-lg font-bold">
              {pathname.split("/").pop()}
            </span>
            <div className="w-10" />
          </div>
        </div>
      )}
    </>
  );
}
