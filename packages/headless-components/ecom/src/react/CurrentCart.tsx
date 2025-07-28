import type { ServiceAPI } from "@wix/services-definitions";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
  CurrentCartServiceConfig,
  type LineItem,
} from "../services/current-cart-service.js";
import { createServicesMap } from "@wix/services-manager";
import * as currentCart from "@wix/auto_sdk_ecom_current-cart";
import { media } from "@wix/sdk";

export interface RootProps {
  children: React.ReactNode;
  currentCartServiceConfig: CurrentCartServiceConfig;
}

/**
 * Root component that provides the CurrentCart service context to its children.
 * This component sets up the necessary services for managing current cart functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { CurrentCart } from '@wix/ecom/components';
 *
 * function CartProvider() {
 *   return (
 *     <CurrentCart.Root>
 *       <div>
 *         <CurrentCart.OpenTrigger>
 *           {({ totalItems, open }) => (
 *             <button onClick={open}>
 *               Cart ({totalItems})
 *             </button>
 *           )}
 *         </CurrentCart.OpenTrigger>
 *
 *         <CurrentCart.Content>
 *           {({ cart, isLoading }) => (
 *             <div>
 *               {isLoading ? 'Loading...' : 'Cart loaded'}
 *             </div>
 *           )}
 *         </CurrentCart.Content>
 *       </div>
 *     </CurrentCart.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        props.currentCartServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for EmptyState headless component
 */
