import React from "react";
import * as CoreProduct from "./core/Product.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import * as ProductModifiers from "./core/ProductModifiers.js";
import * as SelectedVariant from "./core/SelectedVariant.js";
import type { V3Product } from "@wix/auto_sdk_stores_products-v-3";
import { renderAsChild, type AsChildChildren } from "../utils/index.js";

/**
 * Props for the Product root component following the documented API
 */
export interface ProductRootProps {
  children: React.ReactNode;
  product: V3Product;
  selectedVariant?: any;
  asChild?: boolean;
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
 *       <Product.Description className="text-lg text-gray-600" />
 *     </Product.Root>
 *   );
 * }
 * ```
 */
export function Root(props: ProductRootProps): React.ReactNode {
  return (
    <CoreProduct.Root productServiceConfig={{ product: props.product }}>
      <ProductVariantSelector.Root>
        <ProductModifiers.Root>
          <SelectedVariant.Root>
            <div data-testid="product-details">{props.children}</div>
          </SelectedVariant.Root>
        </ProductModifiers.Root>
      </ProductVariantSelector.Root>
    </CoreProduct.Root>
  );
}

/**
 * Props for Product Name component
 */
export interface NameProps {
  /** When true, renders as a child component instead of default h1 */
  asChild?: boolean;
  /** Custom render function or React element when using asChild */
  children?: AsChildChildren<{ name: string } & NameProps>;
  /** CSS classes to apply to the default h1 element */
  className?: string;
}

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

  return (
    <CoreProduct.Name>
      {({ name }) => {
        // Handle asChild rendering
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
          <h1
            ref={ref as React.Ref<HTMLHeadingElement>}
            className={className}
            data-testid="product-name"
          >
            {name}
          </h1>
        );
      }}
    </CoreProduct.Name>
  );
});

Name.displayName = "Product.Name";

/**
 * Props for Product Description component
 */
export interface DescriptionProps {
  as?: "plain" | "html" | "ricos";
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    { description: string }
  >;
  className?: string;
}

/**
 * Renders the product description with HTML content support following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * <Product.Description as="plain" className="text-content-secondary" />
 * <Product.Description as="html" className="prose" />
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { as = "plain", asChild, children, className } = props;

    return (
      <CoreProduct.Description>
        {({ plainDescription, description }) => {
          const content =
            as === "html"
              ? plainDescription
              : as === "ricos"
                ? JSON.stringify(description)
                : plainDescription || "";

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { description: content },
              ref,
              content,
            });
            if (rendered) return rendered;
          }

          if (as === "html" && typeof content === "string") {
            return (
              <div
                ref={ref as React.Ref<HTMLDivElement>}
                className={className}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            );
          }

          return (
            <div ref={ref as React.Ref<HTMLDivElement>} className={className}>
              {typeof content === "string" ? content : ""}
            </div>
          );
        }}
      </CoreProduct.Description>
    );
  },
);

Description.displayName = "Product.Description";
