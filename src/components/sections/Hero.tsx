import { useState } from 'react';
import {
  BLOOD_GROUPS,
  CITIES,
  type BloodGroup,
} from '@/data/bloodlink';
import {
  Activity,
  ChevronDown,
  Droplet,
  MapPin,
  Search,
  ShieldCheck,
  Siren,
} from 'lucide-react';

interface Props {
  onFindBlood: () => void;
  onRegister: () => void;
}

interface Metrics {
  lives: number;
  donors: number;
  banks: number;
  minutes: number;
}

const METRICS: Metrics = { lives: 128450, donors: 48217, banks: 1362, minutes: 12 };

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const started = { current: false };
  if (!started.current && typeof window !== 'undefined') {
    started.current = true;
    requestAnimationFrame(() => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  return value;
}

function MetricCell({
  value,
  label,
  suffix,
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <span className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
        {value.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="text-xs font-medium text-crimson-100/70 tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Hero({ onFindBlood, onRegister }: Props) {
  const [group, setGroup] = useState<BloodGroup | ''>('');
  const [city, setCity] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [searched, setSearched] = useState(false);

  const lives = useCountUp(METRICS.lives);
  const donors = useCountUp(METRICS.donors, 2200);
  const banks = useCountUp(METRICS.banks, 2400);

  const doSearch = () => {
    setSearched(true);
    onFindBlood();
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-slate-950"
    >
      {/* Ambient crimson glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-crimson-800/40 blur-[120px]" />
      <div className="pointer-events-none absolute top-24 right-0 h-[420px] w-[420px] rounded-full bg-crimson-600/25 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Falling droplets */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {[
          { left: '12%', delay: '0s', size: 'h-3 w-3' },
          { left: '28%', delay: '1.8s', size: 'h-2 w-2' },
          { left: '55%', delay: '3.2s', size: 'h-2.5 w-2.5' },
          { left: '78%', delay: '0.9s', size: 'h-3 w-3' },
          { left: '90%', delay: '2.4s', size: 'h-2 w-2' },
        ].map((d, i) => (
          <span
            key={i}
            className={`absolute top-10 ${d.size} animate-drop-fall text-crimson-500/50`}
            style={{ left: d.left, animationDelay: d.delay }}
          >
            <Droplet className="h-full w-full fill-current" />
          </span>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="max-w-3xl">
          <span className="chip glass-dark text-crimson-200 mb-6 !px-3 !py-1.5 !text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Live network · 9 cities · 24×7
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight text-balance">
            Every Drop{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 via-crimson-500 to-crimson-300">
              Connects a Life.
            </span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
            BloodLink wires hospitals, blood banks and verified donors into one
            real-time network — so when a critical request goes out, a matching
            donor is found in minutes, not days.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onFindBlood}
              className="btn-touch bg-crimson-700 text-white hover:bg-crimson-600 animate-pulse-alert text-base !min-h-[52px] !px-7"
            >
              <Siren className="h-5 w-5" />
              Find Urgent Blood
            </button>
            <button
              onClick={onRegister}
              className="btn-touch glass-dark text-white hover:bg-white/15 text-base !min-h-[52px] !px-7"
            >
              <Droplet className="h-5 w-5 text-crimson-400" />
              Register as Donor
            </button>
          </div>
        </div>

        {/* Instant search bar */}
        <div className="mt-12 max-w-4xl">
          <div className="glass-dark rounded-2xl md:rounded-full p-3 md:flex md:items-center md:gap-2 md:pl-5 md:pr-2 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2.5 flex-1 py-1 md:py-0 border-b border-white/10 md:border-0">
              <Droplet className="h-4 w-4 text-crimson-400 shrink-0" />
              <select
                aria-label="Blood group"
                value={group}
                onChange={(e) => setGroup(e.target.value as BloodGroup | '')}
                className="w-full md:w-auto bg-transparent text-sm text-white focus:outline-none cursor-pointer py-3 md:py-0"
              >
                <option value="" className="text-slate-900">
                  Any blood group
                </option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g} className="text-slate-900">
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-slate-400 ml-auto md:hidden" />
            </div>

            <span className="hidden md:block h-6 w-px bg-white/15" />

            <div className="flex items-center gap-2.5 flex-1 py-1 md:py-0 border-b border-white/10 md:border-0">
              <MapPin className="h-4 w-4 text-crimson-400 shrink-0" />
              <input
                list="bl-cities"
                aria-label="City or pincode"
                placeholder="City or 6-digit pincode"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none py-3 md:py-0"
              />
              <datalist id="bl-cities">
                {CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <span className="hidden md:block h-6 w-px bg-white/15" />

            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              aria-pressed={verifiedOnly}
              className={`flex items-center gap-2 rounded-xl md:rounded-full px-3 py-2.5 text-xs font-semibold transition-all duration-200 w-full md:w-auto ${
                verifiedOnly
                  ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck
                className={`h-4 w-4 transition-colors ${
                  verifiedOnly ? 'text-emerald-400' : ''
                }`}
              />
              Verified donors only
              <span
                className={`ml-auto md:ml-1 relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                  verifiedOnly ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                    verifiedOnly ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`}
                />
              </span>
            </button>

            <button
              onClick={doSearch}
              className="btn-touch w-full md:w-auto mt-3 md:mt-0 bg-crimson-700 text-white hover:bg-crimson-600 !rounded-xl md:!rounded-full"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
          {searched && (
            <p className="mt-3 text-sm text-emerald-300 animate-fade-in flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {verifiedOnly ? '14' : '27'} matching{' '}
              {group ? `${group} ` : ''}donors near{' '}
              <span className="font-semibold">{city || 'you'}</span> — open the
              live requests feed below.
            </p>
          )}
        </div>

        {/* Metrics bar */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 border-t border-white/10 pt-8">
          <MetricCell value={lives} label="Lives saved" suffix="+" />
          <MetricCell value={donors} label="Active donors" />
          <MetricCell value={banks} label="Networked blood banks" />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-display text-2xl md:text-3xl font-bold text-emerald-400 tabular-nums">
              &lt; {METRICS.minutes} mins
            </span>
            <span className="text-xs font-medium text-crimson-100/70 tracking-wide uppercase">
              Avg response time
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
