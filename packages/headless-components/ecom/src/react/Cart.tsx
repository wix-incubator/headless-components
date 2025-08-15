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
  OpenTrigger as CoreOpenTrigger,
  LineItemsList as CoreLineItemsList,
  Item as CoreItem,
  Summary as CoreSummary,
  SummaryRenderProps as CoreSummaryRenderProps,
  Content as CoreContent,
  Clear as CoreClear,
  Checkout as CoreCheckout,
  Notes as CoreNotes,
  Coupon as CoreCoupon,
  LineItemAdded as CoreLineItemAdded,
} from './core/CurrentCart.js';
import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import { CurrentCartServiceDefinition } from '../services/current-cart-service.js';
import type { LineItem } from '../services/common-types.js';
import { Slot } from '@radix-ui/react-slot';
import { renderAsChild, renderChildren } from '../utils/asChild.js';
import * as LineItemComponent from './LineItem.js';

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
  cartNotes = 'cart-notes',
  cartCoupon = 'cart-coupon',
  couponInput = 'coupon-input',
  couponTrigger = 'coupon-trigger',
  couponClear = 'coupon-clear',
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
  children: ((props: {}) => React.ReactNode) | React.ReactNode;
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
    const Comp = asChild && children ? Slot : 'p';

    return (
      <CoreEmptyState>
        <Comp ref={ref} data-testid={TestIds.cartEmptyState}>
          {asChild && children
            ? renderChildren({
                children,
                props: {},
                ref,
              })
            : 'No items in cart'}
        </Comp>
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
 * Headless component for cart trigger with item count.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default button
 * <Cart.OpenTrigger>
 *   {({ totalItems, open, isLoading }) => (
 *     <span>
 *       Cart ({totalItems})
 *       <button onClick={open} disabled={isLoading}>
 *         {isLoading ? 'Loading...' : 'Open'}
 *       </button>
 *     </span>
 *   )}
 * </Cart.OpenTrigger>
 *
 * // Using asChild for custom button
 * <Cart.OpenTrigger asChild>
 *   <button className="custom-cart-button">
 *     Trigger content will be rendered here
 *   </button>
 * </Cart.OpenTrigger>
 * ```
 */
export const OpenTrigger = React.forwardRef<
  HTMLButtonElement,
  OpenTriggerProps
>(({ children, asChild, ...props }, ref) => {
  return (
    <CoreOpenTrigger>
      {(renderProps) => {
        const Comp = asChild ? Slot : 'button';
        return (
          <Comp
            ref={ref}
            onClick={renderProps.open}
            disabled={renderProps.isLoading}
            data-testid={TestIds.cartOpenTrigger}
            {...props}
          >
            {renderChildren({ children, props: renderProps, ref })}
          </Comp>
        );
      }}
    </CoreOpenTrigger>
  );
});

/**
 * Props for LineItemsList component
 */
export interface LineItemsListProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          items: LineItem[];
          totalItems: number;
        }
      >;
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

        const Comp = asChild && children ? Slot : 'div';
        return (
          <Comp ref={ref} data-testid={TestIds.cartLineItemsList} {...props}>
            {asChild && children
              ? renderChildren({ children, props: renderProps, ref })
              : null}
            <EmptyState asChild>{props.emptyState}</EmptyState>
          </Comp>
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
  children?: React.ReactNode;
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

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: { cart },
        ref,
        content: React.isValidElement(children) ? children : null,
        attributes: { 'data-testid': TestIds.cartLineItems, ...otherProps },
      });
      if (rendered) return rendered;
    }

    return (
      <div ref={ref as any} data-testid={TestIds.cartLineItems} {...otherProps}>
        {React.isValidElement(children) ? children : null}
      </div>
    );
  },
);

export interface LineItemRepeaterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: React.ReactNode;
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

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { items },
      ref,
      content,
      attributes: {
        'data-testid': TestIds.cartLineItemRepeater,
        className,
        ...otherProps,
      },
    });
    if (rendered) return rendered;
  }

  return (
    <div
      ref={ref as any}
      data-testid={TestIds.cartLineItemRepeater}
      className={className}
      {...otherProps}
    >
      {content}
    </div>
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
  /** Whether cart content is open */
  isOpen: boolean;
  /** Function to close cart */
  close: () => void;
  /** Whether cart is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export const Content = (props: ContentProps) => {
  return <CoreContent>{props.children}</CoreContent>;
};

/**
 * Props for Item component
 */
export interface ItemProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Line item data */
  item: LineItem;
  /** Render prop function that receives item data */
  children: (props: {
    /** Current quantity */
    quantity: number;
    /** Product title */
    title: string;
    /** Product image URL */
    image: string | null;
    /** Line item price */
    price: string;
    /** Selected product options */
    selectedOptions: Array<{
      name: string;
      value: string | { name: string; code: string };
    }>;
    /** Function to increase quantity */
    increaseQuantity: () => Promise<void>;
    /** Function to decrease quantity */
    decreaseQuantity: () => Promise<void>;
    /** Function to remove item */
    remove: () => Promise<void>;
    /** Whether item is loading */
    isLoading: boolean;
  }) => React.ReactNode;
  /** CSS class name */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Headless component for individual cart item.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default div wrapper
 * <Cart.Item item={item}>
 *   {({ quantity, title, price, increaseQuantity, decreaseQuantity, remove }) => (
 *     <div>
 *       <h3>{title}</h3>
 *       <p>{price}</p>
 *       <div>
 *         <button onClick={decreaseQuantity}>-</button>
 *         <span>{quantity}</span>
 *         <button onClick={increaseQuantity}>+</button>
 *         <button onClick={remove}>Remove</button>
 *       </div>
 *     </div>
 *   )}
 * </Cart.Item>
 *
 * // Using asChild for custom wrapper
 * <Cart.Item item={item} asChild>
 *   <article className="cart-item">
 *     Item content will be rendered here
 *   </article>
 * </Cart.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ asChild, children, item, ...props }, ref) => {
    return (
      <CoreItem item={item}>
        {(renderProps) => {
          const Comp = asChild && children ? Slot : 'div';
          return (
            <Comp ref={ref} data-testid={TestIds.cartItem} {...props}>
              {asChild && children
                ? renderChildren({ children, props: renderProps, ref })
                : children(renderProps)}
            </Comp>
          );
        }}
      </CoreItem>
    );
  },
);

/**
 * Props for Summary component
 */
export interface SummaryProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Render prop function that receives summary data */
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLDivElement,
        {
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
        }
      >;
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
          const Comp = asChild ? Slot : 'div';
          return (
            <Comp ref={ref} data-testid={TestIds.cartSummary} {...props}>
              {renderChildren({ children, props: renderProps, ref })}
            </Comp>
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
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          clear: () => Promise<void>;
          totalItems: number;
          isLoading: boolean;
        }
      >;
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
          const Comp = asChild ? Slot : 'button';
          return (
            <Comp
              ref={ref}
              onClick={renderProps.clear}
              disabled={renderProps.isLoading}
              data-testid={TestIds.cartClear}
              {...props}
            >
              {renderChildren({ children, props: renderProps, ref })}
            </Comp>
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
  children: (props: {
    /** Function to proceed to checkout */
    proceedToCheckout: () => Promise<void>;
    /** Whether checkout is available */
    canCheckout: boolean;
    /** Whether checkout action is loading */
    isLoading: boolean;
    /** Error message if checkout fails */
    error: string | null;
  }) => React.ReactNode;
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
          const Comp = asChild ? Slot : 'button';
          return (
            <Comp
              ref={ref}
              onClick={renderProps.proceedToCheckout}
              disabled={!renderProps.canCheckout || renderProps.isLoading}
              data-testid={TestIds.cartCheckout}
              {...props}
            >
              {children(renderProps)}
            </Comp>
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
  children?: (props: {
    /** Current notes value */
    notes: string;
    /** Function to update notes */
    updateNotes: (notes: string) => Promise<void>;
  }) => React.ReactNode;
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
          const Comp = asChild && children ? Slot : 'div';
          return (
            <Comp ref={ref} data-testid={TestIds.cartNotes} {...props}>
              {asChild && children ? (
                renderChildren({ children, props: renderProps, ref })
              ) : (
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
              )}
            </Comp>
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

/**
 * Props for Coupon.Input component
 */
export interface CouponInputProps {
  asChild?: boolean;
  placeholder?: string;
  className?: string;
  children?: React.ForwardRefRenderFunction<
    HTMLInputElement,
    {
      value: string;
      onChange: (value: string) => void;
    }
  >;
}

/**
 * Coupon code input field.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Cart.Coupon.Input
 *   value={couponCode}
 *   onChange={setCouponCode}
 *   placeholder="Enter coupon code"
 *   className="px-3 py-2 border rounded-lg"
 * />
 *
 * // Custom rendering with forwardRef
 * <Cart.Coupon.Input asChild value={couponCode} onChange={setCouponCode}>
 *   {React.forwardRef(({value, onChange, ...props}, ref) => (
 *     <input
 *       ref={ref}
 *       {...props}
 *       type="text"
 *       value={value}
 *       onChange={(e) => onChange(e.target.value)}
 *       className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
 *     />
 *   ))}
 * </Cart.Coupon.Input>
 * ```
 */
const CouponInput = React.forwardRef<HTMLInputElement, CouponInputProps>(
  (
    {
      asChild,
      children,
      placeholder = 'Enter coupon code',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <CoreCoupon>
        {(renderProps) => {
          const { appliedCoupon, apply } = renderProps;

          const inputProps = {
            value: appliedCoupon || '',
            onChange: (value: string) => apply(value),
          };

          const Comp = asChild ? Slot : 'input';

          return (
            <Comp
              ref={ref}
              type={'text'}
              value={inputProps.value}
              onChange={(e) => apply(e.target.value)}
              placeholder={placeholder}
              className={className}
              data-testid={TestIds.couponInput}
              {...props}
            >
              {asChild && children
                ? renderChildren({ children, props: inputProps, ref })
                : null}
            </Comp>
          );
        }}
      </CoreCoupon>
    );
  },
);

/**
 * Props for Coupon.Trigger component
 */
export interface CouponTriggerProps {
  asChild?: boolean;
  className?: string;
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          disabled: boolean;
          isLoading: boolean;
          appliedCoupon: string | null;
          onClick: () => Promise<void>;
          apply: (value: string) => Promise<void>;
        }
      >;
}

