'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/admin/TextField';
import { updateProfile, type ProfileFields, type ProfileState } from './profile-action';

const initialState: ProfileState = {};

export function ProfileForm({ defaults }: { defaults: ProfileFields }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const current = state.values ?? defaults;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <TextField
        name="name"
        label="Nama pendek"
        defaultValue={current.name}
        maxLength={80}
        required
        hint="Tampil sebagai nama besar di footer."
      />

      <TextField
        name="fullName"
        label="Nama lengkap"
        defaultValue={current.fullName}
        maxLength={120}
        required
        hint="Tampil di kiri atas navigasi."
      />

      <TextField
        name="role"
        label="Role"
        defaultValue={current.role}
        maxLength={80}
        required
        hint="Tulisan kecil di atas judul besar."
      />

      <TextField
        name="bio"
        label="Bio singkat"
        defaultValue={current.bio}
        maxLength={400}
        required
        multiline
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        defaultValue={current.email}
        maxLength={120}
        required
      />

      <TextField
        name="githubUrl"
        label="Tautan GitHub"
        type="url"
        defaultValue={current.githubUrl}
        maxLength={200}
        hint="Boleh dikosongkan. Harus diawali https://"
      />

      {state.error && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {state.error}
        </p>
      )}

      {state.saved && (
        <p role="status" className="text-sm font-bold text-navy">
          Tersimpan. Halaman publik sudah memakai data terbaru.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-yellow px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-60"
      >
        {pending ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}