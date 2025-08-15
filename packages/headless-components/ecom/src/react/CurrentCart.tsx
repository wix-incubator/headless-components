import {
  Root as CoreRoot,
} from './core/CurrentCart.js';
import { Root as CartRoot } from './Cart.js';
import { CurrentCartServiceConfig } from '../services/current-cart-service.js';

enum TestIds {
  currentCartRoot = 'current-cart-root',
}

/**
 * Props for the Root component
 */
export interface RootProps {
  /** Child components that will have access to the cart context */
  children: React.ReactNode;
  /** Configuration for the current cart service */
  currentCartServiceConfig: CurrentCartServiceConfig;
}

export const Root = ({ children, currentCartServiceConfig }: RootProps) => {
  return (
    <CoreRoot
      currentCartServiceConfig={currentCartServiceConfig}
      data-testid={TestIds.currentCartRoot}
    >
      <CartRoot>
        {children}
      </CartRoot>
    </CoreRoot>
  );
};
