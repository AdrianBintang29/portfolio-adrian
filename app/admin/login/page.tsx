"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-neutral-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Login</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-medium transition-colors"
        >
          Login
        </button>
      </form>
    </main>
  );
}