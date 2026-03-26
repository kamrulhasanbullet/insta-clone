import Image from "next/image";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const px = sizeMap[size];
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200 shrink-0",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={src || "/default-avatar.png"}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${px}px`}
      />
    </div>
  );
}