/**
 * Apply coupon button.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Cart.Coupon.Trigger couponCode={inputValue} className="btn-primary px-4 py-2">Apply</Cart.Coupon.Trigger>
 *
 * // Custom rendering with forwardRef
 * <Cart.Coupon.Trigger asChild couponCode={inputValue}>
 *   {React.forwardRef(({apply, disabled, isLoading, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       disabled={disabled}
 *       onClick={() => apply(couponCode)}
 *       className="btn-primary px-4 py-2 disabled:opacity-50"
 *     >
 *       {isLoading ? 'Applying...' : 'Apply'}
 *     </button>
 *   ))}
 * </Cart.Coupon.Trigger>
 * ```
 */
const CouponTrigger = React.forwardRef<HTMLButtonElement, CouponTriggerProps>(
  ({ asChild, children, className, ...props }, ref) => {
    return (
      <CoreCoupon>
        {(renderProps) => {
          const { apply, isLoading, appliedCoupon } = renderProps;
          const disabled = isLoading;

          const triggerProps = {
            disabled,
            isLoading,
            apply,
            appliedCoupon,
            onClick: async () => {
              await apply(appliedCoupon ?? '');
            },
          };

          const Comp = asChild ? Slot : 'button';

          return (
            <Comp
              ref={ref}
              onClick={triggerProps.onClick}
              disabled={disabled}
              className={className}
              data-testid={TestIds.couponTrigger}
              data-loading={isLoading}
              {...props}
            >
              {asChild && typeof children === 'function'
                ? renderChildren({
                    children: children as any,
                    props: triggerProps,
                    ref,
                  })
                : !asChild && typeof children !== 'function'
                  ? children || (isLoading ? 'Applying...' : 'Apply')
                  : null}
            </Comp>
          );
        }}
      </CoreCoupon>
    );
  },
);

