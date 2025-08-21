/**
 * @fileoverview Commerce Primitive Components
 *

 */

import { Slot } from '@radix-ui/react-slot';
import { Checkout as CoreCheckout } from './core/CurrentCart.js';
import React from 'react';

// Components that render actual DOM elements get test IDs on their rendered elements
// Components that only provide context/logic don't introduce new DOM elements
enum TestIds {
  actionCheckout = 'action-checkout',
  actionAddToCart = 'action-add-to-cart',
  actionBuyNow = 'action-buy-now',
}

export interface ActionCheckoutProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          /** Function to proceed to checkout */
          proceedToCheckout: () => Promise<void>;
          /** Whether checkout is available */
          canCheckout: boolean;
          /** Whether checkout action is loading */
          isLoading: boolean;
          label: string | React.ReactNode;
          loadingState: string | React.ReactNode;
        }
      >;
  label?: string | React.ReactNode;
  loadingState?: string | React.ReactNode;
}

const ActionCheckout = React.forwardRef<HTMLButtonElement, ActionCheckoutProps>(
  (
    {
      asChild,
      children,
      className,
      label = 'Checkout',
      loadingState = '...',
      ...props
    },
    ref,
  ) => {
    return (
      <CoreCheckout>
        {(renderProps) => {
          if (asChild && children && typeof children === 'function') {
            return children(
              {
                proceedToCheckout: renderProps.proceedToCheckout,
                canCheckout: renderProps.canCheckout,
                isLoading: renderProps.isLoading,
                label,
                loadingState,
              },
              ref,
            );
          }
          const Comp = asChild ? Slot : 'button';
          return (
            <Comp
              ref={ref}
              className={className}
              onClick={renderProps.proceedToCheckout}
              disabled={!renderProps.canCheckout || renderProps.isLoading}
              data-testid={TestIds.actionCheckout}
              data-in-progress={renderProps.isLoading}
              {...props}
            >
              {renderProps.isLoading ? loadingState : label}
            </Comp>
          );
        }}
      </CoreCheckout>
    );
  },
);

export const Actions = {
  Checkout: ActionCheckout,
};
