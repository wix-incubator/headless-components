import { useService } from "@wix/services-manager-react";
import { BuyNowServiceDefinition } from "../services/buy-now-service.js";

/**
 * Props passed to the render function of the BuyNow component
 */
export interface BuyNowRenderProps {
  /** Whether the buy now operation is currently loading */
  isLoading: boolean;
  /** The name of the product being purchased */
  productName: string;
  /** Function to redirect the user to the checkout page */
  redirectToCheckout: () => void;
  /** The error message if the buy now operation fails */
  error: string | null;
  /** The price of the product being purchased */
  price: string;
  /** The currency of the product being purchased */
  currency: string;
  /** Whether the product is in stock */
  inStock: boolean;
  /** Whether the product is available for pre-order */
  preOrderAvailable: boolean;
}

/**
 * Props for the BuyNow component
 */
export interface BuyNowProps {
  /** Render function that receives buy now state and actions */
  children: (props: BuyNowRenderProps) => React.ReactNode;
}

/**
 * A headless component that provides buy now functionality using the render props pattern.
 *
 * This component manages the state and actions for a "buy now" flow, allowing consumers
 * to render their own UI while accessing the underlying buy now functionality.
 * @example
 * ```tsx
 * <BuyNow>
 *   {({ isLoading, productName, redirectToCheckout, error, price, currency, inStock, preOrderAvailable }) => (
 *     <div>
 *       <h2>{productName}</h2>
 *       <p>{price} {currency}</p>
 *       {error && <div className="error">{error}</div>}
 *       {inStock && <div>In stock</div>}
 *       {preOrderAvailable && <div>Pre-order available</div>}
 *       <button
 *         onClick={redirectToCheckout}
 *         disabled={isLoading}
 *       >
 *         {isLoading ? 'Processing...' : 'Buy Now'}
 *       </button>
 *     </div>
 *   )}
 * </BuyNow>
 * ```
 * @component
 */
export function BuyNow(props: BuyNowProps): React.ReactNode {
  const {
    redirectToCheckout,
    loadingSignal,
    productName,
    errorSignal,
    price,
    currency,
    inStockSignal,
    preOrderAvailableSignal,
  } = useService(BuyNowServiceDefinition);

  return props.children({
    isLoading: loadingSignal.get(),
    error: errorSignal.get(),
    productName: productName,
    redirectToCheckout,
    price,
    currency,
    inStock: inStockSignal.get(),
    preOrderAvailable: preOrderAvailableSignal.get(),
  });
}
