import Image from "next/image";
import { cn } from "@/utils/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 140,
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const px = sizeMap[size];
  const hasImage = src && src.startsWith("http");

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center",
        className,
      )}
      style={{ width: px, height: px }}
    >
      {hasImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${px}px`}
        />
      ) : (
        <User size={px * 0.5} className="text-gray-400" />
      )}
    </div>
  );
}
