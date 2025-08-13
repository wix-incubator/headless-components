import { WixServices } from "@wix/services-manager-react";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
  CurrentCartServiceConfig,
} from "../services/current-cart-service.js";
import { createServicesMap } from "@wix/services-manager";

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
 * import { CurrentCart, Cart } from '@wix/ecom/components';
 *
 * function CartProvider() {
 *   return (
 *     <CurrentCart.Root currentCartServiceConfig={{ config }}>
 *       <div>
 *         <Cart.OpenTrigger>
 *           {({ totalItems, open }) => (
 *             <button onClick={open}>
 *               Cart ({totalItems})
 *             </button>
 *           )}
 *         </Cart.OpenTrigger>
 *
 *         <Cart.Content>
 *           {({ cart, isLoading }) => (
 *             <div>
 *               {isLoading ? 'Loading...' : 'Cart loaded'}
 *             </div>
 *           )}
 *         </Cart.Content>
 *       </div>
 *     </CurrentCart.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
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
