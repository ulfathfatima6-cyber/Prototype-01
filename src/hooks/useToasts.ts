import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_EVENTS } from '@/data/bloodlink';

export interface Toast {
  id: number;
  title: string;
  detail: string;
  tone: 'info' | 'success' | 'alert';
}

let nextId = 1;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = nextId++;
      setToasts((t) => [...t.slice(-3), { ...toast, id }]);
      timers.current.push(
        setTimeout(() => dismiss(id), 6000)
      );
    },
    [dismiss]
  );

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const startLiveFeed = useCallback(() => {
    let i = Math.floor(Math.random() * LIVE_EVENTS.length);
    const tick = () => {
      const ev = LIVE_EVENTS[i % LIVE_EVENTS.length];
      i += 1 + Math.floor(Math.random() * 3);
      push({
        title: `${ev.group} donor matched in ${ev.city}`,
        detail: `Responded ${1 + Math.floor(Math.random() * 4)} mins ago — units being verified.`,
        tone: 'success',
      });
    };
    tick();
    const interval = setInterval(tick, 12000);
    return () => clearInterval(interval);
  }, [push]);

  return { toasts, push, dismiss, startLiveFeed };
}
