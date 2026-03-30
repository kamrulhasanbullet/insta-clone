import { Skeleton } from "@/components/shared/Skeleton";

export function ProfileSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="px-4 pt-20 pb-6 md:py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            {/* Avatar */}
            <div className="mx-auto shrink-0 md:mx-0">
              <Skeleton className="w-36 h-36 rounded-full" />
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Username */}
              <div className="flex justify-center md:justify-start mb-4">
                <Skeleton className="h-6 w-40 rounded" />
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 md:gap-8 mb-4">
                {[60, 72, 68].map((w, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center md:items-start gap-1"
                  >
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton style={{ width: w }} className="h-3 rounded" />
                  </div>
                ))}
              </div>

              {/* Bio lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 mx-auto md:mx-0 rounded" />
                <Skeleton className="h-4 w-56 mx-auto md:mx-0 rounded" />
                <Skeleton className="h-4 w-44 mx-auto md:mx-0 rounded" />

                {/* Edit button */}
                <div className="pt-3">
                  <Skeleton className="h-8 w-full md:w-28 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 mx-4" />

      {/* Grid Skeleton */}
      <div className="pt-4 px-4 pb-20 md:pb-4">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-sm" />
          ))}
        </div>
      </div>
    </>
  );
}
