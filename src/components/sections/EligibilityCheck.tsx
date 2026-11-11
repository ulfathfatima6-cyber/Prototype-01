import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Droplet,
  Plane,
  RefreshCcw,
  Scale,
  XCircle,
} from 'lucide-react';

interface Answers {
  age: number;
  weight: number;
  lastDonation: string;
  medical: boolean;
  travel: boolean;
}

const STEPS = ['Age', 'Weight', 'Last donation', 'Health & travel'] as const;

type Verdict = {
  ok: boolean;
  title: string;
  detail: string;
  nextDate?: string;
};

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function evaluate(a: Answers, today: Date): Verdict {
  if (a.age < 18 || a.age > 65)
    return {
      ok: false,
      title: 'Not eligible right now',
      detail:
        'Donors must be between 18 and 65. Keep the network in mind — eligibility rules differ per country and you can donate again once you fall inside the range.',
    };
  if (a.weight <= 50)
    return {
      ok: false,
      title: 'Almost there',
      detail:
        'Donors must weigh over 50 kg for a full blood donation. Platelet or plasma donation sometimes has different thresholds — ask your local blood bank.',
    };

  let daysSince = -1;
  if (a.lastDonation) {
    daysSince = daysBetween(new Date(a.lastDonation), today);
    if (daysSince >= 0 && daysSince < 90) {
      const next = new Date(a.lastDonation);
      next.setDate(next.getDate() + 90);
      return {
        ok: false,
        title: 'Rest period in progress',
        detail: `You donated ${daysSince} days ago. Whole blood donations need a 90-day gap so your red cells fully replenish.`,
        nextDate: next.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    }
  }

  if (a.medical)
    return {
      ok: false,
      title: 'Temporary deferral',
      detail:
        'Recent illness, surgery, infection or new medication usually means a 6-month deferral. A doctor at the camp can clear you sooner — bring your prescription.',
    };

  if (a.travel)
    return {
      ok: false,
      title: 'Travel deferral',
      detail:
        'Travel to malaria or dengue endemic zones requires a 3–12 month wait depending on the region. Your blood bank can confirm the exact window.',
    };

  return {
    ok: true,
    title: "Yes — you can donate today!",
    detail: `You meet every screening criterion${
      daysSince >= 0 ? ` — last donation was ${daysSince} days ago` : ''
    }. Eat an iron-rich meal, hydrate well, and carry a photo ID.`,
  };
}

export default function EligibilityCheck() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    age: 25,
    weight: 65,
    lastDonation: '',
    medical: false,
    travel: false,
  });

  const verdict = useMemo(
    () => (done ? evaluate(answers, new Date()) : null),
    [done, answers]
  );

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const restart = () => {
    setAnswers({ age: 25, weight: 65, lastDonation: '', medical: false, travel: false });
    setStep(0);
    setDone(false);
  };

  const inputCls =
    'w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-500/60 focus:border-crimson-400 transition';

  return (
    <section id="eligibility" className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="chip bg-crimson-100 text-crimson-800 mb-3">
              <ClipboardCheck className="h-3.5 w-3.5" />
              60-second check
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              "Can I Donate Today?"
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed max-w-lg">
              Four quick questions based on standard donor-screening criteria.
              Get an instant verdict with tailored advice — before you travel to
              a camp.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                'Based on national blood transfusion guidelines',
                'Nothing is stored or shared — the check runs on your device',
                'Final say always rests with the screening doctor',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <BadgeCheck className="h-[18px] w-[18px] text-emerald-600 shrink-0 mt-0.5" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8 shadow-xl shadow-crimson-900/10">
            {!done ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-1.5 mb-6">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        i <= step ? 'bg-crimson-700' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {step === 0 && (
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-slate-800 text-sm mb-3">
                      <CalendarClock className="h-4 w-4 text-crimson-700" />
                      What is your age?
                    </label>
                    <input
                      type="range"
                      min={16}
                      max={70}
                      value={answers.age}
                      onChange={(e) => set('age', Number(e.target.value))}
                      className="w-full accent-crimson-700"
                      aria-label="Age"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>16</span>
                      <span className="font-display text-2xl font-bold text-crimson-700">
                        {answers.age} yrs
                      </span>
                      <span>70</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Eligible range: 18 – 65 years.
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-slate-800 text-sm mb-3">
                      <Scale className="h-4 w-4 text-crimson-700" />
                      What is your weight?
                    </label>
                    <input
                      type="range"
                      min={40}
                      max={120}
                      value={answers.weight}
                      onChange={(e) => set('weight', Number(e.target.value))}
                      className="w-full accent-crimson-700"
                      aria-label="Weight in kilograms"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>40 kg</span>
                      <span className="font-display text-2xl font-bold text-crimson-700">
                        {answers.weight} kg
                      </span>
                      <span>120 kg</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Minimum 50 kg for whole blood donation.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-slate-800 text-sm mb-3">
                      <RefreshCcw className="h-4 w-4 text-crimson-700" />
                      When did you last donate?{' '}
                      <span className="font-normal text-slate-400">(if ever)</span>
                    </label>
                    <input
                      type="date"
                      max={new Date().toISOString().slice(0, 10)}
                      className={inputCls}
                      value={answers.lastDonation}
                      onChange={(e) => set('lastDonation', e.target.value)}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      First-timers are always welcome — leave this blank.
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-800 text-sm">
                      Any of these in the last 6 months?
                    </p>
                    {(
                      [
                        {
                          key: 'medical' as const,
                          label: 'Illness, surgery, infection or new medication',
                        },
                        {
                          key: 'travel' as const,
                          label: 'Travel to a malaria / dengue endemic region',
                        },
                      ]
                    ).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => set(key, !answers[key])}
                        aria-pressed={answers[key]}
                        className={`w-full flex items-center justify-between gap-3 text-left p-3.5 rounded-xl border text-sm transition-all duration-200 ${
                          answers[key]
                            ? 'border-crimson-300 bg-crimson-50 text-crimson-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {label}
                        <span
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            answers[key] ? 'bg-crimson-700' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              answers[key] ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between gap-3 mt-7">
                  <button
                    onClick={() => (step === 0 ? restart() : setStep((s) => s - 1))}
                    className="btn-touch text-slate-600 hover:bg-slate-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {step === 0 ? 'Start over' : 'Back'}
                  </button>
                  <button
                    onClick={() =>
                      step === STEPS.length - 1 ? setDone(true) : setStep((s) => s + 1)
                    }
                    className="btn-touch bg-crimson-700 text-white hover:bg-crimson-800"
                  >
                    {step === STEPS.length - 1 ? 'Check eligibility' : 'Next'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              verdict && (
                <div
                  className={`animate-fade-up rounded-2xl p-6 text-center ${
                    verdict.ok
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-crimson-50 border border-crimson-200'
                  }`}
                >
                  <span
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                      verdict.ok ? 'bg-emerald-600' : 'bg-crimson-700'
                    } shadow-lg`}
                  >
                    {verdict.ok ? (
                      <Droplet className="h-8 w-8 text-white fill-current" />
                    ) : (
                      <XCircle className="h-8 w-8 text-white" />
                    )}
                  </span>
                  <h3
                    className={`mt-4 font-display text-xl font-bold ${
                      verdict.ok ? 'text-emerald-800' : 'text-crimson-900'
                    }`}
                  >
                    {verdict.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                    {verdict.detail}
                  </p>
                  {verdict.nextDate && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                      <CalendarClock className="h-4 w-4 text-crimson-700" />
                      Next eligible: {verdict.nextDate}
                    </div>
                  )}
                  <div className="mt-6">
                    <button
                      onClick={restart}
                      className="btn-touch border border-slate-300 text-slate-700 hover:bg-white"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Check again
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
