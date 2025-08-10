import React from "react";
import * as CoreProduct from "./core/Product.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import * as ProductModifiers from "./core/ProductModifiers.js";
import * as SelectedVariant from "./core/SelectedVariant.js";
import type { V3Product } from "@wix/auto_sdk_stores_products-v-3";
import { renderAsChild, type AsChildProps } from "../utils/index.js";

/**
 * Props for the Product root component following the documented API
 */
export interface ProductRootProps {
  children: React.ReactNode;
  product: V3Product;
  selectedVariant?: any;
}

/**
 * Root component that provides all necessary service contexts for a complete product experience.
 * This composite component combines Product, ProductVariantSelector, ProductModifiers, and SelectedVariant
 * functionality following the documented API patterns with proper data attributes.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Product } from '@wix/stores/components';
 *
 * function ProductPage({ product }) {
 *   return (
 *     <Product.Root product={product}>
 *       <Product.Name className="text-4xl font-bold" />
 *     </Product.Root>
 *   );
 * }
 * ```
 */
export function Root(props: ProductRootProps): React.ReactNode {
  const testId = "product-root";

  return (
    <CoreProduct.Root
      productServiceConfig={{ product: props.product }}
      data-testid={testId}
    >
      <ProductVariantSelector.Root>
        <ProductModifiers.Root>
          <SelectedVariant.Root>{props.children}</SelectedVariant.Root>
        </ProductModifiers.Root>
      </ProductVariantSelector.Root>
    </CoreProduct.Root>
  );
}

/**
 * Props for Product Name component
 */
export interface NameProps extends AsChildProps<{ name: string }> {}

/**
 * Displays the product name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Name className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Product.Name asChild>
 *   <h1 className="text-4xl font-bold" />
 * </Product.Name>
 *
 * // asChild with react component
 * <Product.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h1 ref={ref} {...props} className="text-4xl font-bold">
 *       {name}
 *     </h1>
 *   ))}
 * </Product.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className } = props;
  const testId = "product-name";

  return (
    <CoreProduct.Name>
      {({ name }) => {
        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: { name, ...props },
            ref,
            content: name,
          });
          if (rendered) return rendered;
        }

        return (
          <h1 className={className} data-testid={testId}>
            {name}
          </h1>
        );
      }}
    </CoreProduct.Name>
  );
});

/**
 * Props for Product Description component
 */
export interface DescriptionProps
  extends AsChildProps<{ description: string }> {
  /** Format of the description content */
  as?: "plain" | "html" | "ricos";
}

/**
 * Displays the product description with customizable rendering and format options following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage (plain text)
 * <Product.Description className="text-content-secondary" />
 *
 * // HTML content
 * <Product.Description as="html" className="prose" />
 *
 * // asChild with custom rendering
 * <Product.Description as="html" asChild>
 *   {({ description }) => (
 *     <div
 *       className="text-content-secondary"
 *       dangerouslySetInnerHTML={{ __html: description }}
 *     />
 *   )}
 * </Product.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, as = "plain" } = props;
    const testId = "product-description";

    return (
      <CoreProduct.Description>
        {({ description: richDescription, plainDescription }) => {
          // Determine which description to use based on the 'as' prop
          let description: string;
          switch (as) {
            case "html":
              description = plainDescription || "";
              break;
            case "ricos":
              description = JSON.stringify(richDescription) || "";
              break;
            case "plain":
            default:
              // For plain text, we'll strip HTML tags from plainDescription
              description = plainDescription
                ? plainDescription.replace(/<[^>]*>/g, "")
                : "";
              break;
          }

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { description, ...props },
              ref,
              content: description,
            });
            if (rendered) return rendered;
          }

          // Default rendering based on format
          if (as === "html") {
            return (
              <div
                className={className}
                data-testid={testId}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            );
          }

          return (
            <div className={className} data-testid={testId}>
              {description}
            </div>
          );
        }}
      </CoreProduct.Description>
    );
  },
);
