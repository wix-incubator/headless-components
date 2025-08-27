import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  SelectedVariantServiceDefinition,
  SelectedVariantService,
  SelectedVariantServiceConfig,
} from '../../services/selected-variant-service.js';
import { ProductModifiersServiceDefinition } from '../../services/product-modifiers-service.js';
import { createServicesMap } from '@wix/services-manager';
import { CheckoutCore } from '@wix/headless-ecom/react';
import {
  CheckoutServiceDefinition,
  CurrentCartServiceDefinition,
} from '@wix/headless-ecom/services';
import { type LineItem } from '@wix/headless-ecom/services';

export interface RootProps {
  children: React.ReactNode;
  selectedVariantServiceConfig?: SelectedVariantServiceConfig;
}

/**
 * Root component that provides the SelectedVariant service context to its children.
 * This component sets up the necessary services for rendering and managing selected variant data.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function ProductVariantDisplay() {
 *   return (
 *     <SelectedVariant.Root selectedVariantServiceConfig={{ fetchInventoryData: true }}>
 *       <div>
 *         <SelectedVariant.Price>
 *           {({ price, compareAtPrice, currency }) => (
 *             <div className="price-display">
 *               <span className="current-price">{price}</span>
 *               {compareAtPrice && (
 *                 <span className="compare-price">
 *                   <s>{compareAtPrice}</s>
 *                 </span>
 *               )}
 *               <span className="currency">{currency}</span>
 *             </div>
 *           )}
 *         </SelectedVariant.Price>
 *       </div>
 *     </SelectedVariant.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        SelectedVariantServiceDefinition,
        SelectedVariantService,
        props.selectedVariantServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for ProductDetails headless component
 */
