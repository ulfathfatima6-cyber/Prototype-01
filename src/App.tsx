import { useEffect, useState } from 'react';
import Hero from '@/components/sections/Hero';
import UrgentFeed from '@/components/sections/UrgentFeed';
import CompatibilityMatrix from '@/components/sections/CompatibilityMatrix';
import InventoryDirectory from '@/components/sections/InventoryDirectory';
import EligibilityCheck from '@/components/sections/EligibilityCheck';
import MythFact from '@/components/sections/MythFact';
import Testimonials from '@/components/sections/Testimonials';
import ToastStack from '@/components/ui/ToastStack';
import DonorRegisterModal from '@/components/modals/DonorRegisterModal';
import EmergencyRequestModal from '@/components/modals/EmergencyRequestModal';
import RespondModal from '@/components/modals/RespondModal';
import { useToasts } from '@/hooks/useToasts';
import type { UrgentRequest } from '@/data/bloodlink';
import {
  Droplet,
  Droplets,
  Menu,
  Siren,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '#requests', label: 'Requests' },
  { href: '#compatibility', label: 'Compatibility' },
  { href: '#inventory', label: 'Blood Banks' },
  { href: '#eligibility', label: 'Eligibility' },
  { href: '#awareness', label: 'Awareness' },
];

export default function App() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [respondTarget, setRespondTarget] = useState<UrgentRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { toasts, push, dismiss, startLiveFeed } = useToasts();

  useEffect(() => startLiveFeed(), [startLiveFeed]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setDrawerOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 inset-x-0 z-[60] transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-2.5"
            aria-label="BloodLink home"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                scrolled ? 'bg-crimson-700' : 'glass-dark'
              }`}
            >
              <Droplets className="h-5 w-5 text-crimson-500 fill-current" />
            </span>
            <span
              className={`font-display font-bold text-lg tracking-tight transition-colors ${
                scrolled ? 'text-slate-900' : 'text-white'
              }`}
            >
              Blood<span className="text-crimson-500">Link</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`px-3.5 min-h-[38px] rounded-lg text-sm font-semibold transition-colors ${
                  scrolled
                    ? 'text-slate-600 hover:text-crimson-700 hover:bg-crimson-50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmergencyOpen(true)}
              className="btn-touch hidden sm:inline-flex bg-crimson-700 text-white hover:bg-crimson-600 !min-h-[40px] !px-4"
            >
              <Siren className="h-4 w-4" />
              Request Blood
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                scrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-72 max-w-[82vw] bg-white shadow-2xl animate-slide-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="font-display font-bold text-slate-900">
                Blood<span className="text-crimson-600">Link</span>
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-3 gap-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="text-left px-4 min-h-[48px] rounded-xl text-sm font-semibold text-slate-700 hover:bg-crimson-50 hover:text-crimson-800 transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto p-4 space-y-2.5 border-t border-slate-100">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setRegisterOpen(true);
                }}
                className="btn-touch w-full border border-slate-200 text-slate-800"
              >
                <Droplet className="h-4 w-4 text-crimson-600" />
                Register as Donor
              </button>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setEmergencyOpen(true);
                }}
                className="btn-touch w-full bg-crimson-700 text-white hover:bg-crimson-800"
              >
                <Siren className="h-4 w-4" />
                Request Blood
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
        <Hero
          onFindBlood={() => scrollTo('#requests')}
          onRegister={() => setRegisterOpen(true)}
        />
        <UrgentFeed onRespond={setRespondTarget} />
        <CompatibilityMatrix />
        <InventoryDirectory />
        <EligibilityCheck />
        <MythFact />
        <Testimonials />

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-crimson-800">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '26px 26px',
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <Droplet className="h-10 w-10 text-crimson-300 fill-current mx-auto mb-5" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
              Someone in your city is running out of time.
            </h2>
            <p className="mt-3 text-crimson-100 max-w-xl mx-auto">
              Registration takes two minutes. One donation later, you could be
              the reason a family gets good news.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setRegisterOpen(true)}
                className="btn-touch bg-white text-crimson-800 hover:bg-crimson-50 !min-h-[52px] !px-8 shadow-xl"
              >
                <Droplet className="h-5 w-5" />
                Register as Donor
              </button>
              <button
                onClick={() => setEmergencyOpen(true)}
                className="btn-touch glass-dark text-white hover:bg-white/15 !min-h-[52px] !px-8"
              >
                <Siren className="h-5 w-5" />
                Request Blood
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl glass-dark">
                <Droplets className="h-5 w-5 text-crimson-500 fill-current" />
              </span>
              <div>
                <p className="font-display font-bold text-white">
                  Blood<span className="text-crimson-500">Link</span>
                </p>
                <p className="text-xs text-slate-500">
                  Every drop connects a life.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Prototype for demonstration. BloodLink is a concept healthcare
              network connecting donors, hospitals and licensed blood banks.
              Medical decisions always rest with treating physicians.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating emergency button (mobile) */}
      <button
        onClick={() => setEmergencyOpen(true)}
        aria-label="Request emergency blood"
        className="sm:hidden fixed bottom-5 left-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-crimson-700 text-white shadow-2xl shadow-crimson-900/40 animate-pulse-alert"
      >
        <Siren className="h-6 w-6" />
      </button>

      {/* Modals & toasts */}
      <DonorRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccess={(name) => {
          setRegisterOpen(false);
          push({
            title: `Welcome to the network, ${name}!`,
            detail: 'You will now receive verified emergency matches for your blood group.',
            tone: 'success',
          });
        }}
      />
      <EmergencyRequestModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        onSuccess={(hospital) => {
          setEmergencyOpen(false);
          push({
            title: 'Emergency alert broadcast',
            detail: `Verified donors near ${hospital} are being notified now.`,
            tone: 'alert',
          });
        }}
      />
      <RespondModal
        request={respondTarget}
        onClose={() => setRespondTarget(null)}
        onSuccess={(req) => {
          setRespondTarget(null);
          push({
            title: 'Response sent to the blood bank',
            detail: `${req.hospital} will call you to confirm your donation slot.`,
            tone: 'success',
          });
        }}
      />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
