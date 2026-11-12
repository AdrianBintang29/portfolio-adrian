'use client';

import { useTransition } from 'react';
import {
  deleteExperience,
  moveExperience,
  toggleExperiencePublished,
} from './experience-actions';

const buttonClass =
  'border border-navy/40 px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-40';

type RowActionsProps = {
  id: string;
  title: string;
  published: boolean;
  isFirst: boolean;
  isLast: boolean;
};

export function ExperienceRowActions({ id, title, published, isFirst, isLast }: RowActionsProps) {
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        data-action="move-up"
        data-id={id}
        disabled={pending || isFirst}
        onClick={() => run(() => moveExperience(id, 'up'))}
        aria-label={`Naikkan ${title}`}
        className={buttonClass}
      >
        Naik
      </button>

      <button
        type="button"
        data-action="move-down"
        data-id={id}
        disabled={pending || isLast}
        onClick={() => run(() => moveExperience(id, 'down'))}
        aria-label={`Turunkan ${title}`}
        className={buttonClass}
      >
        Turun
      </button>

      <button
        type="button"
        data-action="toggle-published"
        data-id={id}
        disabled={pending}
        onClick={() => run(() => toggleExperiencePublished(id))}
        className={buttonClass}
      >
        {published ? 'Sembunyikan' : 'Tampilkan'}
      </button>

      <button
        type="button"
        data-action="delete"
        data-id={id}
        disabled={pending}
        onClick={() => {
          if (window.confirm(`Hapus pengalaman "${title}"? Tindakan ini tidak bisa dibatalkan.`)) {
            run(() => deleteExperience(id));
          }
        }}
        className="border border-red-700 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-40"
      >
        Hapus
      </button>
    </div>
  );
}
