"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Edit3 } from "lucide-react";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { Spinner } from "@/components/shared/Spinner";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Edit3 size={24} />
            Edit profile
          </h1>
          <p className="text-gray-600">Make changes to your profile here</p>
        </div>
        <EditProfileForm />
      </div>
    </div>
  );
}
