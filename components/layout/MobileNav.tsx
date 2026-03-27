"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, PlusSquare, Heart, User, Instagram } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/utils/cn";

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Home",
    match: (path: string) => path === "/",
  },
  {
    href: "/explore",
    icon: Search,
    label: "Explore",
    match: (path: string) => path === "/explore",
  },
  {
    href: "/post/create",
    icon: PlusSquare,
    label: "Create",
    match: (path: string) => path === "/post/create",
  },
  {
    href: "/notifications",
    icon: Heart,
    label: "Activity",
    match: (path: string) => path === "/notifications",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
    match: (path: string) => path.startsWith("/profile"),
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden z-50 shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(({ href, icon: Icon, label, match }) => {
            const isActive = match(pathname);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all group",
                  isActive
                    ? "text-gradient-pink-purple scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:scale-105",
                )}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 3 : 2}
                  className={cn(
                    "transition-all group-hover:scale-110",
                    isActive && "drop-shadow-sm",
                  )}
                />
                <span className="text-xs font-medium leading-tight">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile top bar for profile/username */}
      {pathname.startsWith("/profile") && (
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 md:hidden z-40 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Instagram size={24} className="text-pink-600" />
            </Link>
            <Link
              href={`/profile/${session?.user?.username}`}
              className="text-lg font-bold text-center flex-1 truncate px-4"
            >
              {pathname.split("/").pop()}
            </Link>
            <div className="w-10" />
          </div>
        </div>
      )}
    </>
  );
}
