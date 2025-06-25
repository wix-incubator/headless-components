import { useService } from "@wix/services-manager-react";
import { PayNowServiceDefinition } from "../services/pay-now-service";

export type PayNowRedirectToCheckout = () => void

/**
 * Props passed to the render function of the PayNow component
 */
export interface PayNowRenderProps {
  /** Whether the buy now operation is currently loading */
  isLoading: boolean;
  /** Function to redirect the user to the checkout page */
  redirectToCheckout: PayNowRedirectToCheckout;
  /** The error message if the buy now operation fails */
  error: string | null;
};

export type PayNowChildren = (props: PayNowRenderProps) => React.ReactNode
/**
 * Props for the PayNow component
 */
export interface PayNowProps {
  /** Render function that receives buy now state and actions */
  children: PayNowChildren;
};

/**
 * A headless component that provides pay now functionality using the render props pattern.
 *
 * This component manages the state and actions for a "pay now" flow, allowing consumers
 * to render their own UI while accessing the underlying payment functionality.
 * @example
 * ```tsx
 * <PayNow>
 *   {({ isLoading, redirectToCheckout, error }) => (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button
 *         onClick={redirectToCheckout}
 *         disabled={isLoading}
 *       >
 *         {isLoading ? 'Processing...' : 'Pay Now'}
 *       </button>
 *     </div>
 *   )}
 * </PayNow>
 * ```
 * @component
 */
export function PayNow(props: PayNowProps): React.ReactNode {
  const {
    redirectToCheckout,
    loadingSignal,
    errorSignal,
  } = useService(PayNowServiceDefinition);

  return props.children({
    isLoading: loadingSignal.get(),
    error: errorSignal.get(),
    redirectToCheckout,
  });
}