/**
 * Props for Coupon.Clear component
 */
export interface CouponClearProps {
  asChild?: boolean;
  className?: string;
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          onClick: () => Promise<void>;
        }
      >;
}

/**
 * Remove applied coupon button.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Cart.Coupon.Clear className="text-sm text-content-muted hover:text-content-primary">Remove</Cart.Coupon.Clear>
 *
 * // Custom rendering with forwardRef
 * <Cart.Coupon.Clear asChild>
 *   {React.forwardRef(({remove, appliedCoupon, isLoading, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={remove}
 *       disabled={!appliedCoupon || isLoading}
 *       className="text-sm text-content-muted hover:text-content-primary underline"
 *     >
 *       {isLoading ? 'Removing...' : 'Remove coupon'}
 *     </button>
 *   ))}
 * </Cart.Coupon.Clear>
 * ```
 */
const CouponClear = React.forwardRef<HTMLButtonElement, CouponClearProps>(
  ({ asChild, children, className, ...props }, ref) => {
    return (
      <CoreCoupon>
        {(renderProps) => {
          const { remove, appliedCoupon, isLoading } = renderProps;
          const disabled = !appliedCoupon || isLoading;

          const clearProps = {
            onClick: remove,
          };

          // Only render if there's an applied coupon
          if (!appliedCoupon) {
            return null;
          }

          const Comp = asChild ? Slot : 'button';

          return (
            <Comp
              ref={ref}
              onClick={remove}
              disabled={disabled}
              className={className}
              data-testid={TestIds.couponClear}
              {...props}
            >
              {asChild && typeof children === 'function'
                ? renderChildren({
                    children: children as any,
                    props: clearProps,
                    ref,
                  })
                : !asChild && typeof children !== 'function'
                  ? children || (isLoading ? 'Removing...' : 'Remove')
                  : null}
            </Comp>
          );
        }}
      </CoreCoupon>
    );
  },
);

