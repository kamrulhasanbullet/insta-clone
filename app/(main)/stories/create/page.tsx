"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";

export default function CreateStoryPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ← 5MB limit
    if (file.size > 8 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setUploading(true);

    try {
      // Upload image
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: preview,
          folder: "instagram_clone/stories",
        }),
      });
      const { url, publicId } = await uploadRes.json();

      // Create story
      await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          imagePublicId: publicId,
          caption,
        }),
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl font-semibold">Create Story</h1>
          <button
            onClick={() => router.back()}
            className="text-white p-2 rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image picker */}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative w-full aspect-9/16 bg-gray-900 rounded-2xl overflow-hidden cursor-pointer mb-4 flex items-center justify-center"
        >
          {preview ? (
            <Image
              src={preview}
              alt="Story preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center text-gray-400">
              <ImagePlus size={48} className="mx-auto mb-2" />
              <p className="text-sm">Tap to select photo</p>
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

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Caption */}
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          maxLength={200}
          className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!preview || uploading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sharing...
            </>
          ) : (
            "Share Story"
          )}
        </button>
      </div>
    </div>
  );
}
