'use client';

import { useTransition } from 'react';
import {
  deleteProject,
  moveProject,
  toggleFeatured,
  togglePublished,
} from './project-actions';

const buttonClass =
  'border border-navy/40 px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-40';

type RowActionsProps = {
  id: string;
  title: string;
  published: boolean;
  featured: boolean;
  isFirst: boolean;
  isLast: boolean;
};

export function ProjectRowActions({ id, title, published, featured, isFirst, isLast }: RowActionsProps) {
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
        onClick={() => run(() => moveProject(id, 'up'))}
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
        onClick={() => run(() => moveProject(id, 'down'))}
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
        onClick={() => run(() => togglePublished(id))}
        className={buttonClass}
      >
        {published ? 'Sembunyikan' : 'Tampilkan'}
      </button>

      <button
        type="button"
        data-action="toggle-featured"
        data-id={id}
        disabled={pending}
        onClick={() => run(() => toggleFeatured(id))}
        className={buttonClass}
      >
        {featured ? 'Lepas unggulan' : 'Jadikan unggulan'}
      </button>

      <button
        type="button"
        data-action="delete"
        data-id={id}
        disabled={pending}
        onClick={() => {
          if (window.confirm(`Hapus project "${title}"? Tindakan ini tidak bisa dibatalkan.`)) {
            run(() => deleteProject(id));
          }
        }}
        className="border border-red-700 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-40"
      >
        Hapus
      </button>
    </div>
  );
}
