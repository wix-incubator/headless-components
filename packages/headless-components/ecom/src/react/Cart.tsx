/**
 * @fileoverview Cart Primitive Components
 *
 * This module provides unstyled, composable components for building cart functionality.
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
 * import { Cart } from '@wix/ecom/react';
 *
 * function CartProvider() {
 *   return (
 *     <Cart.Root currentCartServiceConfig={config}>
 *       <Cart.OpenTrigger>
 *         {({ totalItems, open }) => (
 *           <button onClick={open}>Cart ({totalItems})</button>
 *         )}
 *       </Cart.OpenTrigger>
 *       <Cart.Content>
 *         {({ cart, isLoading }) => (
 *           <div>
 *             {isLoading ? 'Loading...' : 'Cart content'}
 *           </div>
 *         )}
 *       </Cart.Content>
 *     </Cart.Root>
 *   );
 * }
 * ```
 *
 * @module Cart
 */

import {
  EmptyState as CoreEmptyState,
  LineItemsList as CoreLineItemsList,
  Item as CoreItem,
  Summary as CoreSummary,
  SummaryRenderProps as CoreSummaryRenderProps,
  Content as CoreContent,
  Clear as CoreClear,
  Checkout as CoreCheckout,
  Notes as CoreNotes,
  LineItemAdded as CoreLineItemAdded,
} from './core/CurrentCart.js';
import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import { CurrentCartServiceDefinition } from '../services/current-cart-service.js';
import type { LineItem } from '../services/common-types.js';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as LineItemComponent from './LineItem.js';
import * as CouponComponents from './CartCoupon.js';

// Components that render actual DOM elements get test IDs on their rendered elements
// Components that only provide context/logic don't introduce new DOM elements
enum TestIds {
  cartRoot = 'cart-root',
  cartEmptyState = 'cart-empty-state',
  cartOpenTrigger = 'cart-open-trigger',
  cartLineItemsList = 'cart-line-items-list',
  cartItem = 'cart-item',
  cartSummary = 'cart-summary',
  cartClear = 'cart-clear',
  cartCheckout = 'cart-checkout',
  cartErrors = 'cart-errors',
  cartNotes = 'cart-notes',
  cartCoupon = 'cart-coupon',

  cartNoteInput = 'cart-note-input',
  cartLineItems = 'cart-line-items',
  cartLineItemRepeater = 'cart-line-item-repeater',
}

/**
 * Props for the Root component
 */
export interface RootProps {
  /** Child components that will have access to the cart context */
  children: React.ReactNode;
}

/**
 * Root component that provides cart service context to its children.
 * This is a primitive wrapper around the core Root component that maintains
 * the same API while providing a foundation for composition patterns.
 *
 * @component
 * @example
 * ```tsx
 * import { Cart } from '@wix/ecom/react';
 *
 * function CartProvider() {
 *   return (
 *     <Cart.Root currentCartServiceConfig={config}>
 *       <Cart.OpenTrigger>
 *         {({ totalItems, open }) => (
 *           <button onClick={open}>Cart ({totalItems})</button>
 *         )}
 *       </Cart.OpenTrigger>
 *     </Cart.Root>
 *   );
 * }
 * ```
 */
export const Root = ({ children }: RootProps) => {
  return <>{children}</>;
};

/**
 * Props for EmptyState component with asChild support
 */
