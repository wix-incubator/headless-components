import { WixServices, useService } from "@wix/services-manager-react";
import React from "react";
import {
  LineItemServiceDefinition,
  LineItemService,
  type LineItemServiceConfig,
} from "../services/line-item-service.js";
import { createServicesMap } from "@wix/services-manager";
import { type LineItem } from "../services/current-cart-service.js";
import { useAsChild, type AsChildProps } from "../utils/asChild.js";



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

enum TestIds {
  lineItemTitle = "line-item-title",
}



/**
 * Props for LineItem Title component
 */
export interface TitleProps extends AsChildProps {}

/**
 * Displays the line item title/product name with customizable rendering options following the V2 API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LineItem.Title className="text-lg font-medium" />
 *
 * // asChild with primitive element
 * <LineItem.Title asChild>
 *   <h3 className="text-lg font-medium" />
 * </LineItem.Title>
 *
 * // asChild with React component
 * <LineItem.Title asChild>
 *   {React.forwardRef(({title, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-medium">
 *       {title}
 *     </h3>
 *   ))}
 * </LineItem.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const lineItemService = useService(LineItemServiceDefinition);
  const Comp = useAsChild(asChild, "span");

  const lineItem = lineItemService.lineItem.get();
  const title = lineItem?.productName?.original || "";

  const attributes = {
    "data-testid": TestIds.lineItemTitle,
    ...otherProps,
  };

  return (
    <Comp ref={ref} {...attributes}>
      {asChild ? children : title}
    </Comp>
  );
});

Title.displayName = "LineItem.Title";
