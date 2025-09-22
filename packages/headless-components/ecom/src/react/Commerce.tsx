/**
 * @fileoverview Commerce Primitive Components
 *
 * This module provides unstyled, composable components for building e-commerce functionality.
 * These components follow the Radix UI primitive pattern, offering:
 *
 * - **Unstyled**: No default styling, only functional behavior
 * - **Composable**: Support for the `asChild` pattern for flexible DOM structure
 * - **Accessible**: Built-in ARIA attributes and proper semantics
 * - **Flexible**: Render props pattern for maximum customization
 *
 * ## Architecture
 *
 * These components are the **primitive layer** that sits between:
 * 1. **Core components** (pure logic, no DOM)
 * 2. **Styled components** (project-specific styling)
 *
 * ## Usage
 *
 * ```tsx
 * import { Commerce } from '@wix/ecom/react';
 *
 * function CheckoutButton() {
 *   return (
 *     <Commerce.Actions.Checkout
 *       className="btn-primary"
 *       label="Proceed to Checkout"
 *       loadingState="Processing..."
 *     />
 *   );
 * }
 *
 * function CustomDomButton() {
 *   return (
 *     <Commerce.Actions.Checkout asChild>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Proceed to Checkout
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Processing...
 *         </span>
 *       </button>
 *     </Commerce.Actions.Checkout>
 *   );
 * }
 *
 * function CustomCheckoutButton() {
 *   return (
 *     <Commerce.Actions.Checkout asChild>
 *       {({ proceedToCheckout, canCheckout, isLoading }, ref) => (
 *         <button
 *           ref={ref}
 *           onClick={proceedToCheckout}
 *           disabled={!canCheckout || isLoading}
 *           className="custom-button"
 *         >
 *           {isLoading ? 'Processing...' : 'Checkout Now'}
 *         </button>
 *       )}
 *     </Commerce.Actions.Checkout>
 *   );
 * }
 * ```
 *
 * @module Commerce
 */

import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { Slot } from '@radix-ui/react-slot';
import { Checkout as CoreCurrentCartCheckout } from './core/CurrentCart.js';
import {
  Trigger as CoreCheckoutTrigger,
  Root as CoreCheckoutRoot,
} from './core/Checkout.js';
import React from 'react';
import { DataComponentTags } from '../data-component-tags.js';
import { type LineItem } from '../services/checkout-service.js';

/**
 * Test IDs for commerce action components.
 * These IDs are automatically applied to rendered DOM elements for testing purposes.
 *
 * @internal
 */
enum TestIds {
  /** Test ID for checkout action buttons */
  actionCheckout = 'action-checkout',
  /** Test ID for add to cart action buttons */
  actionAddToCart = 'action-add-to-cart',
  /** Test ID for buy now action buttons */
  actionBuyNow = 'action-buy-now',
}

/**
 * Props for the Commerce Root component.
 */
export interface RootProps {
  /** Configuration for the checkout service */
  checkoutServiceConfig?: Parameters<
    typeof CoreCheckoutRoot
  >[0]['checkoutServiceConfig'];
  /** Content to render inside the root component */
  children?: React.ReactNode;
}

/**
 * Root component that provides the Commerce context to its children.
 * This component sets up the necessary services for managing commerce functionality.
 *
 * @component
 * @example
 * ```tsx
 * <Commerce.Root checkoutServiceConfig={{ channelType: 'WEB', postFlowUrl: '/thank-you' }}>
 *   <Commerce.Actions.BuyNow lineItems={lineItems} />
 *   <Commerce.Actions.AddToCart lineItems={lineItems} />
 * </Commerce.Root>
 * ```
 */
export const Root = ({ checkoutServiceConfig, children }: RootProps) => {
  return (
    <CoreCheckoutRoot checkoutServiceConfig={checkoutServiceConfig}>
      <AsChildSlot data-component-tag={DataComponentTags.commerceRoot}>
        {children}
      </AsChildSlot>
    </CoreCheckoutRoot>
  );
};

Root.displayName = 'Commerce.Root';

/**
 * Props for the ActionCheckout component.
 * Supports the asChild pattern for flexible composition.
 */
export interface ActionCheckoutProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /**
   * Content to render inside the button.
   * Can be static content or a render function for custom behavior.
   */
  children?: AsChildChildren<{
    /** Function to proceed to checkout */
    proceedToCheckout: () => Promise<void>;
    /** Whether checkout is available */
    canCheckout: boolean;
    /** Whether checkout action is loading */
    isLoading: boolean;
  }>;
  /** Text or content to display when not loading */
  label?: string | React.ReactNode;
  /** Text or content to display when loading */
  loadingState?: string | React.ReactNode;
}

