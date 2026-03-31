"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Plus,  } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { useSession } from "next-auth/react";
import { cn } from "@/utils/cn";
import { BsInstagram } from "react-icons/bs";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 p-2 -m-2 rounded-lg hover:bg-gray-100"
        >
          <BsInstagram size={28} className="text-gradient-pink-purple" />
          <span className="text-xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Instagram
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/explore"
            className={cn(
              "p-2 rounded-full hover:bg-gray-100 transition-colors",
              pathname === "/explore" && "bg-gray-100",
            )}
          >
            <Search size={24} />
          </Link>

          <Link
            href="/post/create"
            className="p-2 rounded-full bg-linear-to-r from-pink-500 to-orange-500 hover:shadow-lg transition-all"
          >
            <Plus size={24} className="text-white" />
          </Link>

          <Link
            href="/notifications"
            className={cn(
              "p-2 rounded-full hover:bg-gray-100 transition-colors relative",
              pathname === "/notifications" && "bg-gray-100",
            )}
          >
            <Heart size={24} />
            {/* Unread badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Link>

          {session && (
            <Link href={`/profile/${session.user.username}`}>
              <Avatar
                src={session.user.image || ""}
                alt={session.user.username || ""}
                size="sm"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
