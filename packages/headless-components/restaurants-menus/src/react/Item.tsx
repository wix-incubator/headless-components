import React from 'react';
import {
  Item as CoreItem,
  ItemName,
  ItemDescription,
  Price as CorePrice,
  Images as CoreImages,
  Featured as CoreFeatured,
  useItemContext,
} from './core/index.js';
import type {
  EnhancedItem,
  Label,
  EnhancedModifierGroup,
} from '../services/types.js';
import { AsChildSlot } from '@wix/headless-utils/react';
import type {
  AsChildChildren,
  AsChildRenderFunction,
} from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import { WixMediaImage, MediaGallery } from '@wix/headless-media/react';
import {
  StarFilledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import * as VariantComponent from './Variant.js';
import * as LabelComponent from './Label.js';
import * as ModifierGroupComponent from './ModifierGroup.js';

export interface ItemRootProps {
  children: React.ReactNode;
  item?: EnhancedItem;
}

export interface ItemNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ItemDescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ItemPriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price?: string;
    formattedPrice?: string;
    hasPrice: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ItemVariantsRepeaterProps {
  children: React.ReactNode;
}

export interface ItemLabelsRepeaterProps {
  children: React.ReactNode;
}

export interface ItemModifierGroupsRepeaterProps {
  children: React.ReactNode;
}

export interface ItemFeaturedProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ featured: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root component that provides item context to its children.
 *
 * @warning Do not use this component directly if it's inside a repeater.
 * Use the repeater component (e.g., Section.ItemsRepeater) instead, which will
 * automatically render this Root component for each item.
 */
export function Root(props: ItemRootProps) {
  if (!props.item) {
    return null;
  }

  return (
    <CoreItem item={props.item}>
      <div
        data-featured={props.item.featured ? 'true' : 'false'}
        className="group"
      >
        {props.children}
      </div>
    </CoreItem>
  );
}

/**
 * Displays the item name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Name className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <Item.Name asChild>
 *   <h2 className="text-lg font-semibold" />
 * </Item.Name>
 *
 * // asChild with react component
 * <Item.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h2 ref={ref} {...props} className="text-lg font-semibold">
 *       {name}
 *     </h2>
 *   ))}
 * </Item.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, ItemNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <ItemName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.itemName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <p>{name}</p>
            </AsChildSlot>
          );
        }}
      </ItemName>
    );
  },
);

/**
 * Displays the item description with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Description className="text-sm text-muted-foreground" />
 *
 * // asChild with primitive
 * <Item.Description asChild>
 *   <p className="text-sm text-muted-foreground" />
 * </Item.Description>
 *
 * // asChild with react component
 * <Item.Description asChild>
 *   {React.forwardRef(({description, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-sm text-muted-foreground">
 *       {description}
 *     </p>
 *   ))}
 * </Item.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, ItemDescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <ItemDescription>
        {({ description }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.itemDescription}
              customElement={children}
              customElementProps={{ description }}
              content={description}
              {...otherProps}
            >
              <p>{description}</p>
            </AsChildSlot>
          );
        }}
      </ItemDescription>
    );
  },
);

/**
 * Displays the item price with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Price className="text-lg font-bold text-primary" />
 *
 * // asChild with primitive
 * <Item.Price asChild>
 *   <span className="text-lg font-bold text-primary" />
 * </Item.Price>
 *
 * // asChild with react component
 * <Item.Price asChild>
 *   {React.forwardRef(({price, formattedPrice, hasPrice, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-bold text-primary">
 *       {formattedPrice || price}
 *     </span>
 *   ))}
 * </Item.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, ItemPriceProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CorePrice>
        {({ price, formattedPrice, hasPrice }) => {
          if (!hasPrice) {
            return null;
          }

          const displayPrice = formattedPrice || price;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.itemPrice}
              customElement={children}
              customElementProps={{ price, formattedPrice, hasPrice }}
              content={displayPrice}
              {...otherProps}
            >
              <p>{displayPrice}</p>
            </AsChildSlot>
          );
        }}
      </CorePrice>
    );
  },
);

export interface ItemImagesProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildRenderFunction<{
    images: string[];
    altText: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** CSS classes to apply to the previous button */
  previousClassName?: string;
  /** CSS classes to apply to the next button */
  nextClassName?: string;
  /** CSS classes to apply to the indicator */
  indicatorClassName?: string;
  /** CSS classes to apply to the previous chevron icon */
  previousIconClassName?: string;
  /** CSS classes to apply to the next chevron icon */
  nextIconClassName?: string;
}

