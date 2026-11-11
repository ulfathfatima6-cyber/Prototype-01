import { useCallback, useEffect, useState } from 'react';
import { TESTIMONIALS } from '@/data/bloodlink';
import { ChevronLeft, ChevronRight, Quote, MapPin } from 'lucide-react';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [go, paused]);

  const t = TESTIMONIALS[index];

  return (
    <section id="impact" className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[400px] w-[400px] rounded-full bg-crimson-800/30 blur-[120px]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="chip glass-dark text-emerald-300 mb-6">
          <Quote className="h-3.5 w-3.5" />
          Community impact
        </span>

        <div
          className="min-h-[220px] md:min-h-[190px] flex flex-col items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <blockquote
            key={t.id}
            className="animate-fade-up font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-snug text-balance max-w-3xl"
          >
            "{t.quote}"
          </blockquote>
          <div key={`${t.id}-meta`} className="animate-fade-in mt-6">
            <p className="font-bold text-crimson-300">{t.name}</p>
            <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5 mt-1">
              {t.role}
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 ml-1">
                <MapPin className="h-3 w-3" />
                {t.city}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous story"
            className="p-2.5 rounded-full glass-dark text-white hover:bg-white/15 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to story ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-7 bg-crimson-500'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next story"
            className="p-2.5 rounded-full glass-dark text-white hover:bg-white/15 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
