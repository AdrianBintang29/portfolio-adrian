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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const router = useRouter();

  function loadProjects() {
    fetch("http://localhost:8080/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadProjects();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/admin/login");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8080/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, link }),
    });

    setTitle("");
    setDescription("");
    setLink("");
    loadProjects();
  }

  async function handleDelete(id: number) {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8080/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadProjects();
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-neutral-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Dashboard Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleAdd}
          className="mb-8 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow space-y-3"
        >
          <h2 className="font-semibold text-gray-800 dark:text-white">Tambah Project Baru</h2>
          <input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-800 placeholder:text-gray-400 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:placeholder:text-gray-500"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-800 placeholder:text-gray-400 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:placeholder:text-gray-500"
            required
          />
          <input
            type="text"
            placeholder="Link (boleh kosong)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-800 placeholder:text-gray-400 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-sm font-medium"
          >
            Tambah
          </button>
        </form>

        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Daftar Project</h2>
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}