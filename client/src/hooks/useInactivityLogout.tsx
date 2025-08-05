import { useEffect, useRef } from 'react';

export default function useInactivityLogout(onLogout: () => void, enabled = true) {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const timeout = 3 * 60 * 1000;

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(onLogout, timeout);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [enabled]);
}

