"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-300 rounded-lg p-10 mb-4">
          <div className="flex justify-center mb-8">
            <FaInstagram size={48} className="text-gray-800" />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="mx-4 text-xs font-semibold text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <p className="text-center text-xs text-gray-500">
            Forgot password?{" "}
            <Link href="#" className="text-blue-900 font-semibold">
              Get help signing in.
            </Link>
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
