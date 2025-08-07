import React from "react";
import * as CoreProduct from "./core/Product.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import * as ProductModifiers from "./core/ProductModifiers.js";
import * as SelectedVariant from "./core/SelectedVariant.js";
import type { V3Product } from "@wix/auto_sdk_stores_products-v-3";

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
 *       <Product.Price className="text-2xl text-brand-primary" />
 *       <Product.Variants>
 *         <Product.VariantOptions>
 *           <Product.VariantOptionRepeater />
 *         </Product.VariantOptions>
 *       </Product.Variants>
 *       <Product.Action.AddToCart label="Add to Cart" />
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
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, { name: string }>;
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
  return (
    <CoreProduct.Name>
      {({ name }) => {
        if (props.asChild && props.children) {
          return props.children({ name }, ref);
        }

        return (
          <h1
            ref={ref as React.Ref<HTMLHeadingElement>}
            className={props.className}
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

          if (asChild && children) {
            return children({ description: content }, ref);
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

/**
 * Props for Product Price component
 */
export interface PriceProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    { price: string; formattedPrice: string }
  >;
  className?: string;
}

/**
 * Displays the current product price following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * <Product.Price className="text-3xl font-bold text-content-primary data-[discounted]:bold" />
 * ```
 */
export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  return (
    <SelectedVariant.Price>
      {({ price, compareAtPrice }) => {
        const isDiscounted = compareAtPrice !== null;

        if (props.asChild && props.children) {
          return props.children({ price, formattedPrice: price }, ref);
        }

        return (
          <span
            ref={ref as React.Ref<HTMLSpanElement>}
            className={props.className}
            data-testid="product-price"
            data-discounted={isDiscounted ? "true" : undefined}
          >
            {price}
          </span>
        );
      }}
    </SelectedVariant.Price>
  );
});

Price.displayName = "Product.Price";

/**
 * Props for Product CompareAtPrice component
 */
export interface CompareAtPriceProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    { price: string; formattedPrice: string }
  >;
  className?: string;
}

/**
 * Displays the compare-at (original) price when on sale following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * <Product.CompareAtPrice className="text-lg text-content-faded line-through hidden data-[discounted]:inline" />
 * ```
 */
export const CompareAtPrice = React.forwardRef<
  HTMLElement,
  CompareAtPriceProps
>((props, ref) => {
  return (
    <SelectedVariant.Price>
      {({ compareAtPrice }) => {
        if (!compareAtPrice) return null;

        if (props.asChild && props.children) {
          return props.children(
            { price: compareAtPrice, formattedPrice: compareAtPrice },
            ref,
          );
        }

        return (
          <span
            ref={ref as React.Ref<HTMLSpanElement>}
            className={props.className}
            data-testid="product-compare-at-price"
            data-discounted="true"
          >
            {compareAtPrice}
          </span>
        );
      }}
    </SelectedVariant.Price>
  );
});

CompareAtPrice.displayName = "Product.CompareAtPrice";

/**
 * Props for Product Variants container
 */
export interface VariantsProps {
  children: React.ReactNode;
}

/**
 * Container for product variant selection system. Does not render when there are no variants.
 *
 * @component
 * @example
 * ```tsx
 * <Product.Variants>
 *   <Product.VariantOptions>
 *     <Product.VariantOptionRepeater />
 *   </Product.VariantOptions>
 * </Product.Variants>
 * ```
 */
export function Variants(props: VariantsProps): React.ReactNode {
  return (
    <ProductVariantSelector.Options>
      {({ hasOptions }) => {
        if (!hasOptions) return null;

        return <div data-testid="product-variants">{props.children}</div>;
      }}
    </ProductVariantSelector.Options>
  );
}

/**
 * Props for Product VariantOptions container
 */
export interface VariantOptionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for variant options list.
 */
export function VariantOptions(props: VariantOptionsProps): React.ReactNode {
  return (
    <ProductVariantSelector.Options>
      {({ hasOptions }) => {
        if (!hasOptions && props.emptyState) {
          return <>{props.emptyState}</>;
        }

        if (!hasOptions) return null;

        return <>{props.children}</>;
      }}
    </ProductVariantSelector.Options>
  );
}

/**
 * Props for Product VariantOptionRepeater
 */
export interface VariantOptionRepeaterProps {
  children: React.ForwardRefRenderFunction<HTMLElement, { option: any }>;
}

/**
 * Repeater component that renders individual variant options.
 */
export function VariantOptionRepeater(
  props: VariantOptionRepeaterProps,
): React.ReactNode {
  return (
    <ProductVariantSelector.Options>
      {({ options }) => (
        <>
          {options.map((option, index) => (
            <ProductVariantSelector.Option
              key={option.name || index}
              option={option}
            >
              {() => (
                <div data-testid="product-variant-option">
                  {props.children({ option }, React.createRef())}
                </div>
              )}
            </ProductVariantSelector.Option>
          ))}
        </>
      )}
    </ProductVariantSelector.Options>
  );
}

/**
 * Props for Product Modifiers container
 */
export interface ModifiersProps {
  children: React.ReactNode;
}

/**
 * Container for product modifiers selection system. Does not render when there are no modifiers.
 *
 * @component
 * @example
 * ```tsx
 * <Product.Modifiers>
 *   <Product.ModifierOptions>
 *     <Product.ModifierOptionRepeater allowedTypes={['color', 'text', 'free-text']} />
 *   </Product.ModifierOptions>
 * </Product.Modifiers>
 * ```
 */
export function Modifiers(props: ModifiersProps): React.ReactNode {
  return (
    <ProductModifiers.Modifiers>
      {({ hasModifiers }) => {
        if (!hasModifiers) return null;

        return <div data-testid="product-modifiers">{props.children}</div>;
      }}
    </ProductModifiers.Modifiers>
  );
}

/**
 * Props for Product ModifierOptions container
 */
export interface ModifierOptionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for modifier options list.
 */
export function ModifierOptions(props: ModifierOptionsProps): React.ReactNode {
  return (
    <ProductModifiers.Modifiers>
      {({ hasModifiers }) => {
        if (!hasModifiers && props.emptyState) {
          return <>{props.emptyState}</>;
        }

        if (!hasModifiers) return null;

        return <>{props.children}</>;
      }}
    </ProductModifiers.Modifiers>
  );
}

/**
 * Props for Product ModifierOptionRepeater
 */
export interface ModifierOptionRepeaterProps {
  children: React.ForwardRefRenderFunction<HTMLElement, { modifier: any }>;
  allowedTypes?: ("color" | "text" | "free-text")[];
}

/**
 * Repeater component that renders individual modifier options.
 */
export function ModifierOptionRepeater(
  props: ModifierOptionRepeaterProps,
): React.ReactNode {
  const { allowedTypes = ["color", "text", "free-text"] } = props;

  return (
    <ProductModifiers.Modifiers>
      {({ modifiers }) => (
        <>
          {modifiers.map((modifier, index) => (
            <ProductModifiers.Modifier
              key={modifier.name || index}
              modifier={modifier}
            >
              {({ isFreeText, hasChoices }) => {
                // Determine modifier type based on its properties
                let modifierType: "color" | "text" | "free-text" = "text";
                if (isFreeText) {
                  modifierType = "free-text";
                } else if (hasChoices) {
                  // Check if any choice has color information
                  modifierType = "text"; // Default to text, could be enhanced to detect color
                }

                if (!allowedTypes.includes(modifierType)) return null;

                return (
                  <div
                    data-testid="product-modifier-option"
                    data-type={modifierType}
                  >
                    {props.children({ modifier }, React.createRef())}
                  </div>
                );
              }}
            </ProductModifiers.Modifier>
          ))}
        </>
      )}
    </ProductModifiers.Modifiers>
  );
}

/**
 * Props for Product Quantity container
 */
export interface QuantityProps {
  children: React.ReactNode;
  steps?: number;
}

/**
 * Container for quantity selection controls.
 *
 * @component
 * @example
 * ```tsx
 * <Product.Quantity steps={1}>
 *   <Product.Quantity.Decrement />
 *   <Product.Quantity.Input />
 *   <Product.Quantity.Increment />
 * </Product.Quantity>
 * ```
 */
export function Quantity(props: QuantityProps): React.ReactNode {
  return (
    <ProductVariantSelector.Stock>
      {({ selectedQuantity, incrementQuantity, decrementQuantity }) => (
        <div data-testid="product-quantity">
          {React.Children.map(props.children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                quantity: selectedQuantity,
                increment: () => incrementQuantity(),
                decrement: () => decrementQuantity(),
                steps: props.steps || 1,
              } as any);
            }
            return child;
          })}
        </div>
      )}
    </ProductVariantSelector.Stock>
  );
}

