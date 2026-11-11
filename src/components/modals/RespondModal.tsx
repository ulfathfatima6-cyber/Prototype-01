import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import type { UrgentRequest } from '@/data/bloodlink';
import { formatCountdown, URGENCY_META } from '@/data/bloodlink';
import { Clock, Droplet, MapPin, PhoneCall, Send } from 'lucide-react';

interface Props {
  request: UrgentRequest | null;
  onClose: () => void;
  onSuccess: (req: UrgentRequest) => void;
}

export default function RespondModal({ request, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const valid =
    request !== null &&
    name.trim().length > 1 &&
    /^[0-9+\-\s]{8,15}$/.test(phone.trim());

  const inputCls =
    'w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-500/60 focus:border-crimson-400 transition';

  if (!request) return null;

  const meta = URGENCY_META[request.urgency];

  return (
    <Modal
      open={request !== null}
      onClose={onClose}
      title="Respond to Request"
      subtitle={`Blood group ${request.bloodGroup} — ${request.hospital}, ${request.city}`}
    >
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`chip ${meta.badge}`}>{meta.label}</span>
        <span className="chip bg-slate-100 text-slate-600">
          <Droplet className="h-3 w-3" />
          {request.units} unit{request.units > 1 ? 's' : ''} · {request.bloodGroup}
        </span>
        <span className="chip bg-slate-100 text-slate-600">
          <Clock className="h-3 w-3" />
          {formatCountdown(request.minutesLeft)}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-5">{request.note}</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Your name
          </label>
          <input
            className={inputCls}
            placeholder="e.g. Rohit Menon"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-px text-emerald-600" />
            The hospital blood bank coordinator will call to confirm eligibility
            and slot. Carry an ID on the day of donation.
          </p>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={() => {
          onSuccess(request);
          setName('');
          setPhone('');
        }}
        className="btn-touch w-full mt-6 bg-crimson-700 text-white hover:bg-crimson-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <PhoneCall className="h-4 w-4" />
        Confirm — I can donate
      </button>
    </Modal>
  );
}
