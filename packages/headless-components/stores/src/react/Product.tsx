import type { V3Product } from '@wix/auto_sdk_stores_products-v-3';
import { InventoryAvailabilityStatus } from '@wix/auto_sdk_stores_products-v-3';
import React from 'react';
import { Commerce } from '@wix/headless-ecom/react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { MediaGallery } from '@wix/headless-media/react';
import { Quantity as QuantityComponent } from '@wix/headless-components/react';
import * as CoreProduct from './core/Product.js';
import * as ProductVariantSelector from './core/ProductVariantSelector.js';
import * as ProductModifiers from './core/ProductModifiers.js';
import * as SelectedVariant from './core/SelectedVariant.js';
import * as Option from './Option.js';
import { AsContent } from './types.js';

/**
 * Context for sharing variant options state between components
 */
interface VariantsContextValue {
  hasOptions: boolean;
  options: any[];
}

const VariantsContext = React.createContext<VariantsContextValue | null>(null);

/**
 * Hook to access variants context
 */
export function useVariantsContext(): VariantsContextValue {
  const context = React.useContext(VariantsContext);
  if (!context) {
    throw new Error(
      'useVariantsContext must be used within a Product.Variants component',
    );
  }
  return context;
}

/**
 * Context for sharing modifier options state between components
 */
interface ModifiersContextValue {
  hasModifiers: boolean;
  modifiers: any[];
}

const ModifiersContext = React.createContext<ModifiersContextValue | null>(
  null,
);

/**
 * Hook to access modifiers context
 */
export function useModifiersContext(): ModifiersContextValue {
  const context = React.useContext(ModifiersContext);
  if (!context) {
    throw new Error(
      'useModifiersContext must be used within a Product.Modifiers component',
    );
  }
  return context;
}

enum TestIds {
  productRoot = 'product-root',
  productName = 'product-name',
  productDescription = 'product-description',
  productPrice = 'product-price',
  productCompareAtPrice = 'product-compare-at-price',
  productSlug = 'product-slug',
  productRaw = 'product-raw',
  productRibbon = 'product-ribbon',
  productStock = 'product-stock',
  productVariants = 'product-variants',
  productVariantOptions = 'product-variant-options',
  productVariantOption = 'product-variant-option',
  productModifiers = 'product-modifiers',
  productModifierOptions = 'product-modifier-options',
  productModifierOption = 'product-modifier-option',
  productMediaGallery = 'product-media-gallery',
  productAddToCart = 'product-add-to-cart',
  productActionAddToCart = 'product-action-add-to-cart',
  productActionBuyNow = 'product-action-buy-now',
  productActionPreOrder = 'product-action-pre-order',
  productQuantity = 'product-quantity',
  productQuantityDecrement = 'product-quantity-decrement',
  productQuantityInput = 'product-quantity-input',
  productQuantityIncrement = 'product-quantity-increment',
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
  const { children, product, ...attrs } = props;

  return (
    <CoreProduct.Root productServiceConfig={{ product: props.product }}>
      <MediaGallery.Root
        mediaGalleryServiceConfig={{
          media: props.product.media?.itemsInfo?.items ?? [],
        }}
      >
        <ProductVariantSelector.Root>
          <ProductModifiers.Root>
            <SelectedVariant.Root>
              <AsChildSlot {...attrs}>{children}</AsChildSlot>
            </SelectedVariant.Root>
          </ProductModifiers.Root>
        </ProductVariantSelector.Root>
      </MediaGallery.Root>
    </CoreProduct.Root>
  );
}

/**
 * Props for Product Name component
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
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
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.productName}
            customElement={children}
            customElementProps={{ name }}
            content={name}
          >
            <div>{name}</div>
          </AsChildSlot>
        );
      }}
    </CoreProduct.Name>
  );
});

/**
 * Props for Product Description component
 */
export interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    description: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
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
          // Determine which description to use based on the 'as' prop
          let description: string;

          switch (as) {
            case AsContent.Html:
              description = plainDescription || '';
              break;
            case AsContent.Ricos:
              description = JSON.stringify(richDescription) || '';
              break;
            case AsContent.Plain:
            default:
              // For plain text, we'll strip HTML tags from plainDescription
              description = plainDescription
                ? plainDescription.replace(/<[^>]*>/g, '')
                : '';
              break;
          }

          // Handle default rendering based on format
          if (!asChild || !children) {
            if (as === AsContent.Html) {
              return (
                <div
                  ref={ref as React.Ref<HTMLDivElement>}
                  className={className}
                  data-testid={TestIds.productDescription}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              );
            }
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.productDescription}
              customElement={children}
              customElementProps={{ description }}
              content={description}
            >
              <div>{description}</div>
            </AsChildSlot>
          );
        }}
      </CoreProduct.Description>
    );
  },
);

/**
 * Props for Product Price component
 */
export interface PriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price: string;
    formattedPrice: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

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
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.productPrice}
            data-discounted={compareAtPrice !== null}
            customElement={children}
            customElementProps={{
              price,
              formattedPrice: price,
            }}
            content={price}
          >
            <span>{price}</span>
          </AsChildSlot>
        );
      }}
    </SelectedVariant.Price>
  );
});

/**
 * Props for Product CompareAtPrice component
 */
export interface CompareAtPriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price: string;
    formattedPrice: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

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
        // Don't render anything if there's no compare-at price
        if (!compareAtPrice) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={testId}
            data-discounted={compareAtPrice !== null}
            customElement={children}
            customElementProps={{
              price: compareAtPrice,
              formattedPrice: compareAtPrice,
            }}
            content={compareAtPrice}
          >
            <span>{compareAtPrice}</span>
          </AsChildSlot>
        );
      }}
    </SelectedVariant.Price>
  );
});

/**
 * Props for Slug component
 * @interface SlugProps
 */
export interface SlugProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    slug: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Product Slug component that displays the product's slug
 *
 * @component
 * @order 6
 * @example
 * ```tsx
 * import { Product } from '@wix/stores/components';
 *
 * function ProductSlugLink() {
 *   return (
 *     <Product.Slug>
 *       {({ slug }) => (
 *         <a href={`/product/${slug}`}>
 *           View Product Details
 *         </a>
 *       )}
 *     </Product.Slug>
 *   );
 * }
 * ```
 */
export const Slug = React.forwardRef<HTMLElement, SlugProps>((props, ref) => {
  const { asChild, children, className } = props;
  const testId = TestIds.productSlug;

  return (
    <CoreProduct.Slug>
      {({ slug }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={testId}
            customElement={children}
            customElementProps={{ slug }}
            content={slug}
          >
            <span>{slug}</span>
          </AsChildSlot>
        );
      }}
    </CoreProduct.Slug>
  );
});

/**
 * Props for Product Raw component
 */
export interface RawProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    product: V3Product;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Provides access to the raw product data for advanced use cases.
 * Similar to Category.Raw, this should only be used when you need custom access to product data.
 *
 * @component
 * @example
 * ```tsx
 * // Custom rendering with forwardRef
 * <Product.Raw asChild>
 *   {React.forwardRef(({product, ...props}, ref) => (
 *     <div ref={ref} {...props} className="product-debug">
 *       <span>Product ID: {product._id}</span>
 *       <span>SKU: {product.sku}</span>
 *       <span>Inventory: {product.inventory?.quantity}</span>
 *     </div>
 *   ))}
 * </Product.Raw>
 * ```
 */
export const Raw = React.forwardRef<HTMLElement, RawProps>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <CoreProduct.Content>
      {({ product }) => {
        // Raw component should not render anything by default when not using asChild
        if (!asChild || !children) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.productRaw}
            customElement={children}
            customElementProps={{ product }}
          />
        );
      }}
    </CoreProduct.Content>
  );
});

/**
 * Props for Product Ribbon component
 */