/**
 * Displays item images intelligently based on available images.
 * - No images: returns null
 * - Single image: renders WixMediaImage
 * - Multiple images: renders MediaGallery
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Images className="w-full h-48" />
 *
 * // With custom gallery controls styling
 * <Item.Images
 *   className="w-full h-48"
 *   previousClassName="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
 *   nextClassName="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
 *   indicatorClassName="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
 *   previousIconClassName="text-white drop-shadow-sm"
 *   nextIconClassName="text-white drop-shadow-sm"
 * />
 *
 * // asChild with primitive
 * <Item.Images asChild>
 *   <div className="w-full h-48" />
 * </Item.Images>
 *
 * // asChild with custom component
 * <Item.Images asChild>
 *   {React.forwardRef(({images, altText, ...props}, ref) => (
 *     <div ref={ref} {...props} className="w-full h-48">
 *       {images.length > 0 && (
 *         images.length === 1 ? (
 *           <WixMediaImage media={{ image: images[0] }} alt={altText} />
 *         ) : (
 *           <MediaGallery.Root mediaGalleryServiceConfig={{ media: images.map(img => ({ image: img })) }}>
 *             <MediaGallery.Viewport />
 *             <MediaGallery.Previous />
 *             <MediaGallery.Next />
 *           </MediaGallery.Root>
 *         )
 *       )}
 *     </div>
 *   ))}
 * </Item.Images>
 *
 * // Custom render function
 * <Item.Images>
 *   {({ images, altText }) => (
 *     <div className="w-full h-48">
 *       {images.length > 0 && (
 *         images.length === 1 ? (
 *           <WixMediaImage media={{ image: images[0] }} alt={altText} />
 *         ) : (
 *           <MediaGallery.Root mediaGalleryServiceConfig={{ media: images.map(img => ({ image: img })) }}>
 *             <MediaGallery.Viewport />
 *             <MediaGallery.Previous />
 *             <MediaGallery.Next />
 *             <MediaGallery.Indicator />
 *           </MediaGallery.Root>
 *         )
 *       )}
 *     </div>
 *   )}
 * </Item.Images>
 * ```
 */
export const Images = React.forwardRef<HTMLElement, ItemImagesProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      previousClassName,
      nextClassName,
      indicatorClassName,
      previousIconClassName,
      nextIconClassName,
      ...otherProps
    } = props;

    return (
      <CoreImages>
        {({ images, altText }: { images: string[]; altText: string }) => {
          if (asChild && children) {
            return children({ images, altText }, ref);
          }

          if (images.length === 0) {
            return null;
          }

          if (images.length === 1) {
            return (
              <WixMediaImage
                media={{ image: images[0] }}
                alt={altText}
                data-testid={TestIds.itemImages}
                className={className}
                {...otherProps}
              />
            );
          }

          const mediaItems = images.map((image: string) => ({ image }));

          return (
            <MediaGallery.Root
              mediaGalleryServiceConfig={{ media: mediaItems }}
            >
              <MediaGallery.Viewport asChild>
                {({ src, alt }) => (
                  <WixMediaImage
                    media={{ image: src }}
                    alt={alt}
                    className={className}
                    data-testid={TestIds.itemImages}
                    {...otherProps}
                  />
                )}
              </MediaGallery.Viewport>
              <MediaGallery.Previous className={previousClassName}>
                <ChevronLeftIcon className={previousIconClassName} />
              </MediaGallery.Previous>
              <MediaGallery.Next className={nextClassName}>
                <ChevronRightIcon className={nextIconClassName} />
              </MediaGallery.Next>
              <MediaGallery.Indicator className={indicatorClassName} />
            </MediaGallery.Root>
          );
        }}
      </CoreImages>
    );
  },
);