export interface EmptyStateProps {
  /** Content to display when cart is empty (can be a render function or ReactNode) */
  children: ((props: EmptyStateRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for EmptyState component
 */
export interface EmptyStateRenderProps {}

/**
 * Component that renders content when the cart is empty.
 * Only displays its children when there are no items in cart, no loading state, and no errors.
 *
 * @component
 * @example
 * ```tsx
 * import { CurrentCart } from '@wix/ecom/components';
 *
 * function EmptyCartMessage() {
 *   return (
 *     <CurrentCart.EmptyState>
 *       {() => (
 *         <div className="empty-state">
 *           <h3>No items in cart</h3>
 *           <p>Items will appear here once they are added</p>
 *         </div>
 *       )}
 *     </CurrentCart.EmptyState>
 *   );
 * }
 * ```
 */
export function EmptyState(props: EmptyStateProps) {
  const { isLoading, error, cart } = useService(
    CurrentCartServiceDefinition,
  );
  const isLoadingValue = isLoading.get();
  const errorValue = error.get();
  const cartValue = cart.get();

  if (!isLoadingValue && !errorValue && cartValue?.lineItems?.length === 0) {
    return typeof props.children === "function"
      ? props.children({})
      : props.children;
  }

  return null;
}


/**
 * Helper function to format currency properly
 */
function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

/**
 * Props for Trigger headless component
 */
export interface OpenTriggerProps {
  /** Render prop function that receives trigger data */
  children: (props: OpenTriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for Trigger component
 */
export interface OpenTriggerRenderProps {
  /** Number of items in cart */
  totalItems: number;
  /** Function to open cart */
  open: () => void;
  /** Whether cart is currently loading */
  isLoading: boolean;
}

/**
 * Headless component for cart trigger with item count
 *
 * @example
 * ```tsx
 * <CurrentCart.OpenTrigger>
 *   {({ totalItems, open, isLoading }) =>
 *     isLoading ? (
 *       <div>Loading Cart...</div>
 *     ) : (
 *       <div>
 *         <h1>Cart ({totalItems} items)</h1>
 *         <button onClick={open}>Open Cart</button>
 *       </div>
 *     )
 *   }
 * </CurrentCart.OpenTrigger>
 * ```
 */
export const OpenTrigger = (props: OpenTriggerProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const totalItems = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    totalItems,
    open: service.openCart,
    isLoading,
  });
};

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
  /** Cart data */
  cart: currentCart.Cart | null;
  /** Whether cart is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for cart content/modal
 *
 * @example
 * // Complete cart implementation with essential headless features
 * <CurrentCart.Content>
 *   {({ cart, isLoading }) => (
 *     <div>
 *       <CurrentCart.OpenTrigger>
 *         {({ totalItems }) => <h1>Cart ({totalItems} items)</h1>}
 *       </CurrentCart.OpenTrigger>
 *
 *       {isLoading && <p>Loading cart...</p>}
 *
 *       <CurrentCart.LineItemsList>
 *         {({ items, totalItems }) => (
 *           <>
 *             {items.length === 0 ? (
 *               <p>Your cart is empty</p>
 *             ) : (
 *               <>
 *                 <CurrentCart.Clear>
 *                   {({ clear, totalItems, isLoading }) => (
 *                     totalItems > 0 && (
 *                       <button onClick={clear} disabled={isLoading}>
 *                         {isLoading ? 'Clearing...' : 'Clear Cart'}
 *                       </button>
 *                     )
 *                   )}
 *                 </CurrentCart.Clear>
 *
 *                 {items.map((item) => (
 *                   <CurrentCart.Item key={item._id} item={item}>
 *                     {({
 *                       title,
 *                       image,
 *                       price,
 *                       quantity,
 *                       selectedOptions,
 *                       increaseQuantity,
 *                       decreaseQuantity,
 *                       remove,
 *                       isLoading: itemLoading
 *                     }) => (
 *                       <div>
 *                         <h3>{title}</h3>
 *                         <p>{price}</p>
 *
 *                         {selectedOptions.map((option, index) => (
 *                           <span key={index}>
 *                             {option.name}: {typeof option.value === 'object' ? option.value.name : option.value}
 *                           </span>
 *                         ))}
 *
 *                         <button onClick={decreaseQuantity} disabled={itemLoading || quantity <= 1}>-</button>
 *                         <span>{quantity}</span>
 *                         <button onClick={increaseQuantity} disabled={itemLoading}>+</button>
 *
 *                         <button onClick={remove} disabled={itemLoading}>
 *                           {itemLoading ? 'Removing...' : 'Remove'}
 *                         </button>
 *                       </div>
 *                     )}
 *                   </CurrentCart.Item>
 *                 ))}
 *
 *                 <CurrentCart.Notes>
 *                   {({ notes, updateNotes }) => (
 *                     <textarea
 *                       value={notes}
 *                       onChange={e => updateNotes(e.target.value)}
 *                       placeholder="Special instructions for your order"
 *                     />
 *                   )}
 *                 </CurrentCart.Notes>
 *
 *                 <CurrentCart.Coupon>
 *                   {({ appliedCoupon, apply, remove, isLoading }) => (
 *                     <div>
 *                       {appliedCoupon ? (
 *                         <div>
 *                           <span>Coupon: {appliedCoupon}</span>
 *                           <button onClick={remove} disabled={isLoading}>
 *                             {isLoading ? 'Removing...' : 'Remove'}
 *                           </button>
 *                         </div>
 *                       ) : (
 *                         <form onSubmit={e => {
 *                           e.preventDefault();
 *                           const code = new FormData(e.currentTarget).get('couponCode');
 *                           if (code?.trim()) apply(code.trim());
 *                         }}>
 *                           <input name="couponCode" placeholder="Enter promo code" disabled={isLoading} />
 *                           <button type="submit" disabled={isLoading}>
 *                             {isLoading ? 'Applying...' : 'Apply'}
 *                           </button>
 *                         </form>
 *                       )}
 *                     </div>
 *                   )}
 *                 </CurrentCart.Coupon>
 *
 *                 <CurrentCart.Summary>
 *                   {({ subtotal, discount, appliedCoupon, shipping, tax, total, currency, itemCount, canCheckout, isTotalsLoading }) => (
 *                     <div>
 *                       <div>Subtotal ({itemCount} items): {isTotalsLoading ? 'Calculating...' : subtotal}</div>
 *                       {discount && <div>Discount: -{discount}</div>}
 *                       {appliedCoupon && <div>Applied Coupon: {appliedCoupon}</div>}
 *                       <div>Shipping: {isTotalsLoading ? 'Calculating...' : shipping}</div>
 *                       <div>Tax: {isTotalsLoading ? 'Calculating...' : tax}</div>
 *                       <div>Total: {isTotalsLoading ? 'Calculating...' : total}</div>
 *                       <div>Currency: {currency}</div>
 *                       <div>Can Checkout: {canCheckout ? 'Yes' : 'No'}</div>
 *                     </div>
 *                   )}
 *                 </CurrentCart.Summary>
 *
 *                 <CurrentCart.Checkout>
 *                   {({ proceedToCheckout, canCheckout, isLoading: checkoutLoading, error }) => (
 *                     <div>
 *                       {error && <p>Error: {error}</p>}
 *                       <button onClick={proceedToCheckout} disabled={!canCheckout || checkoutLoading}>
 *                         {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
 *                       </button>
 *                     </div>
 *                   )}
 *                 </CurrentCart.Checkout>
 *               </>
 *             )}
 *           </>
 *         )}
 *       </CurrentCart.LineItemsList>
 *     </div>
 *   )}
 * </CurrentCart.Content>
 */
export const Content = (props: ContentProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const isOpen = service.isOpen.get();
  const cart = service.cart.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    isOpen,
    close: service.closeCart,
    cart,
    isLoading,
    error,
  });
};

/**
 * Props for Items headless component
 */
export interface LineItemsListProps {
  /** Render prop function that receives items data */
  children: (props: LineItemsListRenderProps) => React.ReactNode;
}

/**
 * Render props for Items component
 */
export interface LineItemsListRenderProps {
  /** Array of line items in cart */
  items: LineItem[];
  /** Total number of items */
  totalItems: number;
}

/**
 * Headless component for cart items collection
 *
 * @example
 * ```tsx
 * <CurrentCart.LineItemsList>
 *   {({ items, totalItems }) => (
 *     <div>
 *       <h1>Cart ({totalItems} items)</h1>
 *       <p>Items: {items.length}</p>
 *       <p>Has items: {items.length > 0 ? 'Yes' : 'No'}</p>
 *     </div>
 *   )}
 * </CurrentCart.LineItemsList>
 * ```
 */
export const LineItemsList = (props: LineItemsListProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const items = cart?.lineItems || [];
  const totalItems = service.cartCount.get();

  return props.children({
    items,
    totalItems,
  });
};

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Line item data */
  item: LineItem;
  /** Render prop function that receives item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

export interface SelectedOption {
  name: string;
  value: string | { name: string; code: string };
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Current quantity */
  quantity: number;
  /** Product title */
  title: string;
  /** Product image URL */
  image: string | null;
  /** Line item price */
  price: string;
  /** Selected product options */
  selectedOptions: Array<SelectedOption>;
  /** Function to increase quantity */
  increaseQuantity: () => Promise<void>;
  /** Function to decrease quantity */
  decreaseQuantity: () => Promise<void>;
  /** Function to remove item */
  remove: () => Promise<void>;
  /** Whether item is loading */
  isLoading: boolean;
}

