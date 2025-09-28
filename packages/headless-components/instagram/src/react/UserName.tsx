import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreUserName from './core/UserName.js';

export interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ displayName: string }>;
  className?: string;
  unknownLabel?: string;
}

export const UserName = React.forwardRef<HTMLElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreUserName.UserName unknownLabel={props.unknownLabel}>
        {({ displayName, displayValue }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ displayName }}
            content={displayValue}
            {...otherProps}
          >
            <span>{displayValue}</span>
          </AsChildSlot>
        )}
      </CoreUserName.UserName>
    );
  },
);
