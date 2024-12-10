import { useEffect, useRef } from 'react';

export function useResizeObserver(callback: (entry: ResizeObserverEntry) => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        callback(entries[0]);
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [callback]);

  return ref;
}