/**
 * Headless component for individual cart item
 *
 * @example
 * ```tsx
 * <CurrentCart.Item item={item}>
 *   {({ quantity, title, image, price, selectedOptions, increaseQuantity, decreaseQuantity, remove, isLoading }) => (
 *     <div>
 *       <h3>{title}</h3>
 *       <p>{price}</p>
 *       <p>{quantity}</p>
 *       <p>{image}</p>
 *       <p>{selectedOptions}</p>
 *       <button onClick={increaseQuantity}>Increase</button>
 *       <button onClick={decreaseQuantity}>Decrease</button>
  *      <button onClick={remove}>Remove</button>
 *     </div>
 *   )}
 * </CurrentCart.Item>
 * ```
 */
export const Item = (props: ItemProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const item = props.item;
  const isLoading = service.isLoading.get();

  if (!item) {
    const currency = cart?.currency || "USD";
    return props.children({
      quantity: 0,
      title: "",
      image: null,
      price: formatCurrency(0, currency),
      selectedOptions: [],
      increaseQuantity: async () => {},
      decreaseQuantity: async () => {},
      remove: async () => {},
      isLoading: false,
    });
  }

  // Fix image URL access - properly handle null/undefined image
  let image: string | null = null;
  if (item.image) {
    try {
      image = media.getImageUrl(item.image).url;
    } catch (error) {
      console.warn("Failed to get image URL:", error);
      image = null;
    }
  }

  // Extract variant information from description lines
  const selectedOptions: Array<{
    name: string;
    value: string | { name: string; code: string };
  }> = [];

  if (item.descriptionLines) {
    item.descriptionLines.forEach((line: any) => {
      if (line.name?.original) {
        const optionName = line.name.original;

        if (line.colorInfo) {
          selectedOptions.push({
            name: optionName,
            value: {
              name: line.colorInfo.original,
              code: line.colorInfo.code,
            },
          });
        } else if (line.plainText) {
          selectedOptions.push({
            name: optionName,
            value: line.plainText.original,
          });
        }
      }
    });
  }

  // Calculate total price for this line item (unit price × quantity)
  const unitPrice = parseFloat(item.price?.amount || "0");
  const quantity = item.quantity || 0;
  const totalPrice = unitPrice * quantity;
  const currency = cart?.currency || "USD";

  // Format price with proper currency
  const formattedPrice = formatCurrency(totalPrice, currency);

  const lineItemId = item._id || "";

  return props.children({
    quantity,
    title: item.productName?.original || "",
    image,
    price: formattedPrice,
    selectedOptions,
    increaseQuantity: () => service.increaseLineItemQuantity(lineItemId),
    decreaseQuantity: () => service.decreaseLineItemQuantity(lineItemId),
    remove: () => service.removeLineItem(lineItemId),
    isLoading,
  });
};

