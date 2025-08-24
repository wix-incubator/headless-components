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
      ...restProps
    } = props;

    if (asChild && customElement) {
      // Handle string
      if (typeof customElement === 'string') {
        return (
          <Slot ref={ref} {...restProps}>
            <div>{customElement}</div>
          </Slot>
        );
      }

      // Handle React element pattern
      if (React.isValidElement(customElement)) {
        return (
          <Slot {...restProps}>
            {React.cloneElement(customElement as React.ReactElement, {
              ref,
              ...(content !== undefined ? { children: content } : {}),
            })}
          </Slot>
        );
      }

      // Handle render function pattern
      if (typeof customElement === 'function') {
        return (
          <Slot {...restProps}>{customElement(customElementProps, ref)}</Slot>
        );
      }

      // Handle render object pattern
      if (typeof customElement === 'object' && 'render' in customElement) {
        return (
          <Slot {...restProps}>
            {customElement.render(customElementProps, ref)}
          </Slot>
        );
      }
    }

    if (!children) {
      return null;
    }

    if (typeof children === 'string') {
      return (
        <Slot ref={ref} {...restProps}>
          <div>{children}</div>
        </Slot>
      );
    }

    if (typeof children === 'function') {
      return <Slot {...restProps}>{children({}, ref)}</Slot>;
    }

    if (typeof children === 'object' && 'render' in children) {
      return (
        <Slot {...restProps}>{children.render(customElementProps, ref)}</Slot>
      );
    }

    return (
      <Slot ref={ref} {...restProps}>
        {children}
      </Slot>
    );
  },
);
