import { useState } from 'react';
import {
  BLOOD_GROUPS,
  CAN_DONATE_TO,
  CAN_RECEIVE_FROM,
  type BloodGroup,
} from '@/data/bloodlink';
import { Droplet, Info } from 'lucide-react';

export default function CompatibilityMatrix() {
  const [selected, setSelected] = useState<BloodGroup>('O-');

  const donatesTo = new Set(CAN_DONATE_TO[selected]);
  const receivesFrom = new Set(CAN_RECEIVE_FROM[selected]);

  const isUniversalDonor = selected === 'O-';
  const isUniversalRecipient = selected === 'AB+';

  const cellState = (g: BloodGroup) => {
    const both = donatesTo.has(g) && receivesFrom.has(g);
    const donate = donatesTo.has(g);
    const receive = receivesFrom.has(g);
    if (g === selected)
      return 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.06]';
    if (both) return 'bg-crimson-700 text-white border-crimson-700';
    if (donate) return 'bg-crimson-100 text-crimson-800 border-crimson-300';
    if (receive) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    return 'bg-white text-slate-300 border-slate-200';
  };

  return (
    <section id="compatibility" className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-crimson-800/30 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="chip glass-dark text-crimson-200 mb-3">
            <Droplet className="h-3.5 w-3.5" />
            Know your type
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
            Blood Group Compatibility Matrix
          </h2>
          <p className="mt-3 text-slate-300">
            Tap any blood group to see who it can save and who can save it.
            <span className="text-crimson-300 font-semibold"> Red</span> = can
            donate to,{' '}
            <span className="text-emerald-300 font-semibold">green</span> = can
            receive from.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Matrix grid */}
          <div className="glass-dark rounded-3xl p-5 sm:p-8">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelected(g)}
                  aria-pressed={selected === g}
                  className={`aspect-square rounded-2xl border-2 font-display font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson-400 ${cellState(g)}`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-crimson-300 mb-1">
                  {selected} can donate to
                </p>
                <p className="font-display text-xl font-bold text-white">
                  {CAN_DONATE_TO[selected].join(' · ')}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300 mb-1">
                  {selected} can receive from
                </p>
                <p className="font-display text-xl font-bold text-white">
                  {CAN_RECEIVE_FROM[selected].join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Legend / universals */}
          <div className="space-y-4">
            <div
              className={`rounded-3xl p-5 border transition-all duration-300 ${
                isUniversalDonor
                  ? 'bg-crimson-700 border-crimson-500 shadow-xl shadow-crimson-900/40'
                  : 'glass-dark border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <Droplet className={`h-5 w-5 ${isUniversalDonor ? 'text-white fill-current' : 'text-crimson-400'}`} />
                <p className="font-bold text-white">Universal Donor</p>
              </div>
              <p className={`text-sm ${isUniversalDonor ? 'text-crimson-100' : 'text-slate-400'}`}>
                O- red cells can be given to anyone in an emergency. You selected{' '}
                {selected} —{' '}
                {isUniversalDonor
                  ? 'you are one. Every donation matters double.'
                  : `${CAN_DONATE_TO[selected].length} of 8 groups can receive your blood.`}
              </p>
            </div>
            <div
              className={`rounded-3xl p-5 border transition-all duration-300 ${
                isUniversalRecipient
                  ? 'bg-emerald-600 border-emerald-400 shadow-xl shadow-emerald-900/40'
                  : 'glass-dark border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <Droplet className={`h-5 w-5 ${isUniversalRecipient ? 'text-white fill-current' : 'text-emerald-400'}`} />
                <p className="font-bold text-white">Universal Recipient</p>
              </div>
              <p className={`text-sm ${isUniversalRecipient ? 'text-emerald-50' : 'text-slate-400'}`}>
                AB+ patients can receive red cells from all 8 groups. You
                selected {selected} —{' '}
                {isUniversalRecipient
                  ? 'you can receive from everyone.'
                  : `you can receive from ${CAN_RECEIVE_FROM[selected].length} of 8 groups.`}
              </p>
            </div>
            <div className="rounded-3xl p-5 glass-dark border border-white/10 flex gap-3">
              <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                In actual transfusions, plasma and platelet compatibility follow
                reversed rules. Always confirm with a transfusion specialist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