/**
 * Props for Summary headless component
 */
export interface SummaryProps {
  /** Render prop function that receives summary data */
  children: (props: SummaryRenderProps) => React.ReactNode;
}

/**
 * Render props for Summary component
 */
export interface SummaryRenderProps {
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
  itemCount: number;
  /** Whether totals are being calculated */
  isTotalsLoading: boolean;
}

/**
 * Headless component for cart summary/totals
 *
 * @example
 * ```tsx
 * <CurrentCart.Summary>
 *   {({ subtotal, discount, appliedCoupon, shipping, tax, total, currency, itemCount, canCheckout, isTotalsLoading }) => (
 *     <div>
 *       <h1>Cart Summary</h1>
 *       <p>Subtotal: {subtotal}</p>
 *       <p>Discount: {discount}</p>
 *       <p>Applied Coupon: {appliedCoupon}</p>
 *       <p>Shipping: {shipping}</p>
 *       <p>Tax: {tax}</p>
 *       <p>Total: {total}</p>
 *       <p>Currency: {currency}</p>
 *       <p>Item Count: {itemCount}</p>
 *       <p>Is Totals Loading: {isTotalsLoading ? 'Yes' : 'No'}</p>
 *     </div>
 *   )}
 * </CurrentCart.Summary>
 * ```
 */
export const Summary = (props: SummaryProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const itemCount = service.cartCount.get();
  const cartTotals = service.cartTotals.get();
  const isTotalsLoading = service.isTotalsLoading.get();
  const currency = cart?.currency || cartTotals?.currency || "USD";

  // Use SDK totals only
  const totals = cartTotals?.priceSummary || {};
  const subtotal = formatCurrency(
    parseFloat(totals.subtotal?.amount || "0"),
    currency,
  );
  const shipping = formatCurrency(
    parseFloat(totals.shipping?.amount || "0"),
    currency,
  );
  const tax = formatCurrency(parseFloat(totals.tax?.amount || "0"), currency);
  const total = formatCurrency(
    parseFloat(totals.total?.amount || "0"),
    currency,
  );

  const appliedCoupon =
    cart?.appliedDiscounts?.find((discount: any) => discount.coupon?.code)
      ?.coupon?.code || null;

  // Calculate discount from totals if available
  const discount = totals.discount?.amount
    ? formatCurrency(parseFloat(totals.discount.amount), currency)
    : null;

  return props.children({
    subtotal,
    discount,
    appliedCoupon,
    shipping,
    tax,
    total,
    currency,
    itemCount,
    isTotalsLoading,
  });
};

/**
 * Props for Clear headless component
 */
export interface ClearProps {
  /** Render prop function that receives clear action */
  children: (props: ClearRenderProps) => React.ReactNode;
}

/**
 * Render props for Clear component
 */
export interface ClearRenderProps {
  /** Function to clear all items from cart */
  clear: () => Promise<void>;
  /** Total number of items in cart */
  totalItems: number;
  /** Whether clear action is loading */
  isLoading: boolean;
}

