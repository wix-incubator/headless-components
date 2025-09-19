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
