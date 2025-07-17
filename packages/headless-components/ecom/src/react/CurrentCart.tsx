import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import {
  CurrentCartServiceDefinition,
  type LineItem,
} from "../services/current-cart-service.js";
import * as currentCart from "@wix/auto_sdk_ecom_current-cart";
import { media } from "@wix/sdk";

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
export interface TriggerProps {
  /** Render prop function that receives trigger data */
  children: (props: TriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for Trigger component
 */
export interface TriggerRenderProps {
  /** Number of items in cart */
  itemCount: number;
  /** Whether cart has items */
  hasItems: boolean;
  /** Function to open cart */
  onOpen: () => void;
  /** Whether cart is currently loading */
  isLoading: boolean;
}

/**
 * Headless component for cart trigger with item count
 */
export const Trigger = (props: TriggerProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    itemCount,
    hasItems: itemCount > 0,
    onOpen: service.openCart,
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
  onClose: () => void;
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
 *       <CurrentCart.Trigger>
 *         {({ itemCount }) => <h1>Cart ({itemCount} items)</h1>}
 *       </CurrentCart.Trigger>
 *
 *       {isLoading && <p>Loading cart...</p>}
 *
 *       <CurrentCart.Items>
 *         {({ hasItems, items }) => (
 *           <>
 *             {!hasItems ? (
 *               <p>Your cart is empty</p>
 *             ) : (
 *               <>
 *                 <CurrentCart.Clear>
 *                   {({ onClear, hasItems, isLoading }) => (
 *                     hasItems && (
 *                       <button onClick={onClear} disabled={isLoading}>
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
 *                       onIncrease,
 *                       onDecrease,
 *                       onRemove,
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
 *                         <button onClick={onDecrease} disabled={itemLoading || quantity <= 1}>-</button>
 *                         <span>{quantity}</span>
 *                         <button onClick={onIncrease} disabled={itemLoading}>+</button>
 *
 *                         <button onClick={onRemove} disabled={itemLoading}>
 *                           {itemLoading ? 'Removing...' : 'Remove'}
 *                         </button>
 *                       </div>
 *                     )}
 *                   </CurrentCart.Item>
 *                 ))}
 *
 *                 <CurrentCart.Notes>
 *                   {({ notes, onNotesChange }) => (
 *                     <textarea
 *                       value={notes}
 *                       onChange={e => onNotesChange(e.target.value)}
 *                       placeholder="Special instructions for your order"
 *                     />
 *                   )}
 *                 </CurrentCart.Notes>
 *
 *                 <CurrentCart.Coupon>
 *                   {({ appliedCoupon, onApply, onRemove, isLoading }) => (
 *                     <div>
 *                       {appliedCoupon ? (
 *                         <div>
 *                           <span>Coupon: {appliedCoupon}</span>
 *                           <button onClick={onRemove} disabled={isLoading}>
 *                             {isLoading ? 'Removing...' : 'Remove'}
 *                           </button>
 *                         </div>
 *                       ) : (
 *                         <form onSubmit={e => {
 *                           e.preventDefault();
 *                           const code = new FormData(e.currentTarget).get('couponCode');
 *                           if (code?.trim()) onApply(code.trim());
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
 *                   {({ subtotal, discount, shipping, tax, total, itemCount, isTotalsLoading }) => (
 *                     <div>
 *                       <div>Subtotal ({itemCount} items): {isTotalsLoading ? 'Calculating...' : subtotal}</div>
 *                       {discount && <div>Discount: -{discount}</div>}
 *                       <div>Shipping: {isTotalsLoading ? 'Calculating...' : shipping}</div>
 *                       <div>Tax: {isTotalsLoading ? 'Calculating...' : tax}</div>
 *                       <div>Total: {isTotalsLoading ? 'Calculating...' : total}</div>
 *                     </div>
 *                   )}
 *                 </CurrentCart.Summary>
 *
 *                 <CurrentCart.Checkout>
 *                   {({ onProceed, canCheckout, isLoading: checkoutLoading, error }) => (
 *                     <div>
 *                       {error && <p>Error: {error}</p>}
 *                       <button onClick={onProceed} disabled={!canCheckout || checkoutLoading}>
 *                         {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
 *                       </button>
 *                     </div>
 *                   )}
 *                 </CurrentCart.Checkout>
 *               </>
 *             )}
 *           </>
 *         )}
 *       </CurrentCart.Items>
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
    onClose: service.closeCart,
    cart,
    isLoading,
    error,
  });
};

/**
 * Props for Items headless component
 */
export interface ItemsProps {
  /** Render prop function that receives items data */
  children: (props: ItemsRenderProps) => React.ReactNode;
}

/**
 * Render props for Items component
 */
export interface ItemsRenderProps {
  /** Array of line items in cart */
  items: any[];
  /** Whether cart has items */
  hasItems: boolean;
  /** Total number of items */
  totalItems: number;
}

/**
 * Headless component for cart items collection
 */
export const Items = (props: ItemsProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const items = cart?.lineItems || [];
  const totalItems = service.cartCount.get();

  return props.children({
    items,
    hasItems: items.length > 0,
    totalItems,
  });
};

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Line item data */
  item: any;
  /** Render prop function that receives item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Line item data */
  item: any | null;
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
  onIncrease: () => Promise<void>;
  /** Function to decrease quantity */
  onDecrease: () => Promise<void>;
  /** Function to remove item */
  onRemove: () => Promise<void>;
  /** Whether item is loading */
  isLoading: boolean;
}

/**
 * Headless component for individual cart item
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
      item: null,
      quantity: 0,
      title: "",
      image: null,
      price: formatCurrency(0, currency),
      selectedOptions: [],
      onIncrease: async () => {},
      onDecrease: async () => {},
      onRemove: async () => {},
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
    item,
    quantity,
    title: item.productName?.original || "",
    image,
    price: formattedPrice,
    selectedOptions,
    onIncrease: () => service.increaseLineItemQuantity(lineItemId),
    onDecrease: () => service.decreaseLineItemQuantity(lineItemId),
    onRemove: () => service.removeLineItem(lineItemId),
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
  /** Whether checkout is available */
  canCheckout: boolean;
  /** Whether totals are being calculated */
  isTotalsLoading: boolean;
}

/**
 * Headless component for cart summary/totals
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
    currency
  );
  const shipping = formatCurrency(
    parseFloat(totals.shipping?.amount || "0"),
    currency
  );
  const tax = formatCurrency(parseFloat(totals.tax?.amount || "0"), currency);
  const total = formatCurrency(
    parseFloat(totals.total?.amount || "0"),
    currency
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
    canCheckout: itemCount > 0,
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
  onClear: () => Promise<void>;
  /** Whether cart has items to clear */
  hasItems: boolean;
  /** Whether clear action is loading */
  isLoading: boolean;
}

/**
 * Headless component for clearing the cart
 */
export const Clear = (props: ClearProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    onClear: service.clearCart,
    hasItems: itemCount > 0,
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
  onProceed: () => Promise<void>;
  /** Whether checkout is available */
  canCheckout: boolean;
  /** Whether checkout action is loading */
  isLoading: boolean;
  /** Error message if checkout fails */
  error: string | null;
}

/**
 * Headless component for checkout action
 */
export const Checkout = (props: CheckoutProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    onProceed: service.proceedToCheckout,
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
  onNotesChange: (notes: string) => Promise<void>;
}

/**
 * Headless component for notes
 */
export const Notes = (props: NotesProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const notes = service.buyerNotes.get();

  return props.children({
    notes,
    onNotesChange: service.setBuyerNotes,
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
  onApply: (code: string) => Promise<void>;
  /** Function to remove coupon */
  onRemove: () => Promise<void>;
  /** Whether coupon action is loading */
  isLoading: boolean;
  /** Error message if coupon operation fails */
  error: string | null;
}

/**
 * Headless component for coupon functionality
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
    onApply: service.applyCoupon,
    onRemove: service.removeCoupon,
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
 * <CurrentCart.Trigger>
 *   {({ onOpen }) => (
 *     <CurrentCart.LineItemAdded>
 *       {({ onAddedToCart }) => {
 *         useEffect(() => {
 *           return onAddedToCart((lineItems) => {
 *             setShowSuccessMessage(true);
 *             setTimeout(() => {
 *               setShowSuccessMessage(false);
 *               onOpen(); // Open cart after notification
 *             }, 3000);
 *           });
 *         }, [onAddedToCart]);
 *         return null;
 *       }}
 *     </CurrentCart.LineItemAdded>
 *   )}
 * </CurrentCart.Trigger>
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