export interface RibbonProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    ribbon: string | null;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the product ribbon with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Ribbon className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded" />
 *
 * // asChild with primitive
 * <Product.Ribbon asChild>
 *   <span className="ribbon-badge" />
 * </Product.Ribbon>
 *
 * // asChild with react component
 * <Product.Ribbon asChild>
 *   {React.forwardRef(({ribbon, ...props}, ref) => (
 *     <div ref={ref} {...props} className="ribbon-badge">
 *       {ribbon}
 *     </div>
 *   ))}
 * </Product.Ribbon>
 * ```
 */
export const Ribbon = React.forwardRef<HTMLElement, RibbonProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreProduct.Ribbon>
        {({ ribbon, hasRibbon }) => {
          // Don't render anything if there's no ribbon
          if (!hasRibbon) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.productRibbon}
              customElement={children}
              customElementProps={{ ribbon }}
              content={ribbon}
            >
              <span>{ribbon}</span>
            </AsChildSlot>
          );
        }}
      </CoreProduct.Ribbon>
    );
  },
);

/**
 * Props for Product Stock component
 */
export interface StockProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    status: 'in-stock' | 'limited-stock' | 'out-of-stock';
    label: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Custom labels for different stock states */
  labels?: {
    /** Label for in stock state */
    inStock?: string;
    /** Label for limited stock state (when quantity is low) */
    limitedStock?: string;
    /** Label for out of stock state */
    outOfStock?: string;
  };
}

/**
 * Displays the product stock status with customizable rendering and labels following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Stock
 *   className="stock-indicator"
 *   labels={{
 *     inStock: 'In Stock',
 *     limitedStock: 'Limited Stock',
 *     outOfStock: 'Out of Stock'
 *   }}
 * />
 *
 * // asChild with primitive
 * <Product.Stock asChild>
 *   <div className="stock-status" />
 * </Product.Stock>
 *
 * // asChild with react component
 * <Product.Stock
 *   labels={{
 *     inStock: 'Available',
 *     limitedStock: 'Low Stock',
 *     outOfStock: 'Sold Out'
 *   }}
 *   asChild
 * >
 *   {React.forwardRef(({status, label, ...props}, ref) => (
 *     <div
 *       ref={ref}
 *       {...props}
 *       className="flex items-center gap-1 data-[state='in-stock']:text-green-600 data-[state='limited-stock']:text-yellow-600 data-[state='out-of-stock']:text-red-600"
 *     >
 *       <div className="w-2 h-2 rounded-full data-[state='in-stock']:bg-green-500 data-[state='limited-stock']:bg-yellow-500 data-[state='out-of-stock']:bg-red-500" />
 *       <span className="text-xs font-medium">
 *         {label}
 *       </span>
 *     </div>
 *   ))}
 * </Product.Stock>
 * ```
 */
export const Stock = React.forwardRef<HTMLElement, StockProps>((props, ref) => {
  const { asChild, children, className, labels } = props;

  return (
    <CoreProduct.Content>
      {({ product }) => {
        const availabilityStatus = product.inventory?.availabilityStatus;

        // Default labels
        const defaultLabels = {
          inStock: 'In Stock',
          limitedStock: 'Partially Out of Stock',
          outOfStock: 'Out of Stock',
        };

        const finalLabels = { ...defaultLabels, ...labels };

        // Determine status based on availabilityStatus
        let status: 'in-stock' | 'limited-stock' | 'out-of-stock';
        let label: string;

        switch (availabilityStatus) {
          case InventoryAvailabilityStatus.IN_STOCK:
            status = 'in-stock';
            label = finalLabels.inStock;
            break;
          case InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK:
            status = 'limited-stock';
            label = finalLabels.limitedStock;
            break;
          case InventoryAvailabilityStatus.OUT_OF_STOCK:
          default:
            status = 'out-of-stock';
            label = finalLabels.outOfStock;
            break;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.productStock}
            data-state={status}
            customElement={children}
            customElementProps={{
              status,
              label,
            }}
            content={label}
          >
            <span>{label}</span>
          </AsChildSlot>
        );
      }}
    </CoreProduct.Content>
  );
});

/**
 * Props for Product Variants container
 */
