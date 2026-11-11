import type { Toast } from '@/hooks/useToasts';
import { BellRing, CheckCircle2, Siren, X } from 'lucide-react';

const TONE = {
  success: {
    icon: CheckCircle2,
    iconCls: 'text-emerald-500 bg-emerald-50',
  },
  alert: {
    icon: Siren,
    iconCls: 'text-crimson-700 bg-crimson-50',
  },
  info: {
    icon: BellRing,
    iconCls: 'text-slate-600 bg-slate-100',
  },
} as const;

export default function ToastStack({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
    >
      {toasts.map((t) => {
        const tone = TONE[t.tone];
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-900/10 p-3.5 animate-slide-in"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.iconCls}`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {t.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{t.detail}</p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
