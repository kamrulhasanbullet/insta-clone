"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Spinner } from "@/components/shared/Spinner";

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  className?: string;
}

export function InfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  children,
  className = "",
}: InfiniteScrollProps) {
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore, loading);

  return (
    <div className={className}>
      {children}

      {/* Loading indicator */}
      {loading && (
        <div className="py-8 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4" />

      {/* End message */}
      {!hasMore && !loading && (
        <div className="py-12 text-center text-sm text-gray-500">
          You're all caught up! 🎉
        </div>
      )}
    </div>
  );
}
