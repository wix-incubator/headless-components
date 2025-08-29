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
export function createAuthorName(owner: members.Member | null | undefined): {
  authorName: string;
  authorAvatarInitials: string;
} {
  const formattedFirstName = owner?.contact?.firstName?.trim();
  const formattedLastName = owner?.contact?.lastName?.trim();
  const nickname = owner?.profile?.nickname?.trim();

  const authorName =
    nickname ||
    `${formattedFirstName || ''} ${formattedLastName || ''}`.trim() ||
    '';

  const authorAvatarInitials = authorName
    ?.split(' ')
    .map((name) => name[0]?.toLocaleUpperCase())
    .filter((char) => char && /[A-Z]/i.test(char))
    .join('');

  return {
    authorName,
    authorAvatarInitials,
  };
}