/**
 * Props for quantity increment/decrement buttons
 */
export interface QuantityButtonProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
  className?: string;
  // Internal props passed from Quantity container
  increment?: () => void;
  decrement?: () => void;
}

/**
 * Quantity increment button
 */
export const QuantityIncrement = React.forwardRef<
  HTMLButtonElement,
  QuantityButtonProps
>((props, ref) => {
  if (props.asChild && props.children) {
    return props.children({}, ref);
  }

  return (
    <button
      ref={ref}
      className={props.className}
      onClick={props.increment}
      data-testid="quantity-increment"
    >
      +
    </button>
  );
});

QuantityIncrement.displayName = "Product.Quantity.Increment";

/**
 * Quantity decrement button
 */
export const QuantityDecrement = React.forwardRef<
  HTMLButtonElement,
  QuantityButtonProps
>((props, ref) => {
  if (props.asChild && props.children) {
    return props.children({}, ref);
  }

  return (
    <button
      ref={ref}
      className={props.className}
      onClick={props.decrement}
      data-testid="quantity-decrement"
    >
      -
    </button>
  );
});

QuantityDecrement.displayName = "Product.Quantity.Decrement";

/**
 * Props for quantity input
 */
export interface QuantityInputProps {
  asChild?: boolean;
  disabled?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLInputElement, {}>;
  className?: string;
  // Internal props passed from Quantity container
  quantity?: number;
}