export interface ProductDetailsProps {
  /** Render prop function that receives product details data */
  children: (props: ProductDetailsRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductDetails component
 */
export interface ProductDetailsRenderProps {
  /** Product SKU */
  sku: string | null;
  /** Product weight */
  weight: string | null;
}

/**
 * Headless component for selected variant details display
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function VariantDetails() {
 *   return (
 *     <SelectedVariant.Details>
 *       {({ sku, weight }) => (
 *         <div>
 *           {sku && <div>SKU: {sku}</div>}
 *           {weight && <div>Weight: {weight}</div>}
 *         </div>
 *       )}
 *     </SelectedVariant.Details>
 *   );
 * }
 * ```
 */
export function Details(props: ProductDetailsProps) {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();

  let sku: string | null = selectedVariant?.sku || null;
  let weight: string | null =
    selectedVariant?.physicalProperties?.weight?.toString() || null;

  return props.children({
    sku,
    weight,
  });
}

/**
 * Props for Price headless component
 */
export interface PriceProps {
  /** Render prop function that receives price data */
  children: (props: PriceRenderProps) => React.ReactNode;
}

/**
 * Render props for Price component
 */
export interface PriceRenderProps {
  /** Current price (formatted) */
  price: string;
  /** Compare at price (formatted) - null if no compare price */
  compareAtPrice: string | null;
  /** Currency code */
  currency: string;
}

/**
 * Headless component for product price display
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function ProductPrice() {
 *   return (
 *     <SelectedVariant.Price>
 *       {({ price, compareAtPrice, currency }) => (
 *         <div className="price-display">
 *           <span className="current-price">{price}</span>
 *           {compareAtPrice && (
 *             <span className="compare-price">
 *               <s>{compareAtPrice}</s>
 *             </span>
 *           )}
 *           <span className="currency">{currency}</span>
 *         </div>
 *       )}
 *     </SelectedVariant.Price>
 *   );
 * }
 * ```
 */
export function Price(props: PriceProps) {
  const variantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const price = variantService.currentPrice.get();
  const compareAtPrice = variantService.currentCompareAtPrice.get();
  const currency = variantService.currency.get();

  return props.children({
    price,
    compareAtPrice,
    currency,
  });
}

/**
 * Props for SKU headless component
 */
export interface SKUProps {
  /** Render prop function that receives SKU data */
  children: (props: SKURenderProps) => React.ReactNode;
}

/**
 * Render props for SKU component
 */
export interface SKURenderProps {
  /** Product SKU */
  sku: string | null;
}

/**
 * Headless component for product SKU display
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function ProductSKU() {
 *   return (
 *     <SelectedVariant.SKU>
 *       {({ sku }) => (
 *         <div>
 *           {sku && (
 *             <div className="product-sku">
 *               <strong>SKU:</strong> {sku}
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </SelectedVariant.SKU>
 *   );
 * }
 * ```
 */
export function SKU(props: SKUProps) {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();
  const sku: string | null = selectedVariant?.sku || null;

  return props.children({
    sku,
  });
}

/**
 * Props for Actions headless component
 */
export interface ActionsProps {
  /** Render prop function that receives actions data */
  children: (props: ActionsRenderProps) => React.ReactNode;
}

/**
 * Render props for Actions component
 */
export interface ActionsRenderProps {
  /** Function to add product to cart */
  addToCart: () => Promise<void>;
  /** Function to buy now (clear cart, add product, proceed to checkout) */
  buyNow: () => Promise<void>;
  /** Line items */
  lineItems: LineItem[];
  /** Whether add to cart is available */
  canAddToCart: boolean;
  /** Whether add to cart is currently loading */
  isLoading: boolean;
  /** Whether variant is in stock */
  inStock: boolean;
  /** Whether pre-order is enabled */
  isPreOrderEnabled: boolean;
  /** Pre-order message */
  preOrderMessage: string | null;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for product actions (add to cart, buy now)
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function AddToCartButton() {
 *   return (
 *     <SelectedVariant.Actions>
 *       {({ addToCart, buyNow, canAddToCart, isLoading, inStock, error }) => (
 *         <div>
 *           {error && <div className="error">{error}</div>}
 *           {!inStock && <div>Out of stock</div>}
 *           <button
 *             onClick={addToCart}
 *             disabled={!canAddToCart || isLoading}
 *           >
 *             {isLoading ? 'Adding...' : 'Add to Cart'}
 *           </button>
 *           <button
 *             onClick={buyNow}
 *             disabled={!canAddToCart || isLoading}
 *           >
 *             Buy Now
 *           </button>
 *         </div>
 *       )}
 *     </SelectedVariant.Actions>
 *   );
 * }
 * ```
 */
export function Actions(props: ActionsProps) {
  const variantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;
  const cartService = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  // Try to get checkout service - it may not be available
  let checkoutService: ServiceAPI<typeof CheckoutServiceDefinition> | null =
    null;
  try {
    checkoutService = useService(CheckoutServiceDefinition) as ServiceAPI<
      typeof CheckoutServiceDefinition
    >;
  } catch {
    // Checkout service not available
    checkoutService = null;
  }

  // Try to get modifiers service - it may not exist for all products
  let modifiersService: ServiceAPI<
    typeof ProductModifiersServiceDefinition
  > | null = null;
  try {
    modifiersService = useService(
      ProductModifiersServiceDefinition,
    ) as ServiceAPI<typeof ProductModifiersServiceDefinition>;
  } catch {
    // Modifiers service not available for this product
    modifiersService = null;
  }

  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const preOrderMessage = variantService.preOrderMessage.get();
  const isLoading =
    variantService.isLoading.get() ||
    (checkoutService ? checkoutService.isLoading.get() : false);
  const error =
    variantService.error.get() ||
    (checkoutService ? checkoutService.error.get() : null);
  const quantity = variantService.selectedQuantity.get();

  // Check if all required modifiers are filled
  const areAllRequiredModifiersFilled = modifiersService
    ? modifiersService.areAllRequiredModifiersFilled()
    : true; // If no modifiers service, assume no required modifiers

  const canAddToCart =
    (inStock || isPreOrderEnabled) &&
    !isLoading &&
    areAllRequiredModifiersFilled;

  const getModifiersData = () => {
    if (modifiersService) {
      const selectedModifiers = modifiersService.selectedModifiers.get();
      if (Object.keys(selectedModifiers).length > 0) {
        return selectedModifiers;
      }
    }
  };

  const addToCart = async () => {
    const modifiersData = getModifiersData();
    await variantService.addToCart(quantity, modifiersData);
  };

  const buyNowFallback = async () => {
    try {
      // Clear the cart first
      await cartService.clearCart();

      // Add the product to cart
      await addToCart();

      // Proceed to checkout
      await cartService.proceedToCheckout();
    } catch (error) {
      console.error('Buy now failed:', error);
      throw error;
    }
  };

  const getLineItems = () => {
    const modifiersData = getModifiersData();
    return variantService.createLineItems(quantity, modifiersData);
  };

  const commonProps = {
    lineItems: getLineItems(),
    addToCart,
    canAddToCart,
    isLoading,
    inStock,
    isPreOrderEnabled,
    preOrderMessage,
    error,
  };

  if (checkoutService) {
    return (
      <CheckoutCore.Trigger>
        {({
          createCheckout,
          isLoading: checkoutLoading,
          error: checkoutError,
        }: {
          createCheckout: (lineItems: LineItem[]) => Promise<void>;
          isLoading: boolean;
          error: string | null;
        }) =>
          props.children({
            ...commonProps,
            isLoading: isLoading || checkoutLoading,
            error: error || checkoutError,
            buyNow: () => createCheckout(getLineItems()),
          })
        }
      </CheckoutCore.Trigger>
    );
  }

  return props.children({
    ...commonProps,
    buyNow: buyNowFallback,
  });
}
