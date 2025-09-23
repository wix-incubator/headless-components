import React from 'react';

export function Media(props: {
  media: any;
  children: (data: { media: any }) => React.ReactNode;
}) {
  const { media, children } = props;
  return <>{children({ media })}</>;
}


