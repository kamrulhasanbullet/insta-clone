"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Instagram } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // Auto sign in
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-300 rounded-lg p-10 mb-4">
          <div className="flex justify-center mb-4">
            <Instagram size={48} className="text-gray-800" />
          </div>
          <p className="text-center text-gray-500 font-semibold mb-6">
            Sign up to see photos and videos from your friends.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { name: "email", placeholder: "Email", type: "email" },
              { name: "fullName", placeholder: "Full Name", type: "text" },
              { name: "username", placeholder: "Username", type: "text" },
              { name: "password", placeholder: "Password", type: "password" },
            ].map(({ name, placeholder, type }) => (
              <input
                key={name}
                name={name}
                type={type}
                value={(form as any)[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-gray-400"
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up, you agree to our Terms, Privacy Policy and Cookies
            Policy.
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center text-sm">
          Have an account?{" "}
          <Link href="/login" className="text-blue-500 font-semibold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
