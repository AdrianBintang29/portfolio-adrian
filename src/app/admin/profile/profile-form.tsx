'use client';

import { useActionState } from 'react';
import { ImageField } from '@/components/admin/ImageField';
import { TextField } from '@/components/admin/TextField';
import { updateProfile, type ProfileFields, type ProfileState } from './profile-action';

const initialState: ProfileState = {};

export function ProfileForm({
  defaults,
  avatarUrl,
}: {
  defaults: ProfileFields;
  avatarUrl: string | null;
}) {
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
        name="heroHeadline"
        label="Judul besar di bagian atas"
        defaultValue={current.heroHeadline}
        maxLength={120}
        required
        hint="Kalimat besar di Hero. Singkat lebih baik, maksimal 120 karakter."
      />

      <TextField
        name="bio"
        label="Bio singkat"
        defaultValue={current.bio}
        maxLength={400}
        required
        multiline
        hint="Kalimat di bawah judul besar."
      />

      <TextField
        name="aboutTitle"
        label="Judul bagian About"
        defaultValue={current.aboutTitle}
        maxLength={80}
        required
      />

      <TextField
        name="aboutBody"
        label="Isi bagian About"
        defaultValue={current.aboutBody}
        maxLength={2000}
        required
        multiline
        rows={10}
        hint="Pisahkan paragraf dengan satu baris kosong. Maksimal 2000 karakter."
      />

      <TextField
        name="projectsTitle"
        label="Judul bagian Projects"
        defaultValue={current.projectsTitle}
        maxLength={120}
        required
        hint="Kalimat besar di sebelah kiri daftar project. Maksimal 120 karakter."
      />

      <TextField
        name="projectsDescription"
        label="Deskripsi bagian Projects"
        defaultValue={current.projectsDescription}
        maxLength={300}
        required
        multiline
        hint="Paragraf di bawah judul Projects. Maksimal 300 karakter."
      />

      <TextField
        name="experienceDescription"
        label="Deskripsi bagian Experience"
        defaultValue={current.experienceDescription}
        maxLength={300}
        required
        multiline
        hint="Paragraf di bawah judul Experience. Maksimal 300 karakter. Isi tiap pengalaman diedit di Kelola pengalaman."
      />

      <TextField
        name="contactDescription"
        label="Deskripsi bagian Contact"
        defaultValue={current.contactDescription}
        maxLength={300}
        required
        multiline
        hint="Paragraf di bawah 'Let's talk about your project'. Maksimal 300 karakter."
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

      {/* Kolom unggah foto profil */}
      <ImageField label="Foto profil" currentUrl={avatarUrl} alt="Foto profil saat ini" />

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