export interface EmptyStateProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Content to display when cart is empty (can be a render function or ReactNode) */
  children: AsChildChildren<{}>;
  /** CSS class name */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Component that renders content when the cart is empty.
 * Only displays its children when there are no items in cart, no loading state, and no errors.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default div wrapper
 * <Cart.EmptyState>
 *   {() => (
 *     <div>
 *       <h3>No items in cart</h3>
 *       <p>Items will appear here once they are added</p>
 *     </div>
 *   )}
 * </Cart.EmptyState>
 *
 * // Using asChild for custom wrapper
 * <Cart.EmptyState asChild>
 *   <section className="empty-cart-section">
 *     Content will be rendered here
 *   </section>
 * </Cart.EmptyState>
 * ```
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ asChild, children }, ref) => {
    return (
      <CoreEmptyState>
        <AsChildSlot
          asChild={asChild}
          customElement={children}
          customElementProps={{}}
          ref={ref}
          data-testid={TestIds.cartEmptyState}
        >
          {children ? children : 'No items in cart'}
        </AsChildSlot>
      </CoreEmptyState>
    );
  },
);

/**
 * Props for button-like components that support the asChild pattern
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}

/**
 * Props for OpenTrigger component
 */
export interface OpenTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          totalItems: number;
          open: () => void;
          isLoading: boolean;
        }
      >;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Props for LineItemsList component
 */
export interface LineItemsListProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    items: LineItem[];
    totalItems: number;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Empty state to display when cart is empty */
  emptyState?: React.ReactNode;
}

/**
 * Headless component for cart items collection.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default div wrapper
 * <Cart.LineItemsList>
 *   {({ items, totalItems }) => (
 *     <div>
 *       <h1>Cart ({totalItems} items)</h1>
 *       {items.map(item => <div key={item._id}>{item.productName?.original}</div>)}
 *     </div>
 *   )}
 * </Cart.LineItemsList>
 *
 * // Using asChild for custom wrapper
 * <Cart.LineItemsList asChild>
 *   <ul className="cart-items-list">
 *     Items content will be rendered here
 *   </ul>
 * </Cart.LineItemsList>
 * ```
 */
export const LineItemsList = React.forwardRef<
  HTMLDivElement,
  LineItemsListProps
>(({ asChild, children, ...props }, ref) => {
  return (
    <CoreLineItemsList>
      {(renderProps) => {
        if (!renderProps.totalItems) {
          return props.emptyState || null;
        }

        return (
          <AsChildSlot
            asChild={asChild}
            customElement={children}
            customElementProps={renderProps}
            ref={ref}
            data-testid={TestIds.cartLineItemsList}
            {...props}
          >
            {children ? children : null}
            <EmptyState asChild={asChild}>{props.emptyState}</EmptyState>
          </AsChildSlot>
        );
      }}
    </CoreLineItemsList>
  );
});

/**
 * Props for LineItems component (alternative to LineItemsList)
 */
export interface LineItemsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Empty state to display when cart is empty */
  emptyState?: React.ReactNode;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Headless component for cart items collection (alternative to LineItemsList)
 *
 * @example
 * ```tsx
 * <Cart.LineItems
 *   emptyState={<div>Your cart is empty</div>}
 * >
 *   <Cart.LineItemRepeater>
 *     <LineItem.Image />
 *     <LineItem.Title />
 *     <LineItem.SelectedOptions />
 *   </Cart.LineItemRepeater>
 * </Cart.LineItems>
 * ```
 */
export const LineItems = React.forwardRef<HTMLElement, LineItemsProps>(
  (props, ref) => {
    const { asChild, children, emptyState, ...otherProps } = props;

    const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
      typeof CurrentCartServiceDefinition
    >;

    const cart = service.cart.get();

    // Show empty state if cart is null or has no items
    if (!cart?.lineItems?.length && emptyState) {
      return emptyState;
    }

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        data-testid={TestIds.cartLineItems}
        customElement={children}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    );
  },
);

export interface LineItemRepeaterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Component that repeats its children for each line item in the cart.
 * Provides context for each line item.
 *
 * @component
 * @example
 * ```tsx
 * import { Cart } from '@wix/ecom/components';
 *
 * function CartItemsList() {
 *   return (
 *     <Cart.LineItems>
 *       <Cart.LineItemRepeater>
 *         <LineItem.Title />
 *         <LineItem.Image />
 *         <LineItem.Quantity />
 *       </Cart.LineItemRepeater>
 *     </Cart.LineItems>
 *   );
 * }
 * ```
 */
export const LineItemRepeater = React.forwardRef<
  HTMLElement,
  LineItemRepeaterProps
>((props, ref) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;
  const { asChild, children, className, ...otherProps } = props;

  const cart = service.cart.get();
  const items = cart?.lineItems || [];

  const content = items.map((item, index) => (
    <LineItemComponent.Root key={item._id || index} item={item}>
      {React.isValidElement(children) ? children : null}
    </LineItemComponent.Root>
  ));

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.cartLineItemRepeater}
      customElement={children}
      customElementProps={{}}
      {...otherProps}
    >
      <div>{content}</div>
    </AsChildSlot>
  );
});

/**
 * Props for Content headless component
 */
export interface ContentProps {
  /** Render prop function that receives content data */
  children: (props: ContentRenderProps) => React.ReactNode;
}

