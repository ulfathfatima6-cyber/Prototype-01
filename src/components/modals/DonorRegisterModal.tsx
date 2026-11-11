import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import {
  BLOOD_GROUPS,
  CITIES,
  type BloodGroup,
} from '@/data/bloodlink';
import { Check, ChevronLeft, ChevronRight, Heart, ShieldCheck } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
}

const STEPS = ['Personal details', 'Blood type', 'Health & consent'];

export default function DonorRegisterModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: 'Bengaluru',
    bloodGroup: '' as BloodGroup | '',
    lastDonation: '',
    consent: false,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext =
    step === 0
      ? form.name.trim().length > 1 && /^[0-9+\-\s]{8,15}$/.test(form.phone.trim())
      : step === 1
        ? form.bloodGroup !== ''
        : form.consent;

  const submit = () => {
    onSuccess(form.name.trim().split(' ')[0]);
    setStep(0);
    setForm({
      name: '',
      phone: '',
      city: 'Bengaluru',
      bloodGroup: '',
      lastDonation: '',
      consent: false,
    });
  };

  const inputCls =
    'w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-500/60 focus:border-crimson-400 transition';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register as Donor"
      subtitle="Join 48,000+ verified lifesavers on the network"
    >
      <ol className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                i <= step ? 'text-crimson-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  i < step
                    ? 'bg-emerald-500 text-white'
                    : i === step
                      ? 'bg-crimson-700 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden md:inline">{label}</span>
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`h-px flex-1 ${
                  i < step ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Full name
            </label>
            <input
              className={inputCls}
              placeholder="e.g. Ananya Rao"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Mobile number
            </label>
            <input
              className={inputCls}
              inputMode="tel"
              placeholder="+91 98450 00000"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
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
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <p className="text-sm text-slate-600 mb-3">
            Select your blood group. Not sure? Choose "Not sure" and we'll verify
            it free at your first donation.
          </p>
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
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Last donation date <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              className={inputCls}
              value={form.lastDonation}
              onChange={(e) => set('lastDonation', e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800">
              Your number is only shared with the hospital when you accept an
              emergency match. It is never listed publicly or used for marketing.
            </p>
          </div>
          <label className="flex gap-3 items-start cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set('consent', e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-crimson-700 focus:ring-crimson-500"
            />
            <span className="text-sm text-slate-700">
              I consent to receive emergency match alerts for my blood group in{' '}
              <span className="font-semibold">{form.city}</span>, and confirm the
              details provided are accurate.
            </span>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-7">
        <button
          onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
          className="btn-touch text-slate-600 hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="btn-touch bg-crimson-700 text-white hover:bg-crimson-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            disabled={!canNext}
            onClick={submit}
            className="btn-touch bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Heart className="h-4 w-4" />
            Join the network
          </button>
        )}
      </div>
    </Modal>
  );
}
