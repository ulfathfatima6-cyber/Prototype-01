import { useMemo, useState } from 'react';
import {
  BLOOD_GROUPS,
  FACILITIES,
  STOCK_META,
  type BloodGroup,
} from '@/data/bloodlink';
import {
  BadgeCheck,
  Building2,
  Droplet,
  MapPin,
  Phone,
  Search,
} from 'lucide-react';

const FILTERS = ['All', 'In Stock', 'Low Stock', 'Critical'] as const;

function stockFilterMatch(
  stock: Record<BloodGroup, 'in-stock' | 'low' | 'critical'>,
  filter: (typeof FILTERS)[number]
) {
  if (filter === 'All') return true;
  if (filter === 'In Stock') return Object.values(stock).includes('in-stock');
  if (filter === 'Low Stock') return Object.values(stock).includes('low');
  return Object.values(stock).includes('critical');
}

export default function InventoryDirectory() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FACILITIES.filter(
      (f) =>
        (q === '' ||
          f.name.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q)) &&
        stockFilterMatch(f.stock, filter)
    );
  }, [query, filter]);

  return (
    <section id="inventory" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="chip bg-emerald-100 text-emerald-800 mb-3">
            <Droplet className="h-3.5 w-3.5" />
            Live inventory
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Blood Bank Inventory Directory
          </h2>
          <p className="mt-3 text-slate-600">
            Real-time stock levels across authorized hospitals and blood banks on
            the network. Search by name or city, or jump straight to facilities
            with shortages.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hospital, blood bank or city…"
              aria-label="Search facilities"
              className="w-full min-h-[48px] pl-11 pr-4 rounded-xl border border-slate-200 bg-neutral-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-500/60 focus:border-crimson-400 focus:bg-white transition"
            />
          </div>
          <div className="flex gap-1.5 p-1.5 rounded-xl bg-neutral-100 border border-slate-200 overflow-x-auto scrollbar-thin">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`px-4 min-h-[38px] rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  filter === f
                    ? 'bg-white text-crimson-700 shadow-sm border border-crimson-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((f) => (
            <article key={f.id} className="glass rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-crimson-50 text-crimson-700">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug flex items-center gap-1.5">
                      {f.name}
                      {f.verified && (
                        <BadgeCheck
                          className="h-4 w-4 text-emerald-600 shrink-0"
                          aria-label="Verified facility"
                        />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {f.city} · {f.type}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {BLOOD_GROUPS.map((g) => {
                  const level = STOCK_META[f.stock[g]];
                  return (
                    <div
                      key={g}
                      title={`${g}: ${level.label}`}
                      className={`rounded-lg border px-1 py-1.5 text-center ${level.cell}`}
                    >
                      <div className="text-[11px] font-bold font-display">{g}</div>
                      <div className="text-[9px] font-semibold uppercase tracking-wide leading-tight mt-0.5">
                        {f.stock[g] === 'in-stock'
                          ? 'Full'
                          : f.stock[g] === 'low'
                            ? 'Low'
                            : 'Crit'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href={`tel:${f.phone.replace(/\s/g, '')}`}
                className="btn-touch w-full mt-4 border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                {f.phone}
              </a>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Droplet className="h-8 w-8 mx-auto text-slate-300 mb-3" />
            No facilities match your search. Try a different city or filter.
          </div>
        )}
      </div>
    </section>
  );
}
