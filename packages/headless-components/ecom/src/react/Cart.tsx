import { Slot } from "@radix-ui/react-slot";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import React from "react";
import {
  CurrentCartServiceDefinition,
} from "../services/current-cart-service.js";

export interface LineItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  asChild?: boolean;
  className?: string;
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
  const { asChild, children, className, emptyState, ...otherProps } = props;
  const Comp = asChild ? Slot : "div";

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
      className={className}
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

  const cart = service.cart.get();
  const items = cart?.lineItems || [];

  return (
    <>
      {items.map((item, index) => (
        <div key={item._id || index} data-testid="cart-line-item">
          {props.children}
        </div>
      ))}
    </>
  );
}