/**
 * Quantity input field
 */
export const QuantityInput = React.forwardRef<
  HTMLInputElement,
  QuantityInputProps
>((props, ref) => {
  if (props.asChild && props.children) {
    return props.children({}, ref);
  }

  return (
    <input
      ref={ref}
      type="number"
      value={props.quantity || 1}
      className={props.className}
      disabled={props.disabled}
      data-testid="quantity-input"
      readOnly
    />
  );
});

QuantityInput.displayName = "Product.Quantity.Input";

// Attach sub-components to Quantity
(Quantity as any).Increment = QuantityIncrement;
(Quantity as any).Decrement = QuantityDecrement;
(Quantity as any).Input = QuantityInput;

/**
 * Props for Product MediaGallery
 */
export interface MediaGalleryProps {
  children: React.ReactNode;
  infinite?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  direction?: "forward" | "backward" | "top" | "bottom";
}

/**
 * Container for product media gallery.
 *
 * @component
 * @example
 * ```tsx
 * <Product.MediaGallery infinite={true} autoPlay={false}>
 *   <MediaGallery.Viewport />
 *   <MediaGallery.Previous />
 *   <MediaGallery.Next />
 * </Product.MediaGallery>
 * ```
 */
export function MediaGallery(props: MediaGalleryProps): React.ReactNode {
  return (
    <CoreProduct.Media>
      {() => <div data-testid="product-media-gallery">{props.children}</div>}
    </CoreProduct.Media>
  );
}

/**
 * Action namespace for purchase actions
 */
export const Action = {
  /**
   * Props for action buttons
   */
  AddToCart: React.forwardRef<
    HTMLButtonElement,
    {
      asChild?: boolean;
      label: string;
      children?: React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          disabled: boolean;
          isLoading: boolean;
          onClick: () => Promise<void>;
        }
      >;
      className?: string;
    }
  >((props, ref) => {
    return (
      <SelectedVariant.Actions>
        {({ addToCart, canAddToCart, isLoading }) => {
          if (props.asChild && props.children) {
            return props.children(
              {
                disabled: !canAddToCart,
                isLoading,
                onClick: addToCart,
              },
              ref,
            );
          }

          return (
            <button
              ref={ref}
              className={props.className}
              onClick={addToCart}
              disabled={!canAddToCart || isLoading}
              data-in-progress={isLoading ? "true" : undefined}
            >
              {isLoading ? "Adding..." : props.label}
            </button>
          );
        }}
      </SelectedVariant.Actions>
    );
  }),

  BuyNow: React.forwardRef<
    HTMLButtonElement,
    {
      asChild?: boolean;
      label: string;
      children?: React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          disabled: boolean;
          isLoading: boolean;
          onClick: () => Promise<void>;
        }
      >;
      className?: string;
    }
  >((props, ref) => {
    return (
      <SelectedVariant.Actions>
        {({ buyNow, canAddToCart, isLoading }) => {
          if (props.asChild && props.children) {
            return props.children(
              {
                disabled: !canAddToCart,
                isLoading,
                onClick: buyNow,
              },
              ref,
            );
          }

          return (
            <button
              ref={ref}
              className={props.className}
              onClick={buyNow}
              disabled={!canAddToCart || isLoading}
              data-in-progress={isLoading ? "true" : undefined}
            >
              {isLoading ? "Processing..." : props.label}
            </button>
          );
        }}
      </SelectedVariant.Actions>
    );
  }),

  PreOrder: React.forwardRef<
    HTMLButtonElement,
    {
      asChild?: boolean;
      label: string;
      children?: React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          disabled: boolean;
          isLoading: boolean;
          onClick: () => Promise<void>;
        }
      >;
      className?: string;
    }
  >((props, ref) => {
    return (
      <SelectedVariant.Actions>
        {({ addToCart, isPreOrderEnabled, isLoading }) => {
          if (!isPreOrderEnabled) return null;

          if (props.asChild && props.children) {
            return props.children(
              {
                disabled: !isPreOrderEnabled,
                isLoading,
                onClick: addToCart,
              },
              ref,
            );
          }

          return (
            <button
              ref={ref}
              className={props.className}
              onClick={addToCart}
              disabled={!isPreOrderEnabled || isLoading}
              data-in-progress={isLoading ? "true" : undefined}
            >
              {isLoading ? "Processing..." : props.label}
            </button>
          );
        }}
      </SelectedVariant.Actions>
    );
  }),
};

Action.AddToCart.displayName = "Product.Action.AddToCart";
Action.BuyNow.displayName = "Product.Action.BuyNow";
Action.PreOrder.displayName = "Product.Action.PreOrder";