/**
 * Displays the item featured status with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Featured className="w-4 h-4 text-blue-500" />
 *
 * // asChild with primitive
 * <Item.Featured asChild>
 *   <StarFilledIcon className="w-4 h-4 text-blue-500" />
 * </Item.Featured>
 *
 * // asChild with react component
 * <Item.Featured asChild>
 *   {React.forwardRef(({featured, ...props}, ref) => (
 *     <StarFilledIcon ref={ref} {...props} className="w-4 h-4 text-blue-500" />
 *   ))}
 * </Item.Featured>
 *
 * // Custom render function
 * <Item.Featured>
 *   {({ featured }) => (
 *     <StarFilledIcon className="w-4 h-4 text-blue-500" />
 *   )}
 * </Item.Featured>
 * ```
 */
export const Featured = React.forwardRef<HTMLElement, ItemFeaturedProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreFeatured>
        {({ featured }: { featured: boolean }) => {
          if (!featured) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              data-testid={TestIds.itemFeatured}
              className={className}
              {...otherProps}
            >
              <StarFilledIcon className={className} />
            </AsChildSlot>
          );
        }}
      </CoreFeatured>
    );
  },
);

/**
 * Repeater component for rendering individual variants.
 *
 * @component
 * @example
 * ```tsx
 * <Item.VariantsRepeater>
 *   {({ variant, index }) => (
 *     <div key={variant._id} className="flex justify-between p-2 border rounded">
 *       <p className="font-medium">{variant.name}</p>
 *       <p className="text-primary">
 *         {variant.priceInfo?.formattedPrice || 'No price'}
 *       </p>
 *     </div>
 *   )}
 * </Item.VariantsRepeater>
 * ```
 */
export const VariantsRepeater = React.forwardRef<
  HTMLElement,
  ItemVariantsRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { item } = useItemContext();

  const variants = item.priceVariants || [];
  const hasVariants = !!(variants && variants.length > 0);

  if (!hasVariants) {
    return null;
  }
  return (
    <>
      {variants.map((variant) => (
        <VariantComponent.Root
          key={variant._id}
          variant={variant}
          data-testid={TestIds.itemName}
          data-variant-id={variant._id}
        >
          {children}
        </VariantComponent.Root>
      ))}
    </>
  );
});

Name.displayName = 'Item.Name';
Description.displayName = 'Item.Description';
Price.displayName = 'Item.Price';
Images.displayName = 'Item.Images';
VariantsRepeater.displayName = 'Item.VariantsRepeater';

export const LabelsRepeater = (props: ItemLabelsRepeaterProps) => {
  const { children } = props;
  const { item } = useItemContext();
  const hasLabels = !!(item.labels && item.labels.length > 0);

  if (!hasLabels) {
    return null;
  }

  const itemLabels = item.labels!;

  return (
    <>
      {itemLabels.map((label: Label) => (
        <LabelComponent.Root key={label._id} label={label}>
          {children}
        </LabelComponent.Root>
      ))}
    </>
  );
};

export const ModifierGroupsRepeater = (
  props: ItemModifierGroupsRepeaterProps,
) => {
  const { children } = props;
  const { item } = useItemContext();
  const hasModifierGroups = !!(
    item.modifierGroups && item.modifierGroups.length > 0
  );

  if (!hasModifierGroups) {
    return null;
  }

  const itemModifierGroups = item.modifierGroups!;

  return (
    <>
      {itemModifierGroups.map((modifierGroup: EnhancedModifierGroup) => (
        <ModifierGroupComponent.Root
          key={modifierGroup._id}
          modifierGroup={modifierGroup}
        >
          {children}
        </ModifierGroupComponent.Root>
      ))}
    </>
  );
};

LabelsRepeater.displayName = 'Item.LabelsRepeater';
ModifierGroupsRepeater.displayName = 'Item.ModifierGroupsRepeater';

/**
 * Item namespace containing all item components
 * following the compound component pattern: Item.Root, Item.Name, Item.Description, etc.
 */
export const Item = {
  /** Item root component */
  Root,
  /** Item name component */
  Name,
  /** Item description component */
  Description,
  /** Item price component */
  Price,
  /** Item images component (intelligent single/multiple) */
  Images,
  /** Item featured component */
  Featured,
  /** Item variants repeater component */
  VariantsRepeater,
  /** Item labels repeater component */
  LabelsRepeater,
  /** Item modifier groups repeater component */
  ModifierGroupsRepeater,
} as const;
