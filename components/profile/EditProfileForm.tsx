"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link as LinkIcon, CheckCircle, Loader2, User } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";

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
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!session?.user?.username) return;

    fetch(`/api/users/${session.user.username}`)
      .then((res) => res.json())
      .then((data) => {
        const user = data.user;
        setFormData({
          fullName: user.fullName || "",
          bio: user.bio || "",
          website: user.website || "",
          isPrivate: user.isPrivate || false,
        });
        setCurrentAvatar(user.avatarUrl || "/default-avatar.png");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.user?.username]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (
      formData.website &&
      formData.website.trim() &&
      !formData.website.startsWith("http")
    ) {
      newErrors.website = "Please enter a valid URL starting with http";
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
    setErrors({});

    try {
      let avatarData = {};

      if (preview && preview.startsWith("data:")) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: preview,
            folder: "instagram_clone/avatars",
          }),
        });
        if (!uploadRes.ok) throw new Error("Failed to upload image");
        const { url, publicId } = await uploadRes.json();
        avatarData = { avatarUrl: url, avatarPublicId: publicId };
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...avatarData }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Failed to update profile" });
        return;
      }

      await update({ image: data.user.avatarUrl });
      router.push(`/profile/${session?.user?.username}`);
      router.refresh();
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
    >
      {/* Avatar */}
      {/* <div className="flex items-center gap-6">
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0"
        >
          <Image
            src={preview || currentAvatar}
            alt="Profile"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Change</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm">{session?.user?.username}</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm text-blue-500 font-semibold hover:text-blue-600 mt-1"
          >
            Change profile photo
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div> */}
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center"
        >
          {preview || currentAvatar ? (
            <Image
              src={preview || currentAvatar}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <User size={32} className="text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Change</span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm">{session?.user?.username}</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm text-blue-500 font-semibold hover:text-blue-600 mt-1"
          >
            Change profile photo
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold mb-2">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-semibold mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          maxLength={150}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {formData.bio.length}/150
        </p>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-semibold mb-2">Website</label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://yourwebsite.com"
          />
        </div>
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      {/* Private Account */}
      <div className="flex items-center justify-between py-3 border-t border-b border-gray-200">
        <div>
          <p className="text-sm font-semibold">Private Account</p>
          <p className="text-xs text-gray-500">
            Only followers can see your posts
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setFormData((p) => ({ ...p, isPrivate: !p.isPrivate }))
          }
          className={`w-12 h-6 rounded-full transition-colors ${
            formData.isPrivate ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
              formData.isPrivate ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}
