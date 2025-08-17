import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  CheckoutServiceDefinition,
  CheckoutService,
  CheckoutServiceConfig,
} from '../services/checkout-service.js';
import { createServicesMap } from '@wix/services-manager';
import { type LineItem } from '../services/checkout-service.js';

/**
 * Props for the Root component
 */
export interface RootProps {
  children: React.ReactNode;
  checkoutServiceConfig?: CheckoutServiceConfig;
}

/**
 * Root component that provides the Checkout service context to its children.
 * This component sets up the necessary services for managing direct product checkout functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Checkout } from '@wix/ecom/react';
 *
 * function ProductCheckout() {
 *   const lineItems = [{ catalogReference: { productId: 'product-id', variantId: 'variant-id' }, quantity: 1 }];
 *
 *   return (
 *     <Checkout.Root checkoutServiceConfig={{ channelType: 'WEB', postFlowUrl: '/thank-you' }}>
 *       <div>
 *         <Checkout.Trigger>
 *           {({ createCheckout, isLoading, error }) => (
 *             <button onClick={() => createCheckout(lineItems)} disabled={isLoading}>
 *               {isLoading ? 'Processing...' : 'Buy Now'}
 *             </button>
 *           )}
 *         </Checkout.Trigger>
 *       </div>
 *     </Checkout.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CheckoutServiceDefinition,
        CheckoutService,
        props.checkoutServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for the Trigger headless component
 */
export interface TriggerProps {
  /** Render prop function that receives checkout trigger data */
  children: (props: TriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for the Trigger component
 */
export interface TriggerRenderProps {
  /** Function to create checkout and redirect */
  createCheckout: (lineItems: LineItem[]) => Promise<void>;
  /** Whether checkout creation is in progress */
  isLoading: boolean;
  /** Error message if checkout fails */
  error: string | null;
}

/**
 * Headless component that provides checkout creation functionality.
 * Use this component to trigger direct checkout for a product.
 *
 * @component
 * @example
 * ```tsx
 * import { Checkout } from '@wix/ecom/react';
 *
 * function BuyNowButton() {
 *   const lineItems = [{ catalogReference: { productId: 'product-id' }, quantity: 1 }];
 *
 *   return (
 *     <Checkout.Trigger>
 *       {({ createCheckout, isLoading, error }) => (
 *         <div>
 *           <button
 *             onClick={() => createCheckout(lineItems)}
 *             disabled={isLoading}
 *             className="buy-now-btn"
 *           >
 *             {isLoading ? 'Processing...' : 'Buy Now'}
 *           </button>
 *           {error && (
 *             <p className="error-message">{error}</p>
 *           )}
 *         </div>
 *       )}
 *     </Checkout.Trigger>
 *   );
 * }
 * ```
 */
export function Trigger(props: TriggerProps) {
  const service = useService(CheckoutServiceDefinition) as ServiceAPI<
    typeof CheckoutServiceDefinition
  >;

  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    createCheckout: service.createCheckout,
    isLoading,
    error,
  });
}
