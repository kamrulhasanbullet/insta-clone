import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse bg-gray-200 rounded", className)} />;
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 max-w-lg w-full">
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-3 w-28 rounded" />
      </div>
      <Skeleton className="aspect-square w-full" />
      <div className="px-4 pt-3 pb-4 space-y-2">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
    </div>
  );
}