/**
 * Checkout action button component that handles cart checkout flow.
 * Automatically manages loading states, disabled states, and checkout validation.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default button with simple styling
 * <Commerce.Actions.Checkout
 *   className="btn-primary"
 *   label="Proceed to Checkout"
 *   loadingState="Processing..."
 * />
 *
 * // Custom button with DOM structure
 * function CustomDomButton() {
 *   return (
 *     <Commerce.Actions.Checkout asChild>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Proceed to Checkout
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Processing...
 *         </span>
 *       </button>
 *     </Commerce.Actions.Checkout>
 *   );
 * }
 *
 * // Custom button with asChild pattern
 * <Commerce.Actions.Checkout asChild>
 *   {({ proceedToCheckout, canCheckout, isLoading }, ref) => (
 *     <button
 *       ref={ref}
 *       onClick={proceedToCheckout}
 *       disabled={!canCheckout || isLoading}
 *       className="custom-checkout-btn"
 *     >
 *       {isLoading ? (
 *         <div className="flex items-center gap-2">
 *           <Spinner />
 *           <span>Processing...</span>
 *         </div>
 *       ) : (
 *         <span>Checkout ({totalItems} items)</span>
 *       )}
 *     </button>
 *   )}
 * </Commerce.Actions.Checkout>
 *
 * // Static content with automatic state management
 * <Commerce.Actions.Checkout className="w-full btn-primary">
 *   Go to Checkout
 * </Commerce.Actions.Checkout>
 * ```
 */
const ActionCheckout = React.forwardRef<HTMLButtonElement, ActionCheckoutProps>(
  (
    {
      asChild,
      children,
      className,
      label = 'Checkout',
      loadingState = '...',
      ...otherProps
    },
    ref,
  ) => {
    return (
      <CoreCurrentCartCheckout>
        {(renderProps) => {
          const defaultContent = children
            ? (children as React.ReactNode)
            : renderProps.isLoading
              ? loadingState
              : label;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              onClick={renderProps.proceedToCheckout}
              disabled={!renderProps.canCheckout || renderProps.isLoading}
              data-testid={TestIds.actionCheckout}
              data-in-progress={renderProps.isLoading}
              customElement={children}
              customElementProps={{
                proceedToCheckout: renderProps.proceedToCheckout,
                canCheckout: renderProps.canCheckout,
                isLoading: renderProps.isLoading,
              }}
              content={defaultContent}
              {...otherProps}
            >
              <button>{defaultContent}</button>
            </AsChildSlot>
          );
        }}
      </CoreCurrentCartCheckout>
    );
  },
);

/**
 * Props for ActionAddToCart and ActionBuyNow components.
 * These components require line items to add to cart or purchase.
 * Supports the asChild pattern for flexible composition.
 */
export interface ActionAddToCartProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /**
   * Content to render inside the button.
   * Can be static content or a render function for custom behavior.
   */
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          /** Whether the button should be disabled */
          disabled?: boolean;
          /** Whether the action is currently loading */
          isLoading: boolean;
          /** Function to execute the action (add to cart or buy now) */
          onClick: () => Promise<void>;
          /** Line items that will be processed */
          lineItems: LineItem[];
          /** Error message if any */
          error?: string | null;
        }
      >;
  /** Text or content to display when not loading */
  label?: string | React.ReactNode;
  /** Text or content to display when loading */
  loadingState?: string | React.ReactNode;
  /** Line items to add to cart or purchase */
  lineItems: LineItem[];
  /** Additional disabled state (combined with loading state) */
  disabled?: boolean;
}

/**
 * Props for ActionBuyNow component.
 * Extends ActionAddToCartProps with the same interface.
 * @deprecated Use ActionAddToCartProps instead - this is kept for backwards compatibility
 */
export interface ActionBuyNowRenderProps extends ActionAddToCartProps {}

/**
 * Buy Now action button component that initiates immediate purchase flow.
 * Bypasses the cart and redirects directly to checkout with the specified items.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Simple buy now button
 * <Commerce.Actions.BuyNow
 *   lineItems={[{ catalogReference: { catalogItemId: 'product-123', appId: 'stores', options: {} }, quantity: 1 }]}
 *   className="btn-primary"
 *   label="Buy Now"
 *   loadingState="Processing..."
 * />
 *
 * // Custom button with DOM structure
 * function CustomDomButton() {
 *   return (
 *     <Commerce.Actions.BuyNow asChild lineItems={[{ catalogReference: { catalogItemId: 'product-123', appId: 'stores', options: {} }, quantity: 1 }]}>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Buy Now
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Processing...
 *         </span>
 *       </button>
 *     </Commerce.Actions.BuyNow>
 *   );
 * }
 *
 * // Custom buy now button with render prop
 * <Commerce.Actions.BuyNow
 *   lineItems={productLineItems}
 *   asChild
 * >
 *   {({ onClick, disabled, isLoading, lineItems }, ref) => (
 *     <button
 *       ref={ref}
 *       onClick={onClick}
 *       disabled={disabled}
 *       className="buy-now-btn"
 *     >
 *       {isLoading ? (
 *         <span>Processing {lineItems.length} item(s)...</span>
 *       ) : (
 *         <span>Buy Now - ${calculateTotal(lineItems)}</span>
 *       )}
 *     </button>
 *   )}
 * </Commerce.Actions.BuyNow>
 * ```
 */
