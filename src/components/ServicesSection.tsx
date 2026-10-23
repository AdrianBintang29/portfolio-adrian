import { Activity, Layers, Server, ShieldCheck, Zap } from 'lucide-react';
import type { ContentData } from '@/lib/content';

interface ServicesSectionProps {
  text: ContentData;
}

export function ServicesSection({ text }: ServicesSectionProps) {
  return (
    <section id="services" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-600 dark:text-[#2FA69A]" />
          {text.servicesTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-[#94a3b8] mt-1">{text.servicesSub}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {text.servicesList.map((service, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-teal-500/50 dark:hover:border-[#2FA69A]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-[#2FA69A]/10 text-teal-700 dark:text-[#2dd4bf] flex items-center justify-center mb-4 border border-teal-100 dark:border-teal-500/20">
                {index === 0 && <Layers className="w-4 h-4" />}
                {index === 1 && <Server className="w-4 h-4" />}
                {index === 2 && <ShieldCheck className="w-4 h-4" />}
                {index === 3 && <Activity className="w-4 h-4" />}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{service.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94a3b8] leading-relaxed mb-4">{service.desc}</p>
            </div>
            <ul className="space-y-2 border-t border-slate-100 dark:border-[#1f293d] pt-3 text-xs text-slate-600 dark:text-[#94a3b8]">
              {service.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-[#2FA69A] font-bold mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