export interface VariantsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for product variant selection system.
 * Does not render when there are no variants.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
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
 *
 * // asChild with primitive
 * <Product.Variants asChild>
 *   <section className="variant-section">
 *     <Product.VariantOptions>
 *       // variant options
 *     </Product.VariantOptions>
 *   </section>
 * </Product.Variants>
 *
 * // asChild with react component
 * <Product.Variants asChild>
 *   {React.forwardRef(({hasOptions, ...props}, ref) => (
 *     <section ref={ref} {...props} className="variant-section">
 *       {hasOptions && <h3>Choose Options</h3>}
 *       {props.children}
 *     </section>
 *   ))}
 * </Product.Variants>
 * ```
 */
export const Variants = React.forwardRef<HTMLElement, VariantsProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <ProductVariantSelector.Options>
        {({ hasOptions, options }) => {
          if (!hasOptions) return null;

          const contextValue: VariantsContextValue = {
            hasOptions,
            options,
          };

          return (
            <VariantsContext.Provider value={contextValue}>
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                data-testid={TestIds.productVariants}
                customElement={children}
              >
                <div>{React.isValidElement(children) ? children : null}</div>
              </AsChildSlot>
            </VariantsContext.Provider>
          );
        }}
      </ProductVariantSelector.Options>
    );
  },
);

/**
 * Props for Product VariantOptions component
 */
export interface VariantOptionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Component that provides access to variant options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.VariantOptions emptyState={<div>No options available</div>}>
 *   <Product.VariantOptionRepeater>
 *     <Option.Name />
 *     <Option.Choices>
 *       <Option.ChoiceRepeater>
 *         <Choice.Text />
 *       </Option.ChoiceRepeater>
 *     </Option.Choices>
 *   </Product.VariantOptionRepeater>
 * </Product.VariantOptions>
 *
 * // Simple container usage
 * <Product.VariantOptions emptyState={<div>No options</div>}>
 *   <div className="options-container">
 *     <Product.VariantOptionRepeater>
 *       // option content
 *     </Product.VariantOptionRepeater>
 *   </div>
 * </Product.VariantOptions>
 * ```
 */
export const VariantOptions = React.forwardRef<
  HTMLDivElement,
  VariantOptionsProps
>((props, ref) => {
  const { children, emptyState } = props;
  const { hasOptions } = useVariantsContext();

  if (!hasOptions) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.productVariantOptions,
  };

  return (
    <div {...attributes} ref={ref}>
      {children}
    </div>
  );
});

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
export const VariantOptionRepeater = React.forwardRef<
  HTMLElement,
  VariantOptionRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { hasOptions, options } = useVariantsContext();

  if (!hasOptions) return null;

  return (
    <>
      {options.map((option: any) => {
        return (
          <ProductVariantSelector.Option key={option._id} option={option}>
            {(optionData) => (
              <Option.Root
                option={{
                  ...optionData,
                  mandatory: false,
                }}
              >
                {children as React.ReactElement}
              </Option.Root>
            )}
          </ProductVariantSelector.Option>
        );
      })}
    </>
  );
});

/**
 * Props for Product Modifiers container
 */
export interface ModifiersProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for product modifier system.
 * Does not render when there are no modifiers.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Modifiers>
 *   <Product.ModifierOptions>
 *     <Product.ModifierOptionRepeater>
 *       <Option.Name className="text-lg font-medium mb-3" />
 *       <Option.Choices>
 *         <Option.ChoiceRepeater>
 *           <Choice.Text className="px-4 py-2 border rounded-lg" />
 *           <Choice.Color className="w-10 h-10 rounded-full border-4" />
 *           <Choice.FreeText className="w-full p-3 border rounded-lg resize-none" />
 *         </Option.ChoiceRepeater>
 *       </Option.Choices>
 *     </Product.ModifierOptionRepeater>
 *   </Product.ModifierOptions>
 * </Product.Modifiers>
 *
 * // asChild with primitive
 * <Product.Modifiers asChild>
 *   <section className="modifier-section">
 *     <Product.ModifierOptions>
 *       // modifier options
 *     </Product.ModifierOptions>
 *   </section>
 * </Product.Modifiers>
 *
 * // asChild with react component
 * <Product.Modifiers asChild>
 *   {React.forwardRef(({hasModifiers, ...props}, ref) => (
 *     <section ref={ref} {...props} className="modifier-section">
 *       {hasModifiers && <h3>Customize Your Product</h3>}
 *       {props.children}
 *     </section>
 *   ))}
 * </Product.Modifiers>
 * ```
 */
export const Modifiers = React.forwardRef<HTMLElement, ModifiersProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <ProductModifiers.Modifiers>
        {({ hasModifiers, modifiers }) => {
          if (!hasModifiers) return null;

          const contextValue: ModifiersContextValue = {
            hasModifiers,
            modifiers,
          };

          return (
            <ModifiersContext.Provider value={contextValue}>
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                data-testid={TestIds.productModifiers}
                customElement={children}
              >
                <div>{React.isValidElement(children) ? children : null}</div>
              </AsChildSlot>
            </ModifiersContext.Provider>
          );
        }}
      </ProductModifiers.Modifiers>
    );
  },
);

/**
 * Props for Product ModifierOptions component
 */
export interface ModifierOptionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Component that provides access to modifier options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.ModifierOptions emptyState={<div>No options available</div>}>
 *   <Product.ModifierOptionRepeater>
 *     <Option.Name />
 *     <Option.Choices>
 *       <Option.ChoiceRepeater>
 *         <Choice.Text />
 *         <Choice.Color />
 *         <Choice.FreeText />
 *       </Option.ChoiceRepeater>
 *     </Option.Choices>
 *   </Product.ModifierOptionRepeater>
 * </Product.ModifierOptions>
 *
 * // Simple container usage
 * <Product.ModifierOptions emptyState={<div>No options</div>}>
 *   <div className="options-container">
 *     <Product.ModifierOptionRepeater>
 *       // option content
 *     </Product.ModifierOptionRepeater>
 *   </div>
 * </Product.ModifierOptions>
 * ```
 */