/**
 * Headless component for clearing the cart
 *
 * @example
 * ```tsx
 * <CurrentCart.Clear>
 *   {({ clear, totalItems, isLoading }) => (
 *     <div>
 *       <h1>Cart Clear</h1>
 *       <p>Total items: {totalItems}</p>
 *       <p>Is loading: {isLoading ? 'Yes' : 'No'}</p>
 *       <button onClick={clear} disabled={isLoading}>Clear Cart</button>
 *     </div>
 *   )}
 * </CurrentCart.Clear>
 * ```
 */
export const Clear = (props: ClearProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    clear: service.clearCart,
    totalItems: itemCount,
    isLoading,
  });
};

/**
 * Props for Checkout headless component
 */
export interface CheckoutProps {
  /** Render prop function that receives checkout data */
  children: (props: CheckoutRenderProps) => React.ReactNode;
}

/**
 * Render props for Checkout component
 */
export interface CheckoutRenderProps {
  /** Function to proceed to checkout */
  proceedToCheckout: () => Promise<void>;
  /** Whether checkout is available */
  canCheckout: boolean;
  /** Whether checkout action is loading */
  isLoading: boolean;
  /** Error message if checkout fails */
  error: string | null;
}

/**
 * Headless component for checkout action
 *
 * @example
 * ```tsx
 * <CurrentCart.Checkout>
 *   {({ proceedToCheckout, canCheckout, isLoading, error }) => (
 *     <div>
 *       <h1>Checkout</h1>
 *       <p>Can checkout: {canCheckout ? 'Yes' : 'No'}</p>
 *       <p>Is loading: {isLoading ? 'Yes' : 'No'}</p>
 *       <p>Error: {error}</p>
 *       <button onClick={proceedToCheckout} disabled={!canCheckout || isLoading}>Proceed to Checkout</button>
 *     </div>
 *   )}
 * </CurrentCart.Checkout>
 * ```
 */
export const Checkout = (props: CheckoutProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    proceedToCheckout: service.proceedToCheckout,
    canCheckout: itemCount > 0,
    isLoading,
    error,
  });
};

/**
 * Props for Notes headless component
 */
export interface NotesProps {
  /** Render prop function that receives notes data */
  children: (props: NotesRenderProps) => React.ReactNode;
}

/**
 * Render props for Notes component
 */
export interface NotesRenderProps {
  /** Current notes value */
  notes: string;
  /** Function to update notes */
  updateNotes: (notes: string) => Promise<void>;
}

/**
 * Headless component for notes
 *
 * @example
 * ```tsx
 * <CurrentCart.Notes>
 *   {({ notes, updateNotes }) => (
 *     <textarea
 *       value={notes}
 *       onChange={e => updateNotes(e.target.value)}
 *       placeholder="Special instructions for your order"
 *     />
 *   )}
 * </CurrentCart.Notes>
 * ```
 */
export const Notes = (props: NotesProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const notes = service.buyerNotes.get();

  return props.children({
    notes,
    updateNotes: service.setBuyerNotes,
  });
};

/**
 * Props for Coupon headless component
 */
export interface CouponProps {
  /** Render prop function that receives coupon data */
  children: (props: CouponRenderProps) => React.ReactNode;
}

/**
 * Render props for Coupon component
 */
export interface CouponRenderProps {
  /** Applied coupon code if any */
  appliedCoupon: string | null;
  /** Function to apply coupon */
  apply: (code: string) => Promise<void>;
  /** Function to remove coupon */
  remove: () => Promise<void>;
  /** Whether coupon action is loading */
  isLoading: boolean;
  /** Error message if coupon operation fails */
  error: string | null;
}

/**
 * Headless component for coupon functionality
 *
 * @example
 * ```tsx
 * <CurrentCart.Coupon>
 *   {({ appliedCoupon, apply, remove, isLoading, error }) => (
 *     <div>
 *       {error && <p>Error: {error}</p>}
 *       {appliedCoupon ? (
 *         <div>
 *           <span>Coupon: {appliedCoupon}</span>
 *           <button onClick={remove} disabled={isLoading}>
 *             {isLoading ? 'Removing...' : 'Remove'}
 *           </button>
 *         </div>
 *       ) : (
 *         <form onSubmit={e => {
 *           e.preventDefault();
 *           const code = new FormData(e.currentTarget).get('couponCode');
 *           if (code?.trim()) apply(code.trim());
 *         }}>
 *           <input name="couponCode" placeholder="Enter promo code" disabled={isLoading} />
 *           <button type="submit" disabled={isLoading}>
 *             {isLoading ? 'Applying...' : 'Apply'}
 *           </button>
 *         </form>
 *       )}
 *     </div>
 *   )}
 * </CurrentCart.Coupon>
 * ```
 */
