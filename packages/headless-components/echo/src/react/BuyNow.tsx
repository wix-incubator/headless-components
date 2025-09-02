import { metroinspector } from '@wix/echo';

/**
 * Props for the BuyNow component
 */
export interface BuyNowProps {
  myEchoMessage: metroinspector.EchoMessage;
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
  console.log(props.myEchoMessage);

  return <div>BuyNow</div>;
}
