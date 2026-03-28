import { Skeleton } from "@/components/shared/Skeleton";

export function ProfileSkeleton() {
  return (
    <>
      {/* === ProfileHeader Skeleton === */}
      <div className="py-8 px-4 max-w-3xl mx-auto">
        <div className="flex items-start gap-10 mb-8">
          {/* Avatar - matches ProfileHeader exact size */}
          <Skeleton className="w-20 h-20 md:w-36 md:h-36 rounded-full" />

          {/* Profile info section */}
          <div className="flex-1 space-y-6">
            {/* Username + Edit button row */}
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>

            {/* Stats row - EXACTLY 3 items */}
            <div className="flex gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <Skeleton className="h-8 w-16 mx-auto rounded-full" />
                  <Skeleton className="h-4 w-20 mx-auto rounded" />
                </div>
              ))}
            </div>

            {/* Bio + website */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-4 w-72 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* === EXACT SAME HR === */}
      <hr className="border-gray-300 mx-4 bg-gray-200 h-px" />

      {/* === ProfileGrid Skeleton === */}
      <div className="pt-8 px-4">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-sm" />
          ))}
        </div>
      </div>
    </>
  );
}
