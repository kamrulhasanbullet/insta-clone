"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";

export function CreatePostForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;
    setUploading(true);

    try {
      // Upload to Cloudinary
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      });
      const { url, publicId } = await uploadRes.json();

      // Create post
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          imagePublicId: publicId,
          caption,
          location,
        }),
      });

      if (!postRes.ok) throw new Error("Failed to create post");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">Create new post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image picker */}
        <div
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center transition-colors ${
            preview
              ? "border-transparent"
              : "border-gray-300 hover:border-gray-400 h-80"
          }`}
        >
          {preview ? (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <ImagePlus size={48} className="mx-auto mb-3" />
              <p className="font-medium">Click to select image</p>
              <p className="text-sm">JPG, PNG, WEBP</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Caption */}
        <div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            maxLength={2200}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-400 text-right">
            {caption.length}/2200
          </p>
        </div>

        {/* Location */}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Add location"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          type="submit"
          disabled={!preview || uploading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sharing...
            </>
          ) : (
            "Share"
          )}
        </button>
      </form>
    </div>
  );
}
