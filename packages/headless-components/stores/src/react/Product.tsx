import type { V3Product } from '@wix/auto_sdk_stores_products-v-3';
import React from 'react';
import { renderAsChild, type AsChildProps } from '../utils/index.js';
import { MediaGallery } from '@wix/headless-media/react';
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
  productVariants = 'product-variants',
  productVariantOptions = 'product-variant-options',
  productVariantOption = 'product-variant-option',
  productModifiers = 'product-modifiers',
  productModifierOptions = 'product-modifier-options',
  productModifierOption = 'product-modifier-option',
  productMediaGallery = 'product-media-gallery',
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
      <MediaGallery.Root
        mediaGalleryServiceConfig={{
          media: props.product.media?.itemsInfo?.items ?? [],
        }}
      >
        <ProductVariantSelector.Root>
          <ProductModifiers.Root>
            <SelectedVariant.Root>{props.children}</SelectedVariant.Root>
          </ProductModifiers.Root>
        </ProductVariantSelector.Root>
      </MediaGallery.Root>
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
          'data-testid': TestIds.productName,
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
            'data-testid': TestIds.productDescription,
          };

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
          'data-testid': TestIds.productPrice,
          'data-discounted': compareAtPrice !== null,
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
          'data-testid': testId,
          'data-discounted': compareAtPrice !== null,
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
 * Props for Slug component
 * @interface SlugProps
 */
export interface SlugProps extends AsChildProps<{ slug: string }> {}

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
  const { asChild, children } = props;
  const testId = TestIds.productSlug;

  return (
    <CoreProduct.Slug>
      {({ slug }) => {
        const attributes = {
          'data-testid': testId,
        };

        const slugData = { slug };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: slugData,
            ref,
            content: slug,
            attributes,
          });
          if (rendered) return rendered;
        }

        return (
          <span {...attributes} ref={ref}>
            {slug}
          </span>
        );
      }}
    </CoreProduct.Slug>
  );
});

/**
 * Props for Product Variants container
 */
export interface VariantsProps extends AsChildProps<{ hasOptions: boolean }> {}

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
    const { asChild, children } = props;

    return (
      <ProductVariantSelector.Options>
        {({ hasOptions, options }) => {
          if (!hasOptions) return null;

          const contextValue: VariantsContextValue = {
            hasOptions,
            options,
          };

          const attributes = {
            'data-testid': TestIds.productVariants,
          };

          const content = (
            <VariantsContext.Provider value={contextValue}>
              {typeof children === 'function'
                ? null
                : (children as React.ReactNode)}
            </VariantsContext.Provider>
          );

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { hasOptions },
              ref,
              content,
              attributes,
            });
            if (rendered) return rendered;
          }

          return (
            <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
              {content}
            </div>
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
  HTMLElement,
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
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
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
export interface ModifiersProps
  extends AsChildProps<{ hasModifiers: boolean }> {}

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
    const { asChild, children } = props;

    return (
      <ProductModifiers.Modifiers>
        {({ hasModifiers, modifiers }) => {
          if (!hasModifiers) return null;

          const contextValue: ModifiersContextValue = {
            hasModifiers,
            modifiers,
          };

          const attributes = {
            'data-testid': TestIds.productModifiers,
          };

          const content = (
            <ModifiersContext.Provider value={contextValue}>
              {typeof children === 'function'
                ? null
                : (children as React.ReactNode)}
            </ModifiersContext.Provider>
          );

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { hasModifiers },
              ref,
              content,
              attributes,
            });
            if (rendered) return rendered;
          }

          return (
            <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
              {content}
            </div>
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
  HTMLElement,
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
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
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
  HTMLElement,
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
          <div
            {...attributes}
            ref={ref as React.Ref<HTMLDivElement>}
            {...otherProps}
          >
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
