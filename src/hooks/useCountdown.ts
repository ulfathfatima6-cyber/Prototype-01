import { useEffect, useState } from 'react';

export function useCountdown(startMinutes: number) {
  const [minutes, setMinutes] = useState(startMinutes);

  useEffect(() => setMinutes(startMinutes), [startMinutes]);

  useEffect(() => {
    const t = setInterval(
      () => setMinutes((m) => (m > 0 ? m - 1 : 0)),
      60_000
    );
    return () => clearInterval(t);
  }, []);

  return minutes;
}
