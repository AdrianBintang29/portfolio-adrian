"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: number;
  title: string;
  description: string;
  link: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch("http://localhost:8080/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-neutral-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Daftar Project</h2>
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white">{project.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}