export const ModifierOptions = React.forwardRef<
  HTMLDivElement,
  ModifierOptionsProps
>((props, ref) => {
  const { children, emptyState } = props;
  const { hasModifiers } = useModifiersContext();

  if (!hasModifiers) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.productModifierOptions,
  };

  return (
    <div {...attributes} ref={ref}>
      {children}
    </div>
  );
});

/**
 * Props for Product ModifierOptionRepeater component
 */
export interface ModifierOptionRepeaterProps {
  children: React.ReactNode;
  allowedTypes?: ('color' | 'text' | 'free-text')[]; // default - ['color', 'text', 'free-text'] - the types of the options to render
}

/**
 * Repeater component that renders children for each modifier option.
 *
 * @component
 */
export const ModifierOptionRepeater = React.forwardRef<
  HTMLElement,
  ModifierOptionRepeaterProps
>((props, _ref) => {
  const { children, allowedTypes = ['color', 'text', 'free-text'] } = props;
  const { hasModifiers, modifiers } = useModifiersContext();

  if (!hasModifiers) return null;

  return (
    <>
      {modifiers.map((modifier: any) => {
        return (
          <ProductModifiers.Modifier key={modifier._id} modifier={modifier}>
            {(modifierData) => (
              <Option.Root
                option={{
                  ...modifierData,
                }}
                allowedTypes={allowedTypes}
              >
                {children as React.ReactElement}
              </Option.Root>
            )}
          </ProductModifiers.Modifier>
        );
      })}
    </>
  );
});

/**
 * Props for Product MediaGallery component
 */
export interface ProductMediaGalleryProps {
  children: React.ReactNode;
  infinite?: boolean;
  autoPlay?: {
    direction?: 'forward' | 'backward';
    intervalMs?: number;
  };
}

/**
 * Container for product media gallery.
 * Renders a MediaGallery.Root with the product media items.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.MediaGallery
 *   infinite={true}
 *   autoPlay={{ direction: "forward", intervalMs: 5000 }}
 * >
 *   <MediaGallery.Viewport />
 *   <MediaGallery.Previous />
 *   <MediaGallery.Next />
 *   <MediaGallery.Thumbnails>
 *     <MediaGallery.ThumbnailRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </MediaGallery.ThumbnailRepeater>
 *   </MediaGallery.Thumbnails>
 * </Product.MediaGallery>
 *
 * // Simple usage
 * <Product.MediaGallery>
 *   <MediaGallery.Viewport className="rounded-lg" />
 * </Product.MediaGallery>
 * ```
 */
export const ProductMediaGallery = React.forwardRef<
  HTMLDivElement,
  ProductMediaGalleryProps