const ActionBuyNow = React.forwardRef<
  HTMLButtonElement,
  ActionBuyNowRenderProps
>(
  (
    {
      disabled,
      asChild,
      children,
      className,
      label = 'Buy Now',
      loadingState = '...',
      lineItems,
      ...props
    },
    ref,
  ) => {
    return (
      <CoreCheckoutTrigger>
        {(renderProps) => {
          const onClick = () => {
            return renderProps.createCheckout(lineItems);
          };
          if (asChild && children && typeof children === 'function') {
            return children(
              {
                onClick,
                disabled: renderProps.isLoading || disabled,
                isLoading: renderProps.isLoading,
                lineItems,
                error: renderProps.error,
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
              children={
                children
                  ? (children as React.ReactNode)
                  : renderProps.isLoading
                    ? loadingState
                    : label
              }
            />
          );
        }}
      </CoreCheckoutTrigger>
    );
  },
);

/**
 * Add to Cart action button component that adds specified items to the current cart.
 * Handles cart updates and provides loading states during the add process.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Simple add to cart button
 * <Commerce.Actions.AddToCart
 *   lineItems={[{ catalogReference: { catalogItemId: 'product-123', appId: 'stores', options: {} }, quantity: 2 }]}
 *   className="btn-secondary"
 *   label="Add to Cart"
 *   loadingState="Adding..."
 * />
 *
 * // Custom button with DOM structure
 * function CustomDomButton() {
 *   return (
 *     <Commerce.Actions.AddToCart asChild lineItems={[{ catalogReference: { catalogItemId: 'product-123', appId: 'stores', options: {} }, quantity: 2 }]}>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Add to Cart
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Adding...
 *         </span>
 *       </button>
 *     </Commerce.Actions.AddToCart>
 *   );
 * }
 *
 * // Custom add to cart with conditional rendering
 * <Commerce.Actions.AddToCart
 *   lineItems={selectedVariantLineItems}
 *   disabled={!selectedVariant}
 *   asChild
 * >
 *   {({ onClick, disabled, isLoading, lineItems }, ref) => (
 *     <button
 *       ref={ref}
 *       onClick={onClick}
 *       disabled={disabled}
 *       className={`add-to-cart-btn ${isLoading ? 'loading' : ''}`}
 *     >
 *       {isLoading ? (
 *         <div className="flex items-center gap-2">
 *           <Spinner size="sm" />
 *           <span>Adding {lineItems.length} item(s)...</span>
 *         </div>
 *       ) : (
 *         <div className="flex items-center gap-2">
 *           <CartIcon />
 *           <span>Add to Cart</span>
 *         </div>
 *       )}
 *     </button>
 *   )}
 * </Commerce.Actions.AddToCart>
 *
 * // With quantity display
 * <Commerce.Actions.AddToCart
 *   lineItems={lineItems}
 *   label={`Add ${quantity} to Cart`}
 *   className="w-full btn-secondary"
 * />
 * ```
 */
const ActionAddToCart = React.forwardRef<
  HTMLButtonElement,
  ActionBuyNowRenderProps
>(
  (
    {
      disabled,
      asChild,
      children,
      className,
      label = 'Add to Cart',
      loadingState = '...',
      lineItems,
      ...props
    },
    ref,
  ) => {
    return (
      <CoreCurrentCartCheckout>
        {(renderProps) => {
          const onClick = () => {
            return renderProps.addToCart(lineItems);
          };
          if (asChild && children && typeof children === 'function') {
            return children(
              {
                onClick,
                disabled: renderProps.isLoading || disabled,
                isLoading: renderProps.isLoading,
                lineItems,
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
              children={
                children
                  ? (children as React.ReactNode)
                  : renderProps.isLoading
                    ? loadingState
                    : label
              }
            />
          );
        }}
      </CoreCurrentCartCheckout>
    );
  },
);

/**
 * Props for the CheckoutTrigger component.
 * Wraps CheckoutCore.Trigger for use in other packages.
 */
export interface CheckoutTriggerProps {
  /** Content to render inside the trigger */
  children: (props: {
    createCheckout: (lineItems: LineItem[]) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

/**
 * CheckoutTrigger component that wraps CheckoutCore.Trigger.
 * This wrapper provides a consistent interface for other packages to use.
 *
 * @component
 * @example
 * ```tsx
 * <CheckoutTrigger lineItems={lineItems}>
 *   {({ createCheckout, isLoading, error }) => (
 *     <button onClick={() => createCheckout(lineItems)}>
 *       {isLoading ? 'Processing...' : 'Checkout'}
 *     </button>
 *   )}
 * </CheckoutTrigger>
 * ```
 */
export const CheckoutTrigger = React.forwardRef<
  HTMLDivElement,
  CheckoutTriggerProps
>((props) => {
  const { children } = props;

  return (
    <CoreCheckoutTrigger>
      {(renderProps) => {
        return (
          <React.Fragment>
            {children({
              createCheckout: renderProps.createCheckout,
              isLoading: renderProps.isLoading,
              error: renderProps.error,
            })}
          </React.Fragment>
        );
      }}
    </CoreCheckoutTrigger>
  );
});

/**
 * Namespace containing all commerce action components.
 * These components provide consistent interfaces for common e-commerce actions
 * like checkout, adding to cart, and immediate purchase flows.
 *
 * All action components support:
 * - Automatic loading state management
 * - Disabled state handling
 * - The asChild pattern for flexible composition
 * - Accessible button semantics
 * - Test IDs for automation
 *
 * @namespace
 * @example
 * ```tsx
 * // Basic usage of all action types
 * function ProductActions({ product, selectedVariant }) {
 *   const lineItems = [{
 *     catalogReference: {
 *       catalogItemId: product.id,
 *       appId: 'stores',
 *       options: selectedVariant.options
 *     },
 *     quantity: 1
 *   }];
 *
 *   return (
 *     <div className="product-actions">
 *       <Commerce.Actions.AddToCart
 *         lineItems={lineItems}
 *         className="btn-secondary w-full mb-2"
 *         label="Add to Cart"
 *       />
 *
 *       <Commerce.Actions.BuyNow
 *         lineItems={lineItems}
 *         className="btn-primary w-full mb-4"
 *         label="Buy Now"
 *       />
 *
 *       <Commerce.Actions.Checkout
 *         className="btn-primary w-full"
 *         label="Proceed to Checkout"
 *       />
 *     </div>
 *   );
 * }
 *
 * // Custom button with DOM structure
 * function CustomDomButton() {
 *   return (
 *    <div className="flex gap-4">
 *     <Commerce.Actions.AddToCart asChild lineItems={[{ catalogReference: { catalogItemId: 'product-123', appId: 'stores', options: {} }, quantity: 2 }]}>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Add to Cart
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Adding...
 *         </span>
 *       </button>
 *     </Commerce.Actions.AddToCart>
 *     <Commerce.Actions.BuyNow asChild lineItems={[{ catalogReference: { catalogItemId: 'product-123', appId: 'stores', options: {} }, quantity: 1 }]}>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Buy Now
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Processing...
 *         </span>
 *       </button>
 *     </Commerce.Actions.BuyNow>
 *     <Commerce.Actions.Checkout asChild>
 *       <button className="action-button btn-primary">
 *         <span className="hidden action-button-[data-in-progress=false]:inline">
 *           Proceed to Checkout
 *         </span>
 *         <span className="hidden action-button-[data-in-progress=true]:inline">
 *           Processing...
 *         </span>
 *       </button>
 *     </Commerce.Actions.Checkout>
 *     </div>
 *   );
 *
 * // Advanced custom rendering
 * function CustomActions() {
 *   return (
 *     <div className="flex gap-4">
 *       <Commerce.Actions.AddToCart lineItems={items} asChild>
 *         {({ onClick, isLoading, disabled }, ref) => (
 *           <button
 *             ref={ref}
 *             onClick={onClick}
 *             disabled={disabled}
 *             className="custom-add-btn"
 *           >
 *             {isLoading ? <LoadingSpinner /> : <PlusIcon />}
 *             {isLoading ? 'Adding...' : 'Add to Cart'}
 *           </button>
 *         )}
 *       </Commerce.Actions.AddToCart>
 *
 *       <Commerce.Actions.Checkout asChild>
 *         {({ proceedToCheckout, canCheckout, isLoading }, ref) => (
 *           <button
 *             ref={ref}
 *             onClick={proceedToCheckout}
 *             disabled={!canCheckout || isLoading}
 *             className="custom-checkout-btn"
 *           >
 *             {isLoading ? 'Processing...' : 'Checkout'}
 *           </button>
 *         )}
 *       </Commerce.Actions.Checkout>
 *     </div>
 *   );
 * }
 * ```
 */
export const Actions = {
  /** Checkout button for proceeding to cart checkout */
  Checkout: ActionCheckout,
  /** Add to Cart button for adding items to the current cart */
  AddToCart: ActionAddToCart,
  /** Buy Now button for immediate purchase flow bypassing the cart */
  BuyNow: ActionBuyNow,
} as const;
