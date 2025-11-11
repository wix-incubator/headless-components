import type { AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';

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
