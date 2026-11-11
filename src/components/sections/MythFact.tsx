import { useState } from 'react';
import { MYTHS } from '@/data/bloodlink';
import { HeartPulse, RotateCcw, XOctagon } from 'lucide-react';

function Flashcard({
  index,
  myth,
  fact,
  flipped,
  onFlip,
}: {
  index: number;
  myth: string;
  fact: string;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <button
      onClick={onFlip}
      aria-pressed={flipped}
      className="perspective-1000 block w-full text-left h-56 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`Myth vs fact card: ${myth}. Tap to flip.`}
    >
      <div
        className={`relative h-full w-full preserve-3d transition-transform duration-500 ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Myth side */}
        <div className="backface-hidden absolute inset-0 rounded-2xl bg-white border border-slate-200 shadow-sm card-hover p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="chip bg-slate-100 text-slate-600">
              <XOctagon className="h-3.5 w-3.5 text-crimson-600" />
              Myth
            </span>
            <span className="text-[11px] font-bold text-slate-300 font-display">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="mt-4 text-slate-800 font-semibold leading-snug">
            "{myth}"
          </p>
          <span className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-crimson-700">
            <RotateCcw className="h-3.5 w-3.5" />
            Tap to reveal the fact
          </span>
        </div>

        {/* Fact side */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-2xl bg-slate-900 shadow-xl p-5 flex flex-col">
          <span className="chip bg-emerald-500/15 text-emerald-300 w-fit">
            <HeartPulse className="h-3.5 w-3.5" />
            Fact
          </span>
          <p className="mt-4 text-slate-200 text-sm leading-relaxed">{fact}</p>
        </div>
      </div>
    </button>
  );
}

export default function MythFact() {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section id="awareness" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="chip bg-crimson-100 text-crimson-800 mb-3">
            <HeartPulse className="h-3.5 w-3.5" />
            Awareness
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Myth vs. Fact
          </h2>
          <p className="mt-3 text-slate-600">
            The misconceptions that keep thousands of willing donors away each
            year. Flip a card to see what healthcare science actually says.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MYTHS.map((m, i) => (
            <Flashcard
              key={m.id}
              index={i}
              myth={m.myth}
              fact={m.fact}
              flipped={flipped.has(m.id)}
              onFlip={() => toggle(m.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