export const Coupon = (props: CouponProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const isLoading = service.isCouponLoading.get();
  const error = service.error.get();

  const appliedCoupon =
    cart?.appliedDiscounts?.find((discount: any) => discount.coupon?.code)
      ?.coupon?.code || null;

  return props.children({
    appliedCoupon,
    apply: service.applyCoupon,
    remove: service.removeCoupon,
    isLoading,
    error,
  });
};

/**
 * Props for LineItemAdded headless component
 */
export interface LineItemAddedProps {
  /** Render prop function that receives line item added subscription data */
  children: (props: LineItemAddedRenderProps) => React.ReactNode;
}

/**
 * Render props for LineItemAdded component
 */
export interface LineItemAddedRenderProps {
  /**
   * Subscribe to line item added events
   *
   * Call this function with a callback to receive notifications when items
   * are added to the cart. The callback receives the updated line items array.
   *
   * @param callback - Function called when items are added to cart. Receives array of line items or undefined
   * @returns Unsubscribe function to clean up the subscription
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   return onAddedToCart((lineItems) => {
   *     console.log('Items added:', lineItems);
   *   });
   * }, [onAddedToCart]);
   * ```
   */
  onAddedToCart: (callback: LineItemAddedCallback) => void;
}

/**
 * Callback function type for line item added events
 *
 * @param lineItems - Array of line items currently in the cart, or undefined if cart is empty
 */
export type LineItemAddedCallback = (lineItems: LineItem[] | undefined) => void;

/**
 * Headless component for line item added event subscription
 *
 * Provides a way to subscribe to cart addition events and receive notifications
 * when items are added to the current cart. The callback receives the updated
 * line items array, allowing you to show notifications, trigger animations,
 * or perform other actions when products are added.
 *
 * @example
 * ```tsx
 * // Basic usage - show global notification
 * <CurrentCart.LineItemAdded>
 *   {({ onAddedToCart }) => {
 *     useEffect(() => {
 *       return onAddedToCart((lineItems) => {
 *         setShowSuccessMessage(true);
 *         setTimeout(() => setShowSuccessMessage(false), 3000);
 *       });
 *     }, [onAddedToCart]);
 *     return null;
 *   }}
 * </CurrentCart.LineItemAdded>
 * ```
 *
 * @example
 * ```tsx
 * // Product-specific usage - show notification only for specific product
 * <CurrentCart.LineItemAdded>
 *   {({ onAddedToCart }) => {
 *     useEffect(() => {
 *       return onAddedToCart((lineItems) => {
 *         if (!lineItems) return;
 *         const myLineItemIsThere = lineItems.some(
 *           lineItem => lineItem.catalogReference?.catalogItemId === product._id
 *         );
 *         if (!myLineItemIsThere) return;
 *
 *         setShowSuccessMessage(true);
 *         setTimeout(() => setShowSuccessMessage(false), 3000);
 *       });
 *     }, [onAddedToCart, product._id]);
 *     return null;
 *   }}
 * </CurrentCart.LineItemAdded>
 * ```
 *
 * @example
 * ```tsx
 * // Combined with cart opening - show notification then open cart
 * <CurrentCart.OpenTrigger>
 *   {({ open }) => (
 *     <CurrentCart.LineItemAdded>
 *       {({ onAddedToCart }) => {
 *         useEffect(() => {
 *           return onAddedToCart((lineItems) => {
 *             setShowSuccessMessage(true);
 *             setTimeout(() => {
 *               setShowSuccessMessage(false);
 *               open(); // Open cart after notification
 *             }, 3000);
 *           });
 *         }, [onAddedToCart]);
 *         return null;
 *       }}
 *     </CurrentCart.LineItemAdded>
 *   )}
 * </CurrentCart.OpenTrigger>
 * ```
 */
export const LineItemAdded = (props: LineItemAddedProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  return props.children({
    onAddedToCart: service.onAddedToCart,
  });
};
