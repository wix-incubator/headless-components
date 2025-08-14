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
import { media } from "@wix/sdk";



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
  lineItemImage = "line-item-image",
  lineItemSelectedOptions = "line-item-selected-options",
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
  const Comp = useAsChild(asChild);

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

/**
 * Props for LineItem Image component
 */
export interface ImageProps extends AsChildProps {}

/**
 * Displays the line item product image with customizable rendering options following the V2 API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LineItem.Image className="w-16 h-16 rounded-lg object-cover" />
 *
 * // Custom rendering with forwardRef
 * <LineItem.Image asChild>
 *   {React.forwardRef(({src, alt, ...props}, ref) => (
 *     <img
 *       ref={ref}
 *       {...props}
 *       src={src}
 *       alt={alt}
 *       className="w-16 h-16 rounded-lg object-cover"
 *     />
 *   ))}
 * </LineItem.Image>
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const lineItemService = useService(LineItemServiceDefinition);
  const Comp = useAsChild(asChild, "img");

  const lineItem = lineItemService.lineItem.get();

  let src = "";
  if (lineItem?.image) {
    try {
      src = media.getImageUrl(lineItem.image).url;
    } catch (error) {
      console.warn("Failed to get image URL:", error);
      src = "";
    }
  }

  const alt = lineItem?.productName?.original || "Product image";

  const attributes = {
    "data-testid": TestIds.lineItemImage,
    src,
    alt,
    ...otherProps,
  };

  return (
    <Comp ref={ref} {...attributes}>
      {asChild ? children : null}
    </Comp>
  );
});

Image.displayName = "LineItem.Image";

/**
 * Props for LineItem SelectedOptions component
 */
export interface SelectedOptionsProps extends AsChildProps {}

/**
 * Container for selected options display. Does not render when there are no selected options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LineItem.SelectedOptions>
 *   <LineItem.SelectedOptionRepeater />
 * </LineItem.SelectedOptions>
 *
 * // asChild with primitive element
 * <LineItem.SelectedOptions asChild>
 *   <section className="selected-options-section">
 *     <LineItem.SelectedOptionRepeater />
 *   </section>
 * </LineItem.SelectedOptions>
 *
 * // asChild with React component
 * <LineItem.SelectedOptions asChild>
 *   {React.forwardRef((props, ref) => (
 *     <section ref={ref} {...props} className="selected-options-section">
 *       {props.children}
 *     </section>
 *   ))}
 * </LineItem.SelectedOptions>
 * ```
 */
export const SelectedOptions = React.forwardRef<HTMLElement, SelectedOptionsProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const lineItemService = useService(LineItemServiceDefinition);
    const Comp = useAsChild(asChild, "div");

    const lineItem = lineItemService.lineItem.get();

    const selectedOptions: Array<{
      name: string;
      value: string | { name: string; code: string };
    }> = [];

    if (lineItem?.descriptionLines) {
      lineItem.descriptionLines.forEach((line: any) => {
        if (line.name?.original) {
          const optionName = line.name.original;

          if (line.colorInfo) {
            selectedOptions.push({
              name: optionName,
              value: {
                name: line.colorInfo.original,
                code: line.colorInfo.code,
              },
            });
          } else if (line.plainText) {
            selectedOptions.push({
              name: optionName,
              value: line.plainText.original,
            });
          }
        }
      });
    }

    if (selectedOptions.length === 0) {
      return null;
    }

    const attributes = {
      "data-testid": TestIds.lineItemSelectedOptions,
      ...otherProps,
    };

    return (
      <Comp ref={ref} {...attributes}>
        {children}
      </Comp>
    );
  },
);

SelectedOptions.displayName = "LineItem.SelectedOptions";
