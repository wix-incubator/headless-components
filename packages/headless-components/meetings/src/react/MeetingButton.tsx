import * as React from 'react';
import * as Slot from '@radix-ui/react-slot';
import { MeetingButtonProps, TestIds } from './types.js';

export const MeetingButton = React.forwardRef<HTMLButtonElement, MeetingButtonProps>(
  (props, ref) => {
    const { asChild, bookingUrl, buttonText = 'Meet Us', children, ...otherProps } = props;

    const Comp = asChild ? Slot.Root : 'button';

    return (
      <Comp
        onClick={() => window.open(bookingUrl, '_blank')}
        data-testid={TestIds.meetingButton}
        {...otherProps}
        ref={ref}
      >
        <span data-testid={TestIds.meetingButtonText}>
          {children || buttonText}
        </span>
      </Comp>
    );
  }
);
