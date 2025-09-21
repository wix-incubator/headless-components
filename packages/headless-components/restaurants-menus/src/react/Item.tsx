import React from 'react';
import {
  Item as CoreItem,
  ItemName,
  ItemDescription,
  Price as CorePrice,
  Image as CoreImage,
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
import { WixMediaImage } from '@wix/headless-media/react';
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
    price: number;
    currency: string;
    formattedPrice?: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ItemImageProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /**
   * Custom render function when using asChild.
   * Receives an object with:
   * - hasImage: boolean - whether the item has an image
   * - image: string - the actual image element (WixMediaImage)
   * - altText: string - the alt text for the image
   */
  children?: AsChildRenderFunction<{
    hasImage: boolean;
    image?: string;
    altText: string;
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

export function Root(props: ItemRootProps) {
  if (!props.item) {
    return null;
  }

  return <CoreItem item={props.item}>{props.children}</CoreItem>;
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
 *   {React.forwardRef(({price, currency, formattedPrice, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-bold text-primary">
 *       {formattedPrice || `${currency} ${price}`}
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
        {({ price, formattedPrice }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.itemPrice}
              customElement={children}
              customElementProps={{ price, formattedPrice }}
              content={formattedPrice || price}
              {...otherProps}
            >
              <p>{formattedPrice || price}</p>
            </AsChildSlot>
          );
        }}
      </CorePrice>
    );
  },
);

/**
 * Displays the item image with customizable rendering following the documented API.
 * Provides both the actual image element and a fallback element for when no image is available.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Image className="w-20 h-20 object-cover rounded-lg" />
 *
 * // asChild with primitive
 * <Item.Image asChild>
 *   <img className="w-20 h-20 object-cover rounded-lg" />
 * </Item.Image>
 *
 * // asChild with custom component
 * <Item.Image asChild>
 *   {React.forwardRef(({hasImage, imageElement, fallbackElement, ...props}, ref) => (
 *     <div ref={ref} {...props} className="w-20 h-20">
 *       {hasImage ? imageElement : fallbackElement}
 *     </div>
 *   ))}
 * </Item.Image>
 *
 * // Custom render function
 * <Item.Image>
 *   {({ hasImage, imageElement, fallbackElement }) => (
 *     <div className="w-20 h-20 flex-shrink-0">
 *       {hasImage ? imageElement : fallbackElement}
 *     </div>
 *   )}
 * </Item.Image>
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ItemImageProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreImage>
        {({ image, hasImage, altText }) => {
          if (asChild && children) {
            // Call the ForwardRefRenderFunction with the specific props
            return children({ hasImage, image, altText }, ref);
          }

          return (
            <WixMediaImage
              ref={ref}
              media={{ image: image }}
              alt={altText ?? ''}
              data-testid={TestIds.itemImage}
              {...otherProps}
            />
          );
        }}
      </CoreImage>
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
 *       <span className="font-medium">{variant.name}</span>
 *       <span className="text-primary">
 *         {variant.priceInfo?.formattedPrice || 'No price'}
 *       </span>
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
Image.displayName = 'Item.Image';
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

  return itemModifierGroups.map((modifierGroup: EnhancedModifierGroup) => (
    <ModifierGroupComponent.Root
      key={modifierGroup._id}
      modifierGroup={modifierGroup}
    >
      {children}
    </ModifierGroupComponent.Root>
  ));
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
  /** Item image component */
  Image,
  /** Item variants repeater component */
  VariantsRepeater,
  /** Item labels repeater component */
  LabelsRepeater,
  /** Item modifier groups repeater component */
  ModifierGroupsRepeater,
} as const;
