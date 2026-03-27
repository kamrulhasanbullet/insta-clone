"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/utils/cn";
import { debounce } from "lodash";

interface SearchBarProps {
  query?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  query = "",
  onQueryChange,
  placeholder = "Search",
  className,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.users || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (query !== undefined) {
      setSearchQuery(query);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onQueryChange?.(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    setResults([]);
    onQueryChange?.("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {showResults && (loading || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}

          {results.map((user) => (
            <Link
              key={user._id}
              href={`/profile/${user.username}`}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              onClick={() => setShowResults(false)}
            >
              <Avatar src={user.avatarUrl} alt={user.username} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.fullName}
                </p>
              </div>
            </Link>
          ))}

          {searchQuery && !loading && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
