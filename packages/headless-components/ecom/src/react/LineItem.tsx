import { WixServices } from "@wix/services-manager-react";
import React from "react";
import {
  LineItemServiceDefinition,
  LineItemService,
  type LineItemServiceConfig,
} from "../services/line-item-service.js";
import { createServicesMap } from "@wix/services-manager";
import { type LineItem } from "../services/current-cart-service.js";

export interface LineItemRootProps {
  children: React.ReactNode;
  item: LineItem;
}

/**
 * Root component for a cart line item that provides the LineItem service context to its children
 *
 * @example
 * ```tsx
 * <LineItem.Root item={cartItem}>
 *   <LineItem.Image />
 *   <LineItem.Title />
 *   <LineItem.Quantity />
 * </LineItem.Root>
 * ```
 */
export function Root(props: LineItemRootProps): React.ReactNode {
  const { children, item } = props;

  const lineItemServiceConfig: LineItemServiceConfig = {
    lineItem: item,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        LineItemServiceDefinition,
        LineItemService,
        lineItemServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

Root.displayName = "LineItem.Root";
