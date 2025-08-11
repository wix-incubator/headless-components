import type { V3Product } from "@wix/auto_sdk_stores_products-v-3";
import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import * as CoreProduct from "./core/Product.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import * as SelectedVariant from "./core/SelectedVariant.js";
import * as Option from "./Option.js";
import { AsContent } from "./types.js";

enum TestIds {
  productRoot = "product-root",
  productName = "product-name",
  productDescription = "product-description",
  productPrice = "product-price",
  productCompareAtPrice = "product-compare-at-price",
}

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
  return (
    <CoreProduct.Root
      productServiceConfig={{ product: props.product }}
      data-testid={TestIds.productRoot}
    >
      <ProductVariantSelector.Root>
        <SelectedVariant.Root>{props.children}</SelectedVariant.Root>
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

  return (
    <CoreProduct.Name>
      {({ name }) => {
        const attributes = {
          "data-testid": TestIds.productName,
        };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: { name },
            ref,
            content: name,
            attributes,
          });
          if (rendered) return rendered;
        }

        return (
          <div className={className} {...attributes}>
            {name}
          </div>
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
  as?: `${AsContent}`;
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
    const { asChild, children, className, as = AsContent.Plain } = props;

    return (
      <CoreProduct.Description>
        {({ description: richDescription, plainDescription }) => {
          const attributes = {
            "data-testid": TestIds.productDescription,
          };

          // Determine which description to use based on the 'as' prop
          let description: string;

          switch (as) {
            case AsContent.Html:
              description = plainDescription || "";
              break;
            case AsContent.Ricos:
              description = JSON.stringify(richDescription) || "";
              break;
            case AsContent.Plain:
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
              props: { description },
              ref,
              content: description,
              attributes,
            });
            if (rendered) return rendered;
          }

          // Default rendering based on format
          if (as === AsContent.Html) {
            return (
              <div
                className={className}
                {...attributes}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            );
          }

          return (
            <div className={className} {...attributes}>
              {description}
            </div>
          );
        }}
      </CoreProduct.Description>
    );
  },
);

/**
 * Props for Product Price component
 */
export interface PriceProps
  extends AsChildProps<{ price: string; formattedPrice: string }> {}

/**
 * Displays the current product price with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Price className="text-3xl font-bold text-content-primary data-[discounted]:text-brand-primary" />
 *
 * // asChild with primitive
 * <Product.Price asChild>
 *   <span className="text-3xl font-bold text-content-primary" />
 * </Product.Price>
 *
 * // asChild with react component
 * <Product.Price asChild>
 *   {React.forwardRef(({price, formattedPrice, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-3xl font-bold text-content-primary">
 *       {formattedPrice}
 *     </span>
 *   ))}
 * </Product.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <SelectedVariant.Price>
      {({ price, compareAtPrice }) => {
        const attributes = {
          "data-testid": TestIds.productPrice,
          "data-discounted": compareAtPrice !== null,
        };

        const priceData = {
          price,
          formattedPrice: price,
        };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: priceData,
            ref,
            content: price,
            attributes,
          });
          if (rendered) return rendered;
        }

        return (
          <span className={className} {...attributes} ref={ref}>
            {price}
          </span>
        );
      }}
    </SelectedVariant.Price>
  );
});

/**
 * Props for Product CompareAtPrice component
 */
export interface CompareAtPriceProps
  extends AsChildProps<{ price: string; formattedPrice: string }> {}

/**
 * Displays the compare-at (original) price when on sale with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage (only shows when on sale)
 * <Product.CompareAtPrice className="text-lg text-content-faded line-through hidden data-[discounted]:inline" />
 *
 * // asChild with primitive
 * <Product.CompareAtPrice asChild>
 *   <span className="text-lg text-content-faded line-through" />
 * </Product.CompareAtPrice>
 *
 * // asChild with react component
 * <Product.CompareAtPrice asChild>
 *   {React.forwardRef(({formattedPrice, ...props}, ref) => (
 *     <span
 *       ref={ref}
 *       {...props}
 *       className="hidden data-[discounted]:inline text-lg text-content-faded line-through"
 *     >
 *       Was: {formattedPrice}
 *     </span>
 *   ))}
 * </Product.CompareAtPrice>
 * ```
 */
export const CompareAtPrice = React.forwardRef<
  HTMLElement,
  CompareAtPriceProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const testId = TestIds.productCompareAtPrice;

  return (
    <SelectedVariant.Price>
      {({ compareAtPrice }) => {
        const attributes = {
          "data-testid": testId,
          "data-discounted": compareAtPrice !== null,
        };

        // Don't render anything if there's no compare-at price
        if (!compareAtPrice) {
          return null;
        }

        const priceData = {
          price: compareAtPrice,
          formattedPrice: compareAtPrice,
        };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: priceData,
            ref,
            content: compareAtPrice,
            attributes,
          });
          if (rendered) return rendered;
        }

        return (
          <span className={className} {...attributes} ref={ref}>
            {compareAtPrice}
          </span>
        );
      }}
    </SelectedVariant.Price>
  );
});

/**
 * Props for Product Variants container
 */
export interface VariantsProps {
  children: React.ReactNode;
}

/**
 * Container for product variant selection system.
 * Does not render when there are no variants.
 *
 * @component
 * @example
 * ```tsx
 * <Product.Variants>
 *   <Product.VariantOptions>
 *     <Product.VariantOptionRepeater>
 *       <Option.Name className="text-lg font-medium mb-3" />
 *       <Option.Choices>
 *         <Option.ChoiceRepeater>
 *           <Choice.Text className="px-4 py-2 border rounded-lg" />
 *           <Choice.Color className="w-10 h-10 rounded-full border-4" />
 *         </Option.ChoiceRepeater>
 *       </Option.Choices>
 *     </Product.VariantOptionRepeater>
 *   </Product.VariantOptions>
 * </Product.Variants>
 * ```
 */
export function Variants(props: VariantsProps): React.ReactNode {
  return (
    <ProductVariantSelector.Options>
      {({ hasOptions }) =>
        hasOptions ? (
          <div data-testid="product-variants">{props.children}</div>
        ) : null
      }
    </ProductVariantSelector.Options>
  );
}

/**
 * Props for Product VariantOptions component
 */
export interface VariantOptionsProps {
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      options: any[];
    }
  >;
  emptyState?: React.ReactNode;
}

/**
 * Component that provides access to variant options.
 *
 * @component
 */
export function VariantOptions(props: VariantOptionsProps): React.ReactNode {
  return (
    <ProductVariantSelector.Options>
      {({ options, hasOptions }) => {
        if (!hasOptions) {
          return props.emptyState || null;
        }

        if (typeof props.children === "function") {
          return props.children({ options }, null);
        }

        return props.children;
      }}
    </ProductVariantSelector.Options>
  );
}

/**
 * Props for Product VariantOptionRepeater component
 */
export interface VariantOptionRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each variant option.
 *
 * @component
 */
export function VariantOptionRepeater(
  props: VariantOptionRepeaterProps,
): React.ReactNode {
  return (
    <ProductVariantSelector.Options>
      {({ options, hasOptions }) => {
        if (!hasOptions) return null;

        return (
          <>
            {options.map((option: any) => (
              <div key={option.name} data-testid="product-variant-option">
                <Option.Root option={option}>{props.children}</Option.Root>
              </div>
            ))}
          </>
        );
      }}
    </ProductVariantSelector.Options>
  );
}
