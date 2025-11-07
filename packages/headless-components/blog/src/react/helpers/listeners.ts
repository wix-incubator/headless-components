import React from 'react';

export function useIntersectionObserver(forwardedRef: React.ForwardedRef<HTMLElement>) {
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  // Set up intersection observer for lazy loading
  React.useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect(); // Only load once
        }
      },
      {
        rootMargin: '100px', // Start loading when 100px away from viewport
        threshold: 0.1, // Trigger when 10% visible
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, isVisible]);

  // Combined ref to handle both forwarded ref and observer ref
  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      setElement(el);
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    },
    [forwardedRef],
  );

  return { ref, element, isVisible };
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): {
  throttled: (...args: Parameters<T>) => void;
  cleanup: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  const throttled = function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= wait) {
      lastCallTime = now;
      func(...args);
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
      }, wait - timeSinceLastCall);
    }
  };

  const cleanup = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return { throttled, cleanup };
}

export function useScrollListener(
  onScroll: ((event: Event) => void) | undefined,
  throttleTimeout = 1000,
): void {
  const throttledOnScroll = React.useMemo(
    () =>
      onScroll
        ? throttle((event: Event) => {
            onScroll(event);
          }, throttleTimeout)
        : null,
    [onScroll, throttleTimeout],
  );

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (!onScroll || !throttledOnScroll) {
      return;
    }

    document.addEventListener('scroll', throttledOnScroll.throttled, {
      passive: true,
    });

    return () => {
      throttledOnScroll.cleanup();
      document.removeEventListener('scroll', throttledOnScroll.throttled);
    };
  }, [onScroll, throttledOnScroll]);
}

export function useVisibilityChangeListener(onVisibilityChange: (() => void) | undefined): void {
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (!onVisibilityChange) {
      return;
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [onVisibilityChange]);
}
