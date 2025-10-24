import type { AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import type { EnhancedCategory } from '../services/blog-categories-service.js';

export function isValidChildren(
  children: React.ReactNode | AsChildChildren<any>,
): children is React.ReactNode {
  return (
    React.isValidElement(children) ||
    typeof children === 'string' ||
    (Array.isArray(children) &&
      children.every((c) => React.isValidElement(c) || typeof c === 'string'))
  );
}

const trimSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');

export function isActiveCategory(
  currentPathname: string | undefined,
  categoryPageBaseUrl: string,
  category: EnhancedCategory,
) {
  if (!currentPathname) return false;

  const isCustom = category.isCustom ?? false;
  const slug = category.slug ?? '';
  const currentPathWithTrimmedSlash = trimSlashes(currentPathname);
  const categoryPathWithTrimmedSlash = trimSlashes(
    isCustom ? slug : `${categoryPageBaseUrl}${slug}`,
  );

  return currentPathWithTrimmedSlash === categoryPathWithTrimmedSlash;
}

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
