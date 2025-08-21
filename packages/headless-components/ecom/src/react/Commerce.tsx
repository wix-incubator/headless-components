/**
 * @fileoverview Commerce Primitive Components
 *

 */

import { Slot } from '@radix-ui/react-slot';
import {
  Checkout as CoreCurrentCartCheckout,
} from './core/CurrentCart.js';
import { Trigger as CoreCheckout } from './core/Checkout.js';
import React from 'react';
import { type LineItem } from '../../services/checkout-service.js';

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
  | React.ForwardRefRenderFunction<HTMLButtonElement, {
    /** Function to proceed to checkout */
    proceedToCheckout: () => Promise<void>;
    /** Whether checkout is available */
    canCheckout: boolean;
    /** Whether checkout action is loading */
    isLoading: boolean;
  }>;
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
      <CoreCurrentCartCheckout>
        {(renderProps) => {
          if (asChild && children && typeof children === 'function') {
            return children(
              {
                proceedToCheckout: renderProps.proceedToCheckout,
                canCheckout: renderProps.canCheckout,
                isLoading: renderProps.isLoading,
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
      </CoreCurrentCartCheckout>
    )
  }
)

export interface ActionAddToCartProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  children?:
  | React.ReactNode
  | React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled?: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
    lineItems: LineItem[];
  }>;
  label?: string | React.ReactNode;
  loadingState?: string | React.ReactNode;
  lineItems: LineItem[];
  disabled?: boolean;
}

export interface ActionBuyNowRenderProps  extends ActionAddToCartProps {}

const ActionBuyNow = React.forwardRef<HTMLButtonElement, ActionBuyNowRenderProps>(
  ({ disabled, asChild, children, className, label = 'Buy Now', loadingState = '...', ...props }, ref) => {
    return (
      <CoreCheckout>
        {(renderProps) => {
          const onClick = () => {
            return renderProps.createCheckout(props.lineItems);
          }
          if (asChild && children && typeof children === 'function') {
            return children(
              {
                onClick,
                disabled: renderProps.isLoading || disabled,
                isLoading: renderProps.isLoading,
                lineItems: props.lineItems,
              },
              ref,
            );
          }
          const Comp = asChild ? Slot : 'button';
          return (
            <Comp
              ref={ref}
              className={className}
              onClick={onClick}
              disabled={renderProps.isLoading || disabled}
              data-testid={TestIds.actionBuyNow}
              data-in-progress={renderProps.isLoading}
              {...props}
            >
              {renderProps.isLoading ? loadingState : label}
            </Comp>
          );
        }}
      </CoreCheckout>
    )
  }
)

const ActionAddToCart = React.forwardRef<HTMLButtonElement, ActionBuyNowRenderProps>(
  ({ disabled, asChild, children, className, label = 'Add to Cart', loadingState = '...', ...props }, ref) => {
    return (
      <CoreCurrentCartCheckout>
        {(renderProps) => {
          const onClick = () => {
            return renderProps.addToCart(props.lineItems);
          }
          if (asChild && children && typeof children === 'function') {
            return children(
              {
                onClick,
                disabled: renderProps.isLoading || disabled,
                isLoading: renderProps.isLoading,
                lineItems: props.lineItems,
              },
              ref,
            );
          }
          const Comp = asChild ? Slot : 'button';
          return (
            <Comp
              ref={ref}
              className={className}
              onClick={onClick}
              disabled={renderProps.isLoading || disabled}
              data-testid={TestIds.actionAddToCart}
              data-in-progress={renderProps.isLoading}
              {...props}
            >
              {renderProps.isLoading ? loadingState : label}
            </Comp>
          );
        }}
      </CoreCurrentCartCheckout>
    )
  }
)

export const Actions = {
  Checkout: ActionCheckout,
  AddToCart: ActionAddToCart,
  BuyNow: ActionBuyNow,
}