/**
 * Render props for Content component
 */
export interface ContentRenderProps {
  /** Whether cart is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export const Content = (props: ContentProps) => {
  return <CoreContent>{props.children}</CoreContent>;
};

/**
 * Props for Summary component
 */
export interface SummaryProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Render prop function that receives summary data */
  children: AsChildChildren<{
    /** Cart subtotal */
    subtotal: string;
    /** Discount amount if coupon applied */
    discount: string | null;
    /** Applied coupon code if any */
    appliedCoupon: string | null;
    /** Shipping cost */
    shipping: string;
    /** Tax amount */
    tax: string;
    /** Cart total */
    total: string;
    /** Currency code */
    currency: string;
    /** Total number of items */
    totalItems: number;
    /** Whether totals are being calculated */
    isTotalsLoading: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Headless component for cart summary/totals.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default div wrapper
 * <Cart.Summary>
 *   {({ subtotal, total, totalItems, isTotalsLoading }) => (
 *     <div>
 *       <p>Subtotal ({totalItems} items): {subtotal}</p>
 *       <p>Total: {isTotalsLoading ? 'Calculating...' : total}</p>
 *     </div>
 *   )}
 * </Cart.Summary>
 *
 * // Using asChild for custom wrapper
 * <Cart.Summary asChild>
 *   <section className="cart-summary">
 *     Summary content will be rendered here
 *   </section>
 * </Cart.Summary>
 * ```
 */
export const Summary = React.forwardRef<HTMLDivElement, SummaryProps>(
  ({ asChild, children, ...props }, ref) => {
    return (
      <CoreSummary>
        {(renderProps) => {
          return (
            <AsChildSlot
              asChild={asChild}
              customElement={children}
              customElementProps={renderProps}
              ref={ref}
              data-testid={TestIds.cartSummary}
              {...props}
            >
              <div>
                <p>
                  Subtotal ({renderProps.totalItems} items):{' '}
                  {renderProps.subtotal}
                </p>
                <p>
                  Total:{' '}
                  {renderProps.isTotalsLoading
                    ? 'Calculating...'
                    : renderProps.total}
                </p>
              </div>
            </AsChildSlot>
          );
        }}
      </CoreSummary>
    );
  },
);

/**
 * Props for Clear component
 */
export interface ClearProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    clear: () => Promise<void>;
    totalItems: number;
    isLoading: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Headless component for clearing the cart.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default button
 * <Cart.Clear>
 *   {({ clear, totalItems, isLoading }) => (
 *     <button onClick={clear} disabled={isLoading || totalItems === 0}>
 *       {isLoading ? 'Clearing...' : `Clear Cart (${totalItems})`}
 *     </button>
 *   )}
 * </Cart.Clear>
 *
 * // Using asChild for custom button
 * <Cart.Clear asChild>
 *   <button className="danger-button">
 *     Clear action content will be rendered here
 *   </button>
 * </Cart.Clear>
 * ```
 */
export const Clear = React.forwardRef<HTMLButtonElement, ClearProps>(
  ({ children, asChild, ...props }, ref) => {
    return (
      <CoreClear>
        {(renderProps) => {
          if (renderProps.totalItems === 0) {
            return null;
          }
          return (
            <AsChildSlot
              asChild={asChild}
              customElement={children}
              customElementProps={renderProps}
              ref={ref}
              onClick={renderProps.clear}
              disabled={renderProps.isLoading}
              data-testid={TestIds.cartClear}
              {...props}
            >
              <button
                onClick={renderProps.clear}
                disabled={renderProps.isLoading || renderProps.totalItems === 0}
              >
                {renderProps.isLoading
                  ? 'Clearing...'
                  : `Clear Cart (${renderProps.totalItems})`}
              </button>
            </AsChildSlot>
          );
        }}
      </CoreClear>
    );
  },
);

/**
 * Props for Checkout component
 */
export interface CheckoutProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Render prop function that receives checkout data */
  children: AsChildChildren<{
    /** Function to proceed to checkout */
    proceedToCheckout: () => Promise<void>;
    /** Whether checkout is available */
    canCheckout: boolean;
    /** Whether checkout action is loading */
    isLoading: boolean;
    /** Error message if checkout fails */
    error: string | null;
  }>;
  /** CSS class name */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Headless component for checkout action.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default button
 * <Cart.Checkout>
 *   {({ proceedToCheckout, canCheckout, isLoading, error }) => (
 *     <div>
 *       {error && <p>Error: {error}</p>}
 *       <button onClick={proceedToCheckout} disabled={!canCheckout || isLoading}>
 *         {isLoading ? 'Processing...' : 'Proceed to Checkout'}
 *       </button>
 *     </div>
 *   )}
 * </Cart.Checkout>
 *
 * // Using asChild for custom button
 * <Cart.Checkout asChild>
 *   <button className="primary-button">
 *     Checkout content will be rendered here
 *   </button>
 * </Cart.Checkout>
 * ```
 */
export const Checkout = React.forwardRef<HTMLButtonElement, CheckoutProps>(
  ({ children, asChild, ...props }, ref) => {
    return (
      <CoreCheckout>
        {(renderProps) => {
          return (
            <AsChildSlot
              asChild={asChild}
              customElement={children}
              customElementProps={renderProps}
              ref={ref}
              onClick={renderProps.proceedToCheckout}
              disabled={!renderProps.canCheckout || renderProps.isLoading}
              data-testid={TestIds.cartCheckout}
              {...props}
            >
              <button
                onClick={renderProps.proceedToCheckout}
                disabled={!renderProps.canCheckout || renderProps.isLoading}
              >
                {renderProps.isLoading
                  ? 'Processing...'
                  : 'Proceed to Checkout'}
              </button>
            </AsChildSlot>
          );
        }}
      </CoreCheckout>
    );
  },
);

/**
 * Props for Notes component
 */
export interface NotesProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Render prop function that receives notes data */
  children?: AsChildChildren<{
    /** Current notes value */
    notes: string;
    /** Function to update notes */
    updateNotes: (notes: string) => Promise<void>;
  }>;
  /** CSS class name */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Headless component for notes.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default div wrapper
 * <Cart.Notes>
 *   {({ notes, updateNotes }) => (
 *     <textarea
 *       value={notes}
 *       onChange={e => updateNotes(e.target.value)}
 *       placeholder="Special instructions for your order"
 *     />
 *   )}
 * </Cart.Notes>
 *
 * // Using asChild for custom wrapper
 * <Cart.Notes asChild>
 *   <div className="notes-section">
 *     Notes content will be rendered here
 *   </div>
 * </Cart.Notes>
 * ```
 */
export const Notes = React.forwardRef<HTMLDivElement, NotesProps>(
  ({ asChild, children, ...props }, ref) => {
    return (
      <CoreNotes>
        {(renderProps) => {
          return (
            <AsChildSlot
              asChild={asChild}
              customElement={children}
              customElementProps={renderProps}
              ref={ref}
              data-testid={TestIds.cartNotes}
              {...props}
            >
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">
                  Notes:
                </label>
                <textarea
                  value={renderProps.notes}
                  onChange={(e) => renderProps.updateNotes(e.target.value)}
                  placeholder="Special instructions for your order (e.g., gift wrap, delivery notes)"
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-interactive border border-surface-interactive rounded-lg text-content-primary placeholder:text-content-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors duration-200 resize-vertical"
                />
              </div>
            </AsChildSlot>
          );
        }}
      </CoreNotes>
    );
  },
);

/**
 * Props for LineItemAdded component
 */
export interface LineItemAddedProps {
  /** Render prop function that receives line item added subscription data */
  children: (props: {
    /**
     * Subscribe to line item added events
     * @param callback - Function called when items are added to cart
     * @returns Unsubscribe function to clean up the subscription
     */
    onAddedToCart: (
      callback: (lineItems: LineItem[] | undefined) => void,
    ) => void;
  }) => React.ReactNode;
}

/**
 * Headless component for line item added event subscription.
 * This component does not render any DOM elements - it only provides event subscription functionality.
 *
 * @component
 * @example
 * ```tsx
 * <Cart.LineItemAdded>
 *   {({ onAddedToCart }) => {
 *     useEffect(() => {
 *       return onAddedToCart((lineItems) => {
 *         console.log('Items added:', lineItems);
 *         setShowNotification(true);
 *       });
 *     }, [onAddedToCart]);
 *     return null;
 *   }}
 * </Cart.LineItemAdded>
 * ```
 */
export const LineItemAdded = (props: LineItemAddedProps) => {
  return <CoreLineItemAdded>{props.children}</CoreLineItemAdded>;
};

// ===== COUPON SUB-COMPONENTS =====

// Re-export coupon components with new Root structure
export type CouponRootProps = CouponComponents.CouponRootProps;
export type CouponInputProps = CouponComponents.CouponInputProps;
export type CouponTriggerProps = CouponComponents.CouponTriggerProps;
export type CouponClearProps = CouponComponents.CouponClearProps;
export type CouponRawProps = CouponComponents.CouponRawProps;

// ===== NOTE SUB-COMPONENTS =====

/**
 * Props for Note.Input component
 */
export interface NoteInputProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
  }>;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Maximum character limit */
  maxLength?: number;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Order notes input field for customers to add special instructions or comments.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Cart.Note.Input placeholder="Add special instructions..." className="w-full px-3 py-2 border rounded-lg" />
 *
 * // Custom rendering with forwardRef
 * <Cart.Note.Input asChild>
 *   {React.forwardRef(({value, onChange, ...props}, ref) => (
 *     <textarea
 *       ref={ref}
 *       {...props}
 *       value={value}
 *       onChange={(e) => onChange(e.target.value)}
 *       className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2"
 *       rows={3}
 *     />
 *   ))}
 * </Cart.Note.Input>
 * ```
 */
const NoteInput = React.forwardRef<HTMLTextAreaElement, NoteInputProps>(
  (
    {
      asChild,
      children,
      placeholder = 'Add special instructions...',
      maxLength = 500,
      ...props
    },
    ref,
  ) => {
    return (
      <CoreNotes>
        {(renderProps) => {
          const { notes, updateNotes } = renderProps;

          return (
            <AsChildSlot
              asChild={asChild}
              customElement={children}
              customElementProps={renderProps}
              ref={ref}
              data-testid={TestIds.cartNoteInput}
              {...props}
            >
              <textarea
                value={notes || ''}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                data-testid={TestIds.cartNoteInput}
                {...props}
              />
            </AsChildSlot>
          );
        }}
      </CoreNotes>
    );
  },
);

// ===== NESTED NAMESPACE EXPORTS =====

/**
 * Coupon-related components namespace
 *
 * @example
 * ```tsx
 * // Complete coupon management with new Root structure
 * <Cart.Coupon.Root>
 *   <div className="flex gap-2">
 *     <Cart.Coupon.Input
 *       placeholder="Enter coupon code"
 *       className="flex-1 px-3 py-2 border rounded"
 *     />
 *     <Cart.Coupon.Trigger className="px-4 py-2 bg-blue-500 text-white rounded">
 *       Apply
 *     </Cart.Coupon.Trigger>
 *   </div>
 *   <Cart.Coupon.Clear className="text-sm text-red-500 underline mt-2">
 *     Remove coupon
 *   </Cart.Coupon.Clear>
 * </Cart.Coupon.Root>
 *
 * // Raw access to all coupon functionality
 * <Cart.Coupon.Raw>
 *   {({ appliedCoupon, apply, remove, isLoading, error }) => (
 *     <div>
 *       {appliedCoupon ? (
 *         <span>Applied: {appliedCoupon}</span>
 *       ) : (
 *         <input onBlur={(e) => apply(e.target.value)} />
 *       )}
 *     </div>
 *   )}
 * </Cart.Coupon.Raw>
 * ```
 */
export const Coupon = {
  Root: CouponComponents.Root,
  Input: CouponComponents.Input,
  Trigger: CouponComponents.Trigger,
  Clear: CouponComponents.Clear,
  Raw: CouponComponents.Raw,
} as const;

/**
 * Note-related components namespace
 */
export const Note = {
  Input: NoteInput,
} as const;

/**
 * Represents a monetary value with amount and currency
 */
export interface Money {
  /** The amount in the smallest currency unit (e.g., cents for USD) */
  amount: number;
  /** The currency code (e.g., 'USD', 'EUR') */
  currency: string;
}

/**
 * Props for cart price components that display various cart pricing information.
 * Supports the asChild pattern for flexible composition.
 */
export interface CartPriceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Render function that receives price data and formatting information */
  children?: AsChildChildren<{
    /** The price object containing amount and currency */
    price: Money;
    /** Human-readable formatted price string (e.g., "$24.99") */
    formattedPrice: string;
    /** Whether the price calculation is currently loading */
    isLoading: boolean;
    /** Optional label for the price component */
    label?: string;
  }>;
  /** Optional text label to display with the price */
  label?: string;
}

/**
 * Factory function that creates price component variants for different cart pricing elements.
 * This internal factory generates components for subtotal, discount, shipping, tax, and total prices
 * with consistent behavior and styling patterns.
 *
 * @internal
 * @param config - Configuration object for the price component
 * @param config.priceProp - The property key from cart summary to display (e.g., 'subtotal', 'total')
 * @param config.shouldRender - Function to determine if the component should render based on cart state
 * @param config.isDiscount - Whether this represents a discount amount (will be displayed with negative sign)
 * @returns A React component that displays the specified price information
 */
const PricePartFactory = ({
  priceProp,
  shouldRender = () => true,
  isDiscount = false,
}: {
  /** The key from the cart summary's amountValues to display */
  priceProp: keyof CoreSummaryRenderProps['amountValues'];
  /** Function to determine if this price component should render */
  shouldRender?: (renderProps: CoreSummaryRenderProps) => boolean;
  /** Whether to format as a discount (with negative sign) */
  isDiscount?: boolean;
}) =>
  React.forwardRef<HTMLDivElement, CartPriceProps>(
    ({ asChild, children, className, label, ...props }, ref) => {
      return (
        <CoreSummary>
          {(renderProps) => {
            const { amountValues, currency, isTotalsLoading } = renderProps;
            const total = renderProps[priceProp];
            if (!total || !shouldRender(renderProps)) {
              return null;
            }

            const price = {
              amount: amountValues[priceProp],
              currency: currency,
            };

            if (asChild && children && typeof children === 'function') {
              return children(
                {
                  price,
                  formattedPrice: total,
                  isLoading: isTotalsLoading,
                  label,
                },
                ref,
              );
            }

            return (
              <AsChildSlot
                asChild={asChild}
                customElement={children}
                customElementProps={{
                  price,
                  formattedPrice: total,
                  isLoading: isTotalsLoading,
                  label,
                }}
                ref={ref}
                className={className}
                {...props}
              >
                {label && <span>{label}</span>}
                {isTotalsLoading ? (
                  <span>...</span>
                ) : (
                  <span>{isDiscount ? `-${total}` : total}</span>
                )}
              </AsChildSlot>
            );
          }}
        </CoreSummary>
      );
    },
  );

/**
 * Cart subtotal price component that displays the sum of all items before taxes, shipping, and discounts.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Cart.Totals.Price label="Subtotal:" />
 *
 * // Custom rendering with asChild
 * <Cart.Totals.Price asChild>
 *   {({ price, formattedPrice, isLoading }, ref) => (
 *     <div ref={ref} className="flex justify-between">
 *       <span>Subtotal</span>
 *       <span>{isLoading ? '...' : formattedPrice}</span>
 *     </div>
 *   )}
 * </Cart.Totals.Price>
 * ```
 */
const Price = PricePartFactory({ priceProp: 'subtotal' });

/**
 * Cart discount amount component that displays the discount applied from coupons.
 * Only renders when a coupon is applied to the cart.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering (only shows when coupon applied)
 * <Cart.Totals.Discount label="Discount:" />
 *
 * // Custom rendering with asChild
 * <Cart.Totals.Discount asChild>
 *   {({ price, formattedPrice, isLoading }, ref) => (
 *     <div ref={ref} className="text-green-600">
 *       <span>Savings: </span>
 *       <span>{isLoading ? '...' : formattedPrice}</span>
 *     </div>
 *   )}
 * </Cart.Totals.Discount>
 * ```
 */
const Discount = PricePartFactory({
  priceProp: 'discount',
  shouldRender: (renderProps) => !!renderProps.appliedCoupon,
  isDiscount: true,
});

/**
 * Cart shipping cost component that displays the calculated shipping fee.
 * Not rendered when there is no shipping cost for the cart.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Cart.Totals.Shipping label="Shipping:" />
 *
 * // Custom rendering with conditional display
 * <Cart.Totals.Shipping asChild>
 *   {({ price, formattedPrice, isLoading }, ref) => (
 *     <div ref={ref}>
 *       <span>Shipping: </span>
 *       <span>{price.amount === 0 ? 'FREE' : (isLoading ? '...' : formattedPrice)}</span>
 *     </div>
 *   )}
 * </Cart.Totals.Shipping>
 * ```
 */
const Shipping = PricePartFactory({ priceProp: 'shipping' });

/**
 * Cart tax amount component that displays the calculated tax for the order.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Cart.Totals.Tax label="Tax:" />
 *
 * // Custom rendering with percentage display
 * <Cart.Totals.Tax asChild>
 *   {({ price, formattedPrice, isLoading }, ref) => (
 *     <div ref={ref} className="text-sm text-gray-600">
 *       <span>Tax: </span>
 *       <span>{isLoading ? '...' : formattedPrice}</span>
 *     </div>
 *   )}
 * </Cart.Totals.Tax>
 * ```
 */
const Tax = PricePartFactory({ priceProp: 'tax' });

/**
 * Cart total price component that displays the final amount to be charged.
 * This includes all items, taxes, shipping, and applies any discounts.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Cart.Totals.Total label="Total:" />
 *
 * // Custom rendering with emphasis
 * <Cart.Totals.Total asChild>
 *   {({ price, formattedPrice, isLoading }, ref) => (
 *     <div ref={ref} className="font-bold text-lg border-t pt-2">
 *       <span>Total: </span>
 *       <span>{isLoading ? 'Calculating...' : formattedPrice}</span>
 *     </div>
 *   )}
 * </Cart.Totals.Total>
 * ```
 */
const Total = PricePartFactory({ priceProp: 'total' });

/**
 * Namespace containing all cart pricing/totals components.
 * These components provide a consistent way to display different aspects of cart pricing
 * including subtotal, discounts, shipping, tax, and final total.
 *
 * All components support the asChild pattern for flexible styling and composition.
 * They automatically handle loading states and conditional rendering based on cart state.
 *
 * @namespace
 * @example
 * ```tsx
 * // Basic cart totals display
 * function CartSummary() {
 *   return (
 *     <div className="cart-totals">
 *       <Cart.Totals.Price label="Subtotal:" />
 *       <Cart.Totals.Discount label="Discount:" />
 *       <Cart.Totals.Shipping label="Shipping:" />
 *       <Cart.Totals.Tax label="Tax:" />
 *       <hr />
 *       <Cart.Totals.Total label="Total:" />
 *     </div>
 *   );
 * }
 *
 * // Custom styled totals with asChild
 * function StyledCartTotals() {
 *   return (
 *     <div className="space-y-2">
 *       <Cart.Totals.Price asChild>
 *         {({ formattedPrice, isLoading }, ref) => (
 *           <div ref={ref} className="flex justify-between">
 *             <span>Items:</span>
 *             <span>{isLoading ? '...' : formattedPrice}</span>
 *           </div>
 *         )}
 *       </Cart.Totals.Price>
 *
 *       <Cart.Totals.Total asChild>
 *         {({ formattedPrice, isLoading }, ref) => (
 *           <div ref={ref} className="flex justify-between font-bold text-lg">
 *             <span>Total:</span>
 *             <span>{isLoading ? 'Calculating...' : formattedPrice}</span>
 *           </div>
 *         )}
 *       </Cart.Totals.Total>
 *     </div>
 *   );
 * }
 * ```
 */
export const Totals = {
  /** Cart subtotal before taxes, shipping, and discounts */
  Price,
  /** Discount amount from applied coupons (only shows when coupon applied) */
  Discount,
  /** Shipping cost for the order */
  Shipping,
  /** Tax amount for the order */
  Tax,
  /** Final total including all charges and discounts */
  Total,
} as const;

interface ErrorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Render prop function that receives error data */
  children?: AsChildChildren<{
    /** Error message to display */
    error: string;
  }>;
}

export const Errors = React.forwardRef<HTMLDivElement, ErrorProps>(
  ({ asChild, children, className, ...props }, ref) => {
    return (
      <CoreCheckout>
        {(renderProps) => {
          if (!renderProps.error) {
            return null;
          }

          return (
            <AsChildSlot
              asChild={asChild}
              customElement={children}
              customElementProps={{
                error: renderProps.error,
              }}
              ref={ref}
              className={className}
              data-testid={TestIds.cartErrors}
              {...props}
            >
              {renderProps.error}
            </AsChildSlot>
          );
        }}
      </CoreCheckout>
    );
  },
);
