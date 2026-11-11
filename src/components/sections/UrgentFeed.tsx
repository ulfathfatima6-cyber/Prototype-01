import { useMemo, useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import {
  formatCountdown,
  URGENCY_META,
  URGENT_REQUESTS,
  type UrgentRequest,
} from '@/data/bloodlink';
import {
  Building2,
  Clock,
  Droplet,
  MapPin,
  Siren,
} from 'lucide-react';

type Tab = 'all' | 'critical' | 'high' | 'normal';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High Priority' },
  { id: 'normal', label: 'Normal' },
];

function RequestCard({
  request,
  onRespond,
}: {
  request: UrgentRequest;
  onRespond: (r: UrgentRequest) => void;
}) {
  const minutes = useCountdown(request.minutesLeft);
  const meta = URGENCY_META[request.urgency];
  const urgent = request.urgency === 'critical' && minutes > 0;

  return (
    <article
      className={`group glass rounded-2xl p-5 card-hover relative overflow-hidden ${meta.ring}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          request.urgency === 'critical'
            ? 'bg-crimson-600'
            : request.urgency === 'high'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display font-bold text-lg text-white ${
              request.urgency === 'critical'
                ? 'bg-crimson-700'
                : request.urgency === 'high'
                  ? 'bg-amber-500'
                  : 'bg-slate-700'
            }`}
          >
            {request.bloodGroup}
          </span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {request.patient}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {request.hospital}
            </p>
          </div>
        </div>
        <span className={`chip ${meta.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${urgent ? 'animate-pulse' : ''}`} />
          {meta.label}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        {request.note}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-crimson-500" />
          {request.city}
        </span>
        <span className="flex items-center gap-1.5">
          <Droplet className="h-3.5 w-3.5 text-crimson-500" />
          {request.units} unit{request.units > 1 ? 's' : ''} needed
        </span>
        <span
          className={`flex items-center gap-1.5 tabular-nums ${
            minutes < 60 && minutes > 0
              ? 'text-crimson-700 font-bold'
              : minutes === 0
                ? 'text-slate-400'
                : ''
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          {formatCountdown(minutes)}
        </span>
      </div>

      <button
        onClick={() => onRespond(request)}
        disabled={minutes === 0}
        className={`btn-touch w-full mt-4 ${
          urgent
            ? 'bg-crimson-700 text-white hover:bg-crimson-800'
            : 'bg-slate-900 text-white hover:bg-slate-700'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {minutes === 0 ? 'Request window closed' : 'Respond to Request'}
        {urgent && <Siren className="h-4 w-4" />}
      </button>
    </article>
  );
}

export default function UrgentFeed({
  onRespond,
}: {
  onRespond: (r: UrgentRequest) => void;
}) {
  const [tab, setTab] = useState<Tab>('all');

  const visible = useMemo(
    () =>
      tab === 'all'
        ? URGENT_REQUESTS
        : URGENT_REQUESTS.filter((r) => r.urgency === tab),
    [tab]
  );

  const counts = useMemo(() => {
    const c: Record<Tab, number> = {
      all: URGENT_REQUESTS.length,
      critical: 0,
      high: 0,
      normal: 0,
    };
    for (const r of URGENT_REQUESTS) c[r.urgency] += 1;
    return c;
  }, []);

  return (
    <section id="requests" className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="chip bg-crimson-100 text-crimson-800 mb-3">
              <Siren className="h-3.5 w-3.5" />
              Live feed
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Urgent Blood Requests
            </h2>
            <p className="mt-2 text-slate-600 max-w-xl">
              Open requests streaming in from networked hospitals. Respond
              directly — the blood bank coordinator calls you back within
              minutes.
            </p>
          </div>
          <div
            className="flex gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto scrollbar-thin"
            role="tablist"
            aria-label="Filter requests by urgency"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 min-h-[40px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-crimson-700 text-white shadow-md shadow-crimson-700/25'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
                <span
                  className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 ${
                    tab === t.id ? 'bg-white/20' : 'bg-slate-100'
                  }`}
                >
                  {counts[t.id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <RequestCard key={r.id} request={r} onRespond={onRespond} />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Droplet className="h-8 w-8 mx-auto text-slate-300 mb-3" />
            No requests in this category right now — that's good news.
          </div>
        )}
      </div>
    </section>
  );
}