// ===== NOTE SUB-COMPONENTS =====

/**
 * Props for Note.Input component
 */
export interface NoteInputProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: React.ForwardRefRenderFunction<
    HTMLTextAreaElement,
    {
      value: string;
      onChange: (value: string) => void;
    }
  >;
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

          const noteProps = {
            value: notes || '',
            onChange: updateNotes,
          };

          if (asChild && children) {
            return children(noteProps, ref);
          }

          return (
            <textarea
              ref={ref}
              value={notes || ''}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              data-testid={TestIds.cartNoteInput}
              {...props}
            />
          );
        }}
      </CoreNotes>
    );
  },
);

// ===== NESTED NAMESPACE EXPORTS =====

/**
 * Coupon-related components namespace
 */
export const Coupon = {
  Input: CouponInput,
  Trigger: CouponTrigger,
  Clear: CouponClear,
} as const;

/**
 * Note-related components namespace
 */
export const Note = {
  Input: NoteInput,
} as const;

export interface Money {
  amount: number;
  currency: string;
}

export interface CartPriceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLDivElement,
    {
      price: Money;
      formattedPrice: string;
      isLoading: boolean;
      label?: string;
    }
  >;
  label?: string;
}

const PricePartFactory = ({
  priceProp,
  shouldRender = () => true,
  isDiscount = false,
}: {
  priceProp: keyof CoreSummaryRenderProps['amountValues'];
  shouldRender?: (renderProps: CoreSummaryRenderProps) => boolean;
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

            const Comp = asChild ? Slot : 'div';

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
              <Comp ref={ref} className={className} {...props}>
                {label && <span>{label}</span>}
                {isTotalsLoading ? (
                  <span>...</span>
                ) : (
                  <span>{isDiscount ? `-${total}` : total}</span>
                )}
              </Comp>
            );
          }}
        </CoreSummary>
      );
    },
  );

const Price = PricePartFactory({ priceProp: 'subtotal' });
const Discount = PricePartFactory({
  priceProp: 'discount',
  shouldRender: (renderProps) => !!renderProps.appliedCoupon,
  isDiscount: true,
});
const Shipping = PricePartFactory({ priceProp: 'shipping' });
const Tax = PricePartFactory({ priceProp: 'tax' });
const Total = PricePartFactory({ priceProp: 'total' });

export const Totals = {
  Price,
  Discount,
  Shipping,
  Tax,
  Total,
} as const;