>((props, ref) => {
  const { children, infinite, autoPlay, ...otherProps } = props;

  return (
    <CoreProduct.Media>
      {({ mediaItems, mainMedia }) => {
        const media =
          mediaItems.length > 0 ? mediaItems : mainMedia ? [mainMedia] : [];

        const mediaGalleryServiceConfig = {
          media,
          infinite,
          autoPlay,
        };

        const attributes = {
          'data-testid': TestIds.productMediaGallery,
        };

        return (
          <div {...attributes} ref={ref} {...otherProps}>
            <MediaGallery.Root
              mediaGalleryServiceConfig={mediaGalleryServiceConfig}
            >
              {children}
            </MediaGallery.Root>
          </div>
        );
      }}
    </CoreProduct.Media>
  );
});

/**
 * Alias for ProductMediaGallery to match the documented API
 */
export { ProductMediaGallery as MediaGallery };

/**
 * Props for Product Quantity component
 */
export interface ProductQuantityProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    selectedQuantity: number;
    availableQuantity: number | null;
    inStock: boolean;
    isPreOrderEnabled: boolean;
    setSelectedQuantity: (quantity: number) => void;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Threshold for showing "low stock" message (default: 10) */
  lowStockThreshold?: number;
}

/**
 * Props for Product Quantity sub-components
 */
