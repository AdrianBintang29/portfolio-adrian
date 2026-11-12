'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/admin/TextField';
import type { ExperienceFields, ExperienceState } from './experience-actions';

const initialState: ExperienceState = {};

type ExperienceFormProps = {
  action: (state: ExperienceState, formData: FormData) => Promise<ExperienceState>;
  defaults: ExperienceFields;
  submitLabel: string;
};

export function ExperienceForm({ action, defaults, submitLabel }: ExperienceFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const current = state.values ?? defaults;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <TextField
        name="company"
        label="Perusahaan"
        defaultValue={current.company}
        maxLength={80}
        required
      />

      <TextField
        name="role"
        label="Jabatan"
        defaultValue={current.role}
        maxLength={120}
        required
        hint="Contoh: Web Developer & Infrastructure Intern"
      />

      <TextField
        name="type"
        label="Tipe"
        defaultValue={current.type}
        maxLength={40}
        required
        hint="Label kecil di samping nama perusahaan. Contoh: Internship, Full-time, Freelance"
      />

      <TextField
        name="period"
        label="Periode"
        defaultValue={current.period}
        maxLength={60}
        required
        hint="Contoh: 2026 - Sekarang"
      />

      <TextField
        name="location"
        label="Lokasi"
        defaultValue={current.location}
        maxLength={80}
        required
      />

      <TextField
        name="summary"
        label="Ringkasan"
        defaultValue={current.summary}
        maxLength={600}
        required
        multiline
      />

      <TextField
        name="points"
        label="Poin tugas"
        defaultValue={current.points}
        maxLength={2000}
        multiline
        rows={6}
        hint="Satu baris satu poin. Maksimal 10 poin, 300 karakter per poin. Boleh dikosongkan."
      />

      <TextField
        name="stack"
        label="Teknologi"
        defaultValue={current.stack}
        maxLength={300}
        hint="Pisahkan dengan koma. Contoh: Next.js, Docker, PostgreSQL"
      />

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
