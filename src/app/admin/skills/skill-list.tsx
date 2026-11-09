'use client';

import { useActionState, useState, useTransition } from 'react';
import {
  createSkill,
  deleteSkill,
  moveSkill,
  updateSkill,
  type SkillState,
} from './skill-actions';

const inputClass =
  'mt-1 w-full border border-navy/30 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none';
const buttonClass =
  'border border-navy/40 px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-40';

export type SkillRow = { id: string; name: string; category: string };

const initialState: SkillState = {};

function AddSkillForm({ categories }: { categories: string[] }) {
  const [state, formAction, pending] = useActionState(createSkill, initialState);

  return (
    <form action={formAction} className="border border-navy/15 bg-white p-5">
      <h2 className="text-lg font-bold text-navy">Tambah skill</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-navy">
            Nama
          </label>
          <input id="name" name="name" type="text" maxLength={60} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-bold text-navy">
            Kategori
          </label>
          <input
            id="category"
            name="category"
            type="text"
            list="skill-categories"
            maxLength={60}
            required
            className={inputClass}
          />
          <datalist id="skill-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="mt-4 text-sm font-bold text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 bg-yellow px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-60"
      >
        {pending ? 'Menyimpan...' : 'Tambah skill'}
      </button>
    </form>
  );
}

function EditForm({ skill, onDone }: { skill: SkillRow; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(
    async (previous: SkillState, formData: FormData) => {
      const result = await updateSkill(skill.id, previous, formData);
      if (!result.error) onDone();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="mt-3 grid gap-3 sm:grid-cols-2">
      <input
        id={`edit-name-${skill.id}`}
        name="name"
        defaultValue={skill.name}
        maxLength={60}
        aria-label={`Nama untuk ${skill.name}`}
        className={inputClass}
      />
      <input
        id={`edit-category-${skill.id}`}
        name="category"
        defaultValue={skill.category}
        maxLength={60}
        aria-label={`Kategori untuk ${skill.name}`}
        className={inputClass}
      />

      {state.error && (
        <p role="alert" className="text-sm font-bold text-red-700 sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" data-action="save" data-id={skill.id} disabled={pending} className={buttonClass}>
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button type="button" onClick={onDone} className={buttonClass}>
          Batal
        </button>
      </div>
    </form>
  );
}

function SkillItem({ skill, isFirst, isLast }: { skill: SkillRow; isFirst: boolean; isLast: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <li className="border border-navy/15 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-navy">{skill.name}</p>
          <p className="text-xs text-gray-blue">{skill.category}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-action="move-up"
            data-id={skill.id}
            disabled={pending || isFirst}
            onClick={() => run(() => moveSkill(skill.id, 'up'))}
            aria-label={`Naikkan ${skill.name}`}
            className={buttonClass}
          >
            Naik
          </button>
          <button
            type="button"
            data-action="move-down"
            data-id={skill.id}
            disabled={pending || isLast}
            onClick={() => run(() => moveSkill(skill.id, 'down'))}
            aria-label={`Turunkan ${skill.name}`}
            className={buttonClass}
          >
            Turun
          </button>
          <button
            type="button"
            data-action="edit"
            data-id={skill.id}
            onClick={() => setEditing((value) => !value)}
            className={buttonClass}
          >
            Edit
          </button>
          <button
            type="button"
            data-action="delete"
            data-id={skill.id}
            disabled={pending}
            onClick={() => {
              if (window.confirm(`Hapus skill "${skill.name}"?`)) {
                run(() => deleteSkill(skill.id));
              }
            }}
            className="border border-red-700 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-40"
          >
            Hapus
          </button>
        </div>
      </div>

      {editing && <EditForm skill={skill} onDone={() => setEditing(false)} />}
    </li>
  );
}

export function SkillList({ skills }: { skills: SkillRow[] }) {
  const categories = Array.from(new Set(skills.map((skill) => skill.category)));

  return (
    <div className="mt-8 space-y-8">
      <AddSkillForm categories={categories} />

      {skills.length === 0 ? (
        <p className="text-sm text-gray-blue">Belum ada skill. Tambahkan yang pertama.</p>
      ) : (
        <ul className="space-y-3">
          {skills.map((skill, index) => (
            <SkillItem key={skill.id} skill={skill} isFirst={index === 0} isLast={index === skills.length - 1} />
          ))}
        </ul>
      )}
    </div>
  );
}
