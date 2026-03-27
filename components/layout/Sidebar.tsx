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
} from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/utils/cn";
import { FaInstagram } from "react-icons/fa";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/post/create", label: "Create", icon: PlusSquare },
  { href: "/notifications", label: "Notifications", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
            <Icon size={24} strokeWidth={pathname === href ? 2.5 : 1.5} />
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

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 text-red-500"
      >
        <LogOut size={24} strokeWidth={1.5} />
        <span className="hidden xl:block">Log out</span>
      </button>
    </aside>
  );
}
