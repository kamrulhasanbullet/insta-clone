"use client";

import { Heart, Home, PlusSquare, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "../shared/Avatar";
import { BsInstagram } from "react-icons/bs";
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
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
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

      {/* Mobile top bar */}
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
