import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import React from "react";
import {
  CurrentCartServiceDefinition,
} from "../services/current-cart-service.js";
import { useAsChild, type AsChildProps } from "../utils/asChild.js";

export interface LineItemsProps extends AsChildProps {
  emptyState?: React.ReactNode;
}

/**
 * Headless component for cart items collection
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
export function LineItems(props: LineItemsProps): React.ReactNode {
  const { asChild, children, emptyState, ...otherProps } = props;
  const Comp = useAsChild(asChild, "div");

  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();

  // Show empty state if cart is null
  if (!cart && emptyState) {
    return emptyState;
  }

  return (
    <Comp
      data-testid="cart-line-items"
      {...otherProps}
    >
      {children}
    </Comp>
  );
}

export interface LineItemRepeaterProps {
  children: React.ReactNode;
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
export function LineItemRepeater(props: LineItemRepeaterProps): React.ReactNode {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;
  const { children } = props;

  const cart = service.cart.get();
  const items = cart?.lineItems || [];

  return (
    <>
      {items.map((item, index) => (
        <div key={item._id || index}>
          {children}
        </div>
      ))}
    </>
  );
}
