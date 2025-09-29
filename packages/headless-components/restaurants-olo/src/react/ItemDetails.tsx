import React from 'react';
import { Commerce } from '@wix/ecom/components';
import { type LineItem } from '@wix/ecom/services';
import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { Quantity as QuantityComponent } from '@wix/headless-components/react';
import { Item } from '@wix/restaurants/components';
import * as CoreItemDetails from './core/ItemDetails.js';
import { ItemServiceConfig } from '../services/item-details-service.js';

enum TestIds {
  itemName = 'item-name',
  itemPrice = 'item-price',
  itemDescription = 'item-description',
  itemImage = 'item-image',
  itemAddToCart = 'item-add-to-cart',
  itemSpecialRequest = 'item-special-request',
}

/**
 * Root component for menu item display and interaction.
 * Provides context for all menu item-related components like name, price, description, image, etc.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails>
 *   <ItemDetailsImage src="wix:image://v1/abc123.jpg" alt="Menu item" />
 *   <ItemDetailsName />
 *   <ItemDetailsPrice />
 *   <ItemDetailsDescription />
 * </ItemDetails>
 * ```
 */
// export const Root = CoreItemDetails.Root;

export interface RootProps {
  asChild?: boolean;
  children: React.ReactNode;
  itemDetailsServiceConfig: ItemServiceConfig;
}

export const Root = ({ children, itemDetailsServiceConfig }: RootProps) => {
  return (
    <CoreItemDetails.Root itemDetailsServiceConfig={itemDetailsServiceConfig}>
      {/* @ts-expect-error - item is not typed */}
      {({ item }) => <Item.Root item={item}>{children}</Item.Root>}
    </CoreItemDetails.Root>
  );
};

/**
 * Displays the item name with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails.Name />
 * <ItemDetails.Name asChild>
 *   <h2 className="font-heading text-lg" />
 * </ItemDetails.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, ItemDetailsNameProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    return (
      <Item.Name
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.itemName}
        {...rest}
      >
        {children}
      </Item.Name>
    );
  },
);
Name.displayName = 'ItemDetails.Name';

export interface ItemDetailsNameProps {
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface AddToCartActionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Text label for the button */
  label: string;
  /** Custom render function when using asChild */
  lineItems: LineItem[];
  /** CSS classes to apply to the button */
  className?: string;
  /** Content to display when loading */
  loadingState?: string | React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Add to Cart button for the menu item.
 * Triggers the action to add the selected item (and its modifiers/variants) to the cart.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails>
 *   <AddToCart
 *     label="Add to Cart"
 *     lineItems={[{ catalogReference: { ... }, quantity: 1 }]}
 *   />
 * </ItemDetails>
 * ```
 */
export const AddToCart = React.forwardRef<
  HTMLButtonElement,
  AddToCartActionProps
>(({ lineItems, className, label, ...props }, ref) => {
  return (
    <Commerce.Actions.AddToCart
      ref={ref}
      asChild={false}
      label={label}
      className={className}
      lineItems={lineItems}
    >
      {props.children}
    </Commerce.Actions.AddToCart>
  );
});

AddToCart.displayName = 'AddToCart';

/**
 * Multi-line text input component for special requests or instructions.
 * Provides a textarea for customers to add custom notes or modifications.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails>
 *   <SpecialRequest
 *     placeholder="Any special requests or dietary restrictions?"
 *     maxLength={200}
 *     className="mt-4"
 *   />
 * </ItemDetails>
 * ```
 */
export interface SpecialRequestProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Number of visible text lines */
  rows?: number;
  /** CSS classes to apply to the textarea */
  className?: string;
  labelClassName?: string;
  /** Label text for the input */
  label?: string;
  /** Whether to show character count */
  showCharCount?: boolean;
}

/**
 * AddToCartButton component that uses Commerce.Actions.AddToCart with AsChildSlot,
 * and gets the lineItem from CoreItemDetails.LineItemComponent.
 *
 * Usage:
 * <ItemDetails.AddToCartButton>Add to cart</ItemDetails.AddToCartButton>
 */
export interface AddToCartButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Commerce.Actions.AddToCart>,
    'lineItems'
  > {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  label?: string;
  onClick?: () => void;
}

export interface ItemDetailsQuantityProps {
  children: React.ReactNode;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  asChild = false,
  children,
  className,
  onClick,
  label = 'Add to cart',
  ...props
}) => {
  return (
    <CoreItemDetails.LineItemComponent>
      {({ lineItem }: { lineItem: LineItem }) => (
        <AsChildSlot
          asChild={asChild}
          className={className}
          customElement={children}
          customElementProps={{
            onClick,
          }}
        >
          <Commerce.Actions.AddToCart
            asChild={false}
            label={label}
            className={className}
            lineItems={[lineItem]}
            {...props}
          >
            {children}
          </Commerce.Actions.AddToCart>
        </AsChildSlot>
      )}
    </CoreItemDetails.LineItemComponent>
  );
};

export const Quantity: React.FC<ItemDetailsQuantityProps> = (
  { children },
  ref,
) => {
  return (
    <CoreItemDetails.QuantityComponent>
      {({
        quantity,
        onValueChange,
      }: {
        quantity: number;
        onValueChange: (value: number) => void;
      }) => (
        <QuantityComponent.Root
          ref={ref}
          onValueChange={onValueChange}
          initialValue={quantity}
        >
          {children}
        </QuantityComponent.Root>
      )}
    </CoreItemDetails.QuantityComponent>
  );
};

Quantity.displayName = 'Quantity';

export const SpecialRequest = React.forwardRef<
  React.ElementRef<typeof CoreItemDetails.SpecialRequest>,
  SpecialRequestProps
>(
  (
    {
      className,
      labelClassName,
      placeholder = 'Any special requests or dietary restrictions?',
      maxLength = 200,
      rows = 3,
      label = 'Special Requests',
      asChild,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <CoreItemDetails.SpecialRequest>
        {({
          value,
          onChange,
        }: {
          value: string;
          onChange: (value: string) => void;
        }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            onChange={onChange}
            data-testid={TestIds.itemSpecialRequest}
            customElement={children}
            customElementProps={{ label, value }}
            content={value}
            {...props}
          >
            {label && <label className={labelClassName}>{label}</label>}
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={rows}
              className={className}
            >
              {value}
            </textarea>
          </AsChildSlot>
        )}
      </CoreItemDetails.SpecialRequest>
    );
  },
);

SpecialRequest.displayName = 'SpecialRequest';
