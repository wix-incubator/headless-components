import type { AsChildChildren } from '@wix/headless-utils/react';
import type { members } from '@wix/members';
import * as React from 'react';

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

/**
 * Helper function to create author name from member data
 */
export function createAuthorName(
  owner: members.Member | null | undefined,
): string | undefined {
  const formattedFirstName = owner?.contact?.firstName?.trim();
  const formattedLastName = owner?.contact?.lastName?.trim();
  const nickname = owner?.profile?.nickname?.trim();

  return (
    nickname ||
    `${formattedFirstName || ''} ${formattedLastName || ''}`.trim() ||
    undefined
  );
}
