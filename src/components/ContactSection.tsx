import { Check, Copy, Mail } from 'lucide-react';
import type { ContentData } from '@/lib/content';

interface ContactSectionProps {
  text: ContentData;
  email: string;
  copied: boolean;
  onCopyEmail: () => void;
}

export function ContactSection({ text, email, copied, onCopyEmail }: ContactSectionProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-b from-white to-slate-100 dark:from-[#111827] dark:to-[#0b0f19] border border-slate-200 dark:border-[#1f293d] p-8 sm:p-12 text-center space-y-6 shadow-sm">
      <div className="max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{text.ctaTitle}</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#94a3b8]">{text.ctaSub}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button onClick={onCopyEmail} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-[#2FA69A] dark:hover:bg-[#268d83] text-white font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer">
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? text.copied : `${text.copyEmail} (${email})`}</span>
        </button>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] border border-slate-300 dark:border-[#1f293d] text-slate-800 dark:text-white font-medium text-sm transition-all shadow-xs">
          <Mail className="w-4 h-4 text-teal-600 dark:text-[#2FA69A]" />
          <span>Direct Email</span>
        </a>
      </div>
    </section>
  );
}
