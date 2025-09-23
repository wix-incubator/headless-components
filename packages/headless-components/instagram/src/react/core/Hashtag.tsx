import React from 'react';

export function Hashtag(props: { children: (data: { hashtag: string | null }) => React.ReactNode }) {
  const hashtag: string | null = null;
  return <>{props.children({ hashtag })}</>;
}


