'use client';

import { useActionState } from 'react';
import { ImageField } from '@/components/admin/ImageField';
import { TextField } from '@/components/admin/TextField';
import type { ProjectFields, ProjectState } from './project-actions';

const initialState: ProjectState = {};

type ProjectFormProps = {
  action: (state: ProjectState, formData: FormData) => Promise<ProjectState>;
  defaults: ProjectFields;
  imageUrl: string | null;
  submitLabel: string;
};

export function ProjectForm({ action, defaults, imageUrl, submitLabel }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const current = state.values ?? defaults;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <TextField
        name="title"
        label="Judul"
        defaultValue={current.title}
        maxLength={120}
        required
      />

      <TextField
        name="slug"
        label="Slug"
        defaultValue={current.slug}
        maxLength={80}
        required
        hint="Nama pendek untuk alamat. Huruf kecil, angka, dan tanda hubung. Contoh: project-saya"
      />

      <TextField
        name="summary"
        label="Ringkasan"
        defaultValue={current.summary}
        maxLength={400}
        required
        multiline
      />

      <TextField
        name="stack"
        label="Teknologi"
        defaultValue={current.stack}
        maxLength={200}
        hint="Pisahkan dengan koma. Contoh: Next.js, Docker, PostgreSQL"
      />

      <TextField
        name="liveUrl"
        label="Tautan demo"
        type="url"
        defaultValue={current.liveUrl}
        maxLength={200}
        hint="Boleh dikosongkan. Harus diawali https://"
      />

      <TextField
        name="repoUrl"
        label="Tautan repository"
        type="url"
        defaultValue={current.repoUrl}
        maxLength={200}
        hint="Boleh dikosongkan. Harus diawali https://"
      />

      <ImageField label="Gambar project" currentUrl={imageUrl} alt="Gambar project saat ini" />

      {state.error && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-yellow px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-60"
      >
        {pending ? 'Menyimpan...' : submitLabel}
      </button>
    </form>
  );
}