export interface ProductQuantitySubComponentProps {
  /** CSS classes to apply to the element */
  className?: string;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    disabled: boolean;
  }>;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Product quantity selector component that integrates with the selected variant.
 * Provides quantity controls with stock validation and pre-order support.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Quantity className="flex items-center gap-3" />
 *
 * // With custom low stock threshold
 * <Product.Quantity lowStockThreshold={5} className="flex items-center gap-3" />
 *
 * // Custom rendering with asChild
 * <Product.Quantity asChild>
 *   {({ selectedQuantity, availableQuantity, inStock, incrementQuantity, decrementQuantity }) => (
 *     <div className="flex items-center gap-3">
 *       <div className="flex items-center border border-brand-light rounded-lg">
 *         <button
 *           onClick={decrementQuantity}
 *           disabled={selectedQuantity <= 1 || (!inStock && !isPreOrderEnabled)}
 *           className="px-3 py-2 hover:bg-surface-primary disabled:opacity-50"
 *         >
 *           -
 *         </button>
 *         <span className="px-4 py-2 border-x border-brand-light min-w-[3rem] text-center">
 *           {selectedQuantity}
 *         </span>
 *         <button
 *           onClick={incrementQuantity}
 *           disabled={availableQuantity && selectedQuantity >= availableQuantity}
 *           className="px-3 py-2 hover:bg-surface-primary disabled:opacity-50"
 *         >
 *           +
 *         </button>
 *       </div>
 *     </div>
 *   )}
 * </Product.Quantity>
 *
 * // Using with Quantity components
 * <Product.Quantity asChild>
 *   {({ selectedQuantity, availableQuantity, inStock, incrementQuantity, decrementQuantity }) => (
 *     <Quantity.Root
 *       initialValue={selectedQuantity}
 *       onValueChange={(value) => {
 *         if (value > selectedQuantity) incrementQuantity();
 *         else if (value < selectedQuantity) decrementQuantity();
 *       }}
 *     >
 *       <div className="flex items-center gap-2">
 *         <div className="flex items-center border border-brand-light rounded-lg">
 *           <Quantity.Decrement
 *             className="px-3 py-1 hover:bg-surface-primary transition-colors"
 *             disabled={selectedQuantity <= 1 || (!inStock && !isPreOrderEnabled)}
 *           />
 *           <Quantity.Input
 *             disabled={true}
 *             className="w-16 text-center py-1 border-x border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
 *           />
 *           <Quantity.Increment
 *             className="px-3 py-1 hover:bg-surface-primary transition-colors"
 *             disabled={availableQuantity && selectedQuantity >= availableQuantity}
 *           />
 *         </div>
 *       </div>
 *     </Quantity.Root>
 *   )}
 * </Product.Quantity>
 * ```
 */
export const ProductQuantity = React.forwardRef<
  HTMLDivElement,
  ProductQuantityProps
>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <ProductVariantSelector.Stock>
      {({
        inStock,
        isPreOrderEnabled,
        availableQuantity,
        selectedQuantity,
        setSelectedQuantity,
        incrementQuantity,
        decrementQuantity,
      }) => {
        const renderProps = {
          selectedQuantity,
          availableQuantity,
          inStock,
          isPreOrderEnabled,
          setSelectedQuantity,
          incrementQuantity,
          decrementQuantity,
        };

        if (asChild && children) {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.productQuantity}
              customElement={children}
              customElementProps={renderProps}
            />
          );
        }

        return (
          <QuantityComponent.Root
            initialValue={selectedQuantity}
            onValueChange={setSelectedQuantity}
            className={className}
            ref={ref as React.Ref<HTMLDivElement>}
            data-testid={TestIds.productQuantity}
          >
            {children as React.ReactNode}
          </QuantityComponent.Root>
        );
      }}
    </ProductVariantSelector.Stock>
  );
});

/**
 * Product Quantity Decrement component
 */
export const ProductQuantityDecrement = React.forwardRef<
  HTMLButtonElement,
  ProductQuantitySubComponentProps
>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <ProductVariantSelector.Stock>
      {({ selectedQuantity, inStock, isPreOrderEnabled }) => {
        const disabled =
          selectedQuantity <= 1 || (!inStock && !isPreOrderEnabled);

        if (asChild && children) {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.productQuantityDecrement}
              customElement={children}
              customElementProps={{ disabled }}
            />
          );
        }

        return (
          <QuantityComponent.Decrement
            className={className}
            ref={ref as React.Ref<HTMLButtonElement>}
            data-testid={TestIds.productQuantityDecrement}
            disabled={disabled}
          />
        );
      }}
    </ProductVariantSelector.Stock>
  );
});

/**
 * Product Quantity Input component
 */
export const ProductQuantityInput = React.forwardRef<
  HTMLInputElement,
  ProductQuantitySubComponentProps
>((props, ref) => {
  const { asChild, children, className, disabled } = props;

  return (
    <ProductVariantSelector.Stock>
      {() => {
        if (asChild && children) {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              disabled={disabled}
              data-testid={TestIds.productQuantityInput}
              customElement={children}
              customElementProps={{}}
            />
          );
        }

        return (
          <QuantityComponent.Input
            className={className}
            disabled={disabled}
            ref={ref as React.Ref<HTMLInputElement>}
            data-testid={TestIds.productQuantityInput}
          />
        );
      }}
    </ProductVariantSelector.Stock>
  );
});

/**
 * Product Quantity Increment component
 */
export const ProductQuantityIncrement = React.forwardRef<
  HTMLButtonElement,
  ProductQuantitySubComponentProps
>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <ProductVariantSelector.Stock>
      {({
        selectedQuantity,
        availableQuantity,
        inStock,
        isPreOrderEnabled,
      }) => {
        const disabled =
          (!!availableQuantity && selectedQuantity >= availableQuantity) ||
          (!inStock && !isPreOrderEnabled);

        if (asChild && children) {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.productQuantityIncrement}
              customElement={children}
              customElementProps={{ disabled }}
            />
          );
        }

        return (
          <QuantityComponent.Increment
            className={className}
            ref={ref as React.Ref<HTMLButtonElement>}
            data-testid={TestIds.productQuantityIncrement}
            disabled={disabled}
          />
        );
      }}
    </ProductVariantSelector.Stock>
  );
});

/**
 * Props for Product Action components following the documented API
 */
export interface ProductActionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Text label for the button */
  label: string;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
  /** CSS classes to apply to the button */
  className?: string;
  /** Content to display when loading */
  loadingState?: string | React.ReactNode;
}

/**
 * Add to cart action button component following the documented API.
 * Automatically integrates with the selected variant and handles loading states.
 */
export const ProductActionAddToCart = React.forwardRef<
  HTMLButtonElement,
  ProductActionProps
>((props, ref) => {
  const { asChild, children, className, label, loadingState } = props;

  return (
    <SelectedVariant.Actions>
      {({
        lineItems,
        canAddToCart,
        isLoading,
        addToCart,
        isPreOrderEnabled,
      }) => {
        if (isPreOrderEnabled) {
          return null;
        }

        const onClick = addToCart;
        const disabled = !canAddToCart || isLoading;

        if (asChild && children) {
          return (
            <Commerce.Actions.AddToCart lineItems={lineItems} asChild={asChild}>
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                data-testid={TestIds.productActionAddToCart}
                data-in-progress={isLoading}
                customElement={children}
                customElementProps={{
                  disabled,
                  isLoading,
                  onClick,
                }}
              />
            </Commerce.Actions.AddToCart>
          );
        }

        return (
          <Commerce.Actions.AddToCart
            ref={ref}
            label={label}
            lineItems={lineItems}
            className={className}
            disabled={disabled}
            loadingState={loadingState}
            data-testid={TestIds.productActionAddToCart}
            data-in-progress={isLoading}
          />
        );
      }}
    </SelectedVariant.Actions>
  );
});

/**
 * Buy Now action button component following the documented API.
 * Bypasses the cart and redirects directly to checkout.
 */
export const ProductActionBuyNow = React.forwardRef<
  HTMLButtonElement,
  ProductActionProps
>((props, ref) => {
  const { asChild, children, className, label, loadingState } = props;

  return (
    <SelectedVariant.Actions>
      {({
        lineItems,
        canAddToCart,
        isLoading,
        buyNow,
        inStock,
        isPreOrderEnabled,
      }) => {
        if (!inStock || isPreOrderEnabled) {
          return null;
        }

        const onClick = buyNow;
        const disabled = !canAddToCart || isLoading;

        if (asChild && children) {
          return (
            <Commerce.Actions.BuyNow lineItems={lineItems} asChild={asChild}>
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                data-testid={TestIds.productActionBuyNow}
                data-in-progress={isLoading}
                customElement={children}
                customElementProps={{
                  disabled,
                  isLoading,
                  onClick,
                }}
              />
            </Commerce.Actions.BuyNow>
          );
        }

        return (
          <Commerce.Actions.BuyNow
            ref={ref}
            label={label}
            lineItems={lineItems}
            className={className}
            disabled={disabled}
            loadingState={loadingState}
            data-testid={TestIds.productActionBuyNow}
            data-in-progress={isLoading}
          />
        );
      }}
    </SelectedVariant.Actions>
  );
});

/**
 * Pre-Order action button component following the documented API.
 * Handles pre-order functionality when products are not in stock.
 */
export const ProductActionPreOrder = React.forwardRef<
  HTMLButtonElement,
  ProductActionProps
>((props, ref) => {
  const { asChild, children, className, label, loadingState } = props;

  return (
    <SelectedVariant.Actions>
      {({ lineItems, isLoading, addToCart, isPreOrderEnabled }) => {
        if (!isPreOrderEnabled) {
          return null;
        }

        const canPreOrder = !isLoading;
        const onClick = addToCart;
        const disabled = !canPreOrder;

        if (asChild && children) {
          return (
            <Commerce.Actions.AddToCart lineItems={lineItems} asChild={asChild}>
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                data-testid={TestIds.productActionPreOrder}
                data-in-progress={isLoading}
                customElement={children}
                customElementProps={{
                  disabled,
                  isLoading,
                  onClick,
                }}
              />
            </Commerce.Actions.AddToCart>
          );
        }

        return (
          <Commerce.Actions.AddToCart
            ref={ref}
            label={label}
            lineItems={lineItems}
            className={className}
            disabled={disabled}
            loadingState={loadingState}
            data-testid={TestIds.productActionPreOrder}
            data-in-progress={isLoading}
          />
        );
      }}
    </SelectedVariant.Actions>
  );
});

/**
 * Actions namespace containing all product action components
 * following the documented API: Product.Action.AddToCart, Product.Action.BuyNow, Product.Action.PreOrder
 */
export const Action = {
  /** Add to cart action button */
  AddToCart: ProductActionAddToCart,
  /** Buy now action button */
  BuyNow: ProductActionBuyNow,
  /** Pre-order action button */
  PreOrder: ProductActionPreOrder,
} as const;

/**
 * Quantity namespace containing the product quantity component
 * following the documented API: Product.Quantity
 */
export const Quantity = {
  /** Product quantity selector component */
  Root: ProductQuantity,
  /** Product quantity decrement component */
  Decrement: ProductQuantityDecrement,
  /** Product quantity input component */
  Input: ProductQuantityInput,
  /** Product quantity increment component */
  Increment: ProductQuantityIncrement,
} as const;
