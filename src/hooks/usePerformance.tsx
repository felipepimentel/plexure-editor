import React from 'react';

interface LazyComponentOptions {
  fallback?: React.ReactNode;
  threshold?: number;
  delay?: number;
}

export function useLazyComponent<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const {
    fallback = null,
    threshold = 0,
    delay = 0
  } = options;

  const Component = React.useMemo(
    () => React.lazy(() => {
      if (delay > 0) {
        return new Promise(resolve => {
          setTimeout(() => resolve(factory()), delay);
        });
      }
      return factory();
    }),
    [factory, delay]
  );

  const [shouldLoad, setShouldLoad] = React.useState(threshold === 0);

  React.useEffect(() => {
    if (threshold > 0 && !shouldLoad) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      const element = document.createElement('div');
      observer.observe(element);

      return () => observer.disconnect();
    }
  }, [threshold, shouldLoad]);

  return shouldLoad ? (
    <React.Suspense fallback={fallback}>
      <Component />
    </React.Suspense>
  ) : fallback;
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList,
  options: { maxSize?: number; ttl?: number } = {}
) {
  const {
    maxSize = 100,
    ttl = 5 * 60 * 1000 // 5 minutes
  } = options;

  const cache = React.useRef(new Map<string, { value: any; timestamp: number }>());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of cache.current.entries()) {
        if (now - entry.timestamp > ttl) {
          cache.current.delete(key);
        }
      }
    }, ttl);

    return () => clearInterval(interval);
  }, [ttl]);

  return React.useCallback((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.current.get(key);

    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = callback(...args);
    
    if (cache.current.size >= maxSize) {
      // Remove oldest entry
      const oldestKey = Array.from(cache.current.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      cache.current.delete(oldestKey);
    }

    cache.current.set(key, { value: result, timestamp: now });
    return result;
  }, dependencies);
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = React.useRef(Date.now());
  const timeout = React.useRef<NodeJS.Timeout>();

  return React.useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, delay - (now - lastRun.current));
    }
  }, [callback, delay]) as T;
}

export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(callback);
      },
      options
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}

export function useResizeObserver(
  callback: (entry: ResizeObserverEntry) => void
) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new ResizeObserver(
      entries => {
        entries.forEach(callback);
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return ref;
} 