import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { BLOOD_GROUPS, CITIES, type BloodGroup } from '@/data/bloodlink';
import { AlertTriangle, Siren, Send } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (hospital: string) => void;
}

const URGENCY_LEVELS = [
  {
    id: 'critical',
    label: 'Critical',
    desc: 'Life-threatening, needed within the hour',
  },
  {
    id: 'high',
    label: 'High priority',
    desc: 'Needed within 24 hours',
  },
  {
    id: 'normal',
    label: 'Normal',
    desc: 'Scheduled transfusion or surgery',
  },
] as const;

export default function EmergencyRequestModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    hospital: '',
    city: 'Bengaluru',
    bloodGroup: '' as BloodGroup | '',
    units: 2,
    urgency: 'critical' as (typeof URGENCY_LEVELS)[number]['id'],
    contact: '',
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const valid =
    form.hospital.trim().length > 2 &&
    form.bloodGroup !== '' &&
    /^[0-9+\-\s]{8,15}$/.test(form.contact.trim());

  const inputCls =
    'w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-500/60 focus:border-crimson-400 transition';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Emergency Blood"
      subtitle="Alerts verified donors near the hospital instantly"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Hospital / Blood bank name
          </label>
          <input
            className={inputCls}
            placeholder="e.g. St. Martha's Multispeciality"
            value={form.hospital}
            onChange={(e) => set('hospital', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              City
            </label>
            <select
              className={inputCls}
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Ward contact number
            </label>
            <input
              className={inputCls}
              inputMode="tel"
              placeholder="+91 80 2200 1122"
              value={form.contact}
              onChange={(e) => set('contact', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Blood group required
          </label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => set('bloodGroup', g)}
                className={`min-h-[48px] rounded-xl font-display font-bold text-base border transition-all duration-200 ${
                  form.bloodGroup === g
                    ? 'bg-crimson-700 text-white border-crimson-700 shadow-lg shadow-crimson-700/25 scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-crimson-300 hover:text-crimson-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Units required: <span className="text-crimson-700 font-bold">{form.units}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.units}
            onChange={(e) => set('units', Number(e.target.value))}
            className="w-full accent-crimson-700"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>1 unit</span>
            <span>10 units</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Urgency level
          </label>
          <div className="space-y-2">
            {URGENCY_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => set('urgency', lvl.id)}
                className={`w-full flex items-center gap-3 text-left p-3 rounded-xl border transition-all duration-200 ${
                  form.urgency === lvl.id
                    ? 'border-crimson-400 bg-crimson-50 ring-1 ring-crimson-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    form.urgency === lvl.id
                      ? 'bg-crimson-700 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {lvl.id === 'critical' ? (
                    <Siren className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    {lvl.label}
                  </span>
                  <span className="block text-xs text-slate-500">{lvl.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={() => {
          onSuccess(form.hospital.trim());
          setForm({
            hospital: '',
            city: 'Bengaluru',
            bloodGroup: '',
            units: 2,
            urgency: 'critical',
            contact: '',
          });
        }}
        className="btn-touch w-full mt-6 bg-crimson-700 text-white hover:bg-crimson-800 animate-pulse-alert disabled:animate-none disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
        Broadcast emergency alert
      </button>
    </Modal>
  );
}
