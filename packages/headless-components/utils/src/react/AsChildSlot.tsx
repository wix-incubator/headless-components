import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface AsChildSlot {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: React.ReactNode;
  /** Custom render function when using asChild */
  customElement?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<HTMLElement, any>;
  customElementProps?: any;
  /** CSS classes to apply to the default element */
  className?: string;

  content?: React.ReactNode | string;

  [key: string]: any;
}

export const AsChildSlot = React.forwardRef<HTMLElement, AsChildSlot>(
  (props, ref) => {
    const {
      asChild,
      children,
      customElement,
      customElementProps = {},
      content,
      ...restPros
    } = props;

    if (asChild && customElement) {
      // Handle React element pattern
      if (React.isValidElement(customElement)) {
        return (
          <Slot {...restPros}>
            {React.cloneElement(customElement as React.ReactElement, {
              ref,
              ...(content ? { children: content } : {}),
            })}
          </Slot>
        );
      }

      // Handle render function pattern
      if (typeof customElement === 'function') {
        return (
          <Slot {...restPros}>{customElement(customElementProps, ref)}</Slot>
        );
      }
    }

    // Handle render object pattern
    if (
      customElement &&
      typeof customElement === 'object' &&
      'render' in customElement
    ) {
      return (
        <Slot {...restPros}>
          {customElement.render(customElementProps, ref)}
        </Slot>
      );
    }

    return (
      <Slot ref={ref} {...restPros}>
        {typeof children === 'function' ? children({}, ref) : children}
      </Slot>
    );
  },
);
