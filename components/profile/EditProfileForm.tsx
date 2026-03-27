"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { cn } from "@/utils/cn";

export function EditProfileForm() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    website: "",
    isPrivate: false,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (session?.user) {
      setFormData({
        fullName: session.user.name || "",
        bio: "",
        website: "",
        isPrivate: false,
      });
    }
  }, [session]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (
      formData.website &&
      !formData.website.startsWith("http") &&
      formData.website.trim()
    ) {
      newErrors.website = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      let avatarData = {};

      if (preview) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: preview,
            folder: "instagram_clone/avatars",
          }),
        });
        const { url, publicId } = await uploadRes.json();
        avatarData = { avatarUrl: url, avatarPublicId: publicId };
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...avatarData }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        await update({ user: updatedUser });
        router.push(`/profile/${session?.user?.username}`);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-2xl">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
              <Image
                src={preview || session.user.image || "/default-avatar.png"}
                alt="Profile picture"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <ImageIcon className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <p className="text-sm text-gray-500 text-center max-w-md">
          Change profile photo
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            maxLength={150}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.bio.length}/150
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>
          {errors.website && (
            <p className="mt-1 text-sm text-red-600">{errors.website}</p>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <input
            id="private"
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) =>
              setFormData({ ...formData, isPrivate: e.target.checked })
            }
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="private"
            className="text-sm font-medium text-gray-900 cursor-pointer select-none"
          >
            Private Account
          </label>
        </div>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={saving}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
}
