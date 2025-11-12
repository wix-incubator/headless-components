import React from 'react';
import { Commerce } from '@wix/ecom/components';
import { type LineItem } from '@wix/ecom/services';
import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { Quantity as QuantityComponent } from '@wix/headless-components/react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {
  Item,
  Modifier,
  ModifierGroup,
  useModifierContext,
} from '@wix/headless-restaurants-menus/react';
import * as CoreItemDetails from './core/ItemDetails.js';
import { ItemServiceConfig } from '../services/item-details-service.js';
import {
  EnhancedModifier,
  EnhancedModifierGroup,
  EnhancedVariant,
} from '@wix/headless-restaurants-menus/services';
import {
  AvailabilityStatus,
  AvailabilityStatusMap,
} from '../services/common-types.js';

enum TestIds {
  itemName = 'item-name',
  itemPrice = 'item-price',
  itemDescription = 'item-description',
  itemImage = 'item-image',
  itemAddToCart = 'item-add-to-cart',
  itemSpecialRequest = 'item-special-request',
  itemLabels = 'item-labels',
  itemVariants = 'item-variants',
  itemModifier = 'item-modifier',
  itemAvailability = 'item-availability',
}

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
      fill="currentColor"
    />
  </svg>
);

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
  itemDetailsServiceConfig?: ItemServiceConfig;
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

export interface ItemDetailsNameProps {
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

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

/**
 * Displays the item price with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails.Price />
 * <ItemDetails.Price asChild>
 *   <span className="font-semibold text-lg" />
 * </ItemDetails.Price>
 * ```
 */
export interface ItemDetailsPriceProps {
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const Price = React.forwardRef<HTMLElement, ItemDetailsPriceProps>(
  ({ asChild, className, ...rest }, ref) => {
    return (
      <Item.Price
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.itemPrice}
        {...rest}
      />
    );
  },
);
Price.displayName = 'ItemDetails.Price';

/**
 * Displays the item description with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails.Description />
 * <ItemDetails.Description asChild>
 *   <p className="text-sm" />
 * </ItemDetails.Description>
 * ```
 */
export interface ItemDetailsDescriptionProps {
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const Description = React.forwardRef<
  HTMLElement,
  ItemDetailsDescriptionProps
>(({ asChild, className, ...rest }, ref) => {
  return (
    <Item.Description
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.itemDescription}
      {...rest}
    />
  );
});
Description.displayName = 'ItemDetails.Description';

/**
 * Wrapper component for CoreItemDetails.ModifierComponent.
 * Renders a single modifier with checkbox functionality.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails.Modifier>
 *   {({ modifier, isSelected, onToggle }) => (
 *     <div style={{ display: "flex", alignItems: "center" }}>
 *       <CheckboxPrimitive.Root
 *         className="CheckboxRoot"
 *         checked={isSelected}
 *         onCheckedChange={onToggle}
 *         id={modifier._id}
 *       >
 *         <CheckboxPrimitive.Indicator className="CheckboxIndicator">
 *           <CheckIcon />
 *         </CheckboxPrimitive.Indicator>
 *       </CheckboxPrimitive.Root>
 *       <label className="Label" htmlFor={modifier._id}>
 *         {modifier.name}
 *       </label>
 *     </div>
 *   )}
 * </ItemDetails.Modifier>
 * ```
 */
export interface ItemDetailsModifiersSingleSelectProps {
  children?: AsChildChildren<{
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
    modifierGroup: EnhancedModifierGroup;
    modifiers: EnhancedModifier[];
  }>;
  className?: string;
  asChild?: boolean;
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
}

export interface ModifierCheckboxProps {
  selectedModifierIds: string[];
  onToggle: (modifierId: string) => void;
  className?: string;
  asChild?: boolean;
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
  children?: AsChildChildren<{
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
  }>;
}

export const ModifierCheckbox = React.forwardRef<
  HTMLElement,
  ModifierCheckboxProps
>(
  ({
    selectedModifierIds,
    onToggle,
    className,
    asChild,
    modifierNameClassName,
    modifierPriceClassName,
    children,
    ...rest
  }) => {
    const { modifier } = useModifierContext();
    const isSelected = selectedModifierIds.includes(modifier._id || '');

    return (
      <AsChildSlot
        asChild={asChild}
        testId={TestIds.itemModifier}
        className={className}
        customElement={children}
        customElementProps={{
          selectedModifierIds,
          onToggle,
        }}
        {...rest}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckboxPrimitive.Root
            className="CheckboxRoot"
            checked={isSelected}
            onCheckedChange={() => onToggle(modifier._id || '')}
            id={modifier._id || undefined}
          >
            <CheckboxPrimitive.Indicator className="CheckboxIndicator">
              <CheckIcon />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          <label className="Label" htmlFor={modifier._id || undefined}>
            <Modifier.Name className={modifierNameClassName} />
            <Modifier.Price className={modifierPriceClassName} />
          </label>
        </div>
      </AsChildSlot>
    );
  },
);
ModifierCheckbox.displayName = 'ItemDetails.ModifierCheckbox';

export interface ModifierRadioProps {
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
}

export const ModifierRadio = React.forwardRef<HTMLElement, ModifierRadioProps>(
  ({ modifierNameClassName, modifierPriceClassName }) => {
    const { modifier } = useModifierContext();

    return (
      <RadioGroupPrimitive.Item
        className="RadioGroupItem"
        value={modifier._id || ''}
        id={modifier._id || undefined}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroupPrimitive.Indicator className="RadioGroupIndicator" />
          <label className="Label" htmlFor={modifier._id || undefined}>
            <Modifier.Name className={modifierNameClassName} />
            <Modifier.Price className={modifierPriceClassName} />
          </label>
        </div>
      </RadioGroupPrimitive.Item>
    );
  },
);
ModifierRadio.displayName = 'ItemDetails.ModifierRadio';

export const ModifiersSingleSelect = React.forwardRef<
  HTMLElement,
  ItemDetailsModifiersSingleSelectProps
>(
  ({
    children,
    className,
    asChild,
    modifierNameClassName,
    modifierPriceClassName,
    ...rest
  }) => {
    return (
      <CoreItemDetails.ModifiersComponent singleSelect={true}>
        {({ selectedModifierIds, onToggle, modifierGroup, modifiers }) => {
          const selectedModifierId =
            selectedModifierIds.length > 0 ? selectedModifierIds[0] : '';

          return (
            <AsChildSlot
              asChild={asChild}
              testId={TestIds.itemModifier}
              className={className}
              customElement={children}
              customElementProps={{
                selectedModifierIds,
                onToggle,
                modifierGroup,
                modifiers,
              }}
              {...rest}
            >
              <RadioGroupPrimitive.Root
                value={selectedModifierId}
                onValueChange={onToggle}
              >
                <ModifierGroup.ModifiersRepeater>
                  <ModifierRadio
                    modifierNameClassName={modifierNameClassName}
                    modifierPriceClassName={modifierPriceClassName}
                  />
                </ModifierGroup.ModifiersRepeater>
              </RadioGroupPrimitive.Root>
            </AsChildSlot>
          );
        }}
      </CoreItemDetails.ModifiersComponent>
    );
  },
);
ModifiersSingleSelect.displayName = 'ItemDetails.ModifiersSingleSelect';

export interface ItemDetailsModifiersMultiSelectProps {
  children?: AsChildChildren<{
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
    modifierGroup: EnhancedModifierGroup;
    modifiers: EnhancedModifier[];
  }>;
  className?: string;
  asChild?: boolean;
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
}

export const ModifiersMultiSelect = React.forwardRef<
  HTMLElement,
  ItemDetailsModifiersMultiSelectProps
>(
  ({
    children,
    className,
    asChild,
    modifierNameClassName,
    modifierPriceClassName,
    ...rest
  }) => {
    return (
      <CoreItemDetails.ModifiersComponent singleSelect={false}>
        {({ selectedModifierIds, onToggle, modifierGroup, modifiers }) => {
          return (
            <AsChildSlot
              asChild={asChild}
              testId={TestIds.itemModifier}
              className={className}
              customElement={children}
              customElementProps={{
                selectedModifierIds,
                onToggle,
                modifierGroup,
                modifiers,
              }}
              {...rest}
            >
              <ModifierGroup.ModifiersRepeater>
                <ModifierCheckbox
                  selectedModifierIds={selectedModifierIds}
                  onToggle={onToggle}
                  modifierNameClassName={modifierNameClassName}
                  modifierPriceClassName={modifierPriceClassName}
                />
              </ModifierGroup.ModifiersRepeater>
            </AsChildSlot>
          );
        }}
      </CoreItemDetails.ModifiersComponent>
    );
  },
);
ModifiersMultiSelect.displayName = 'ItemDetails.ModifiersMultiSelect';

/**
 * Wrapper component for CoreItemDetails.VariantsComponent.
 * Renders the variants for the item using Radix UI RadioGroup.
 *
 * @component
 * @example
 * ```tsx
 * <ItemDetails.Variants>
 *   {(variant) => <span>{variant.name}</span>}
 * </ItemDetails.Variants>
 * ```
 */
export interface ItemDetailsVariantsProps {
  children?: AsChildChildren<{
    variants: EnhancedVariant[];
    selectedVariantId?: string;
    onVariantChange?: (variantId: string) => void;
  }>;
  className?: string;
  asChild?: boolean;
  variantNameClassName?: string;
  variantPriceClassName?: string;
}

export const Variants = React.forwardRef<HTMLElement, ItemDetailsVariantsProps>(
  (
    {
      children,
      className,
      asChild,
      variantNameClassName,
      variantPriceClassName,
    },
    ref,
  ) => {
    return (
      <CoreItemDetails.VariantsComponent>
        {({ variants, hasVariants, selectedVariantId, onVariantChange }) => {
          if (!hasVariants) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              testId={TestIds.itemVariants}
              className={className}
              customElement={children}
              customElementProps={{
                variants,
                selectedVariantId,
                onVariantChange,
              }}
            >
              <RadioGroupPrimitive.Root
                value={selectedVariantId}
                onValueChange={onVariantChange}
              >
                {variants.map((variant) => (
                  <RadioGroupPrimitive.Item
                    key={variant._id}
                    value={variant._id ?? ''}
                  >
                    <div>
                      <div className={variantNameClassName}>{variant.name}</div>
                      <div className={variantPriceClassName}>
                        {variant.priceInfo?.formattedPrice ||
                          variant.priceInfo?.price ||
                          ''}
                      </div>
                    </div>
                  </RadioGroupPrimitive.Item>
                ))}
              </RadioGroupPrimitive.Root>
            </AsChildSlot>
          );
        }}
      </CoreItemDetails.VariantsComponent>
    );
  },
);
Variants.displayName = 'ItemDetails.Variants';

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

export const Quantity: React.FC<ItemDetailsQuantityProps> = ({ children }) => {
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

export interface ItemDetailsAvailabilityProps {
  asChild?: boolean;
  textClassName?: string;
  buttonClassName?: string;
  availabilityStatusMap: AvailabilityStatusMap;
  children: (props: {
    availabilityStatus: AvailabilityStatus;
    availabilityStatusText?: string;
    availabilityStatusButtonText?: string;
    availabilityAction?: () => void;
  }) => React.ReactNode;
}

export const AvailabilityComponent = React.forwardRef<
  HTMLElement,
  ItemDetailsAvailabilityProps
>(
  (
    {
      asChild,
      children,
      textClassName,
      buttonClassName,
      availabilityStatusMap,
      ...rest
    },
    ref,
  ) => {
    return (
      <CoreItemDetails.AvailabilityComponent
        availabilityStatusMap={availabilityStatusMap}
      >
        {({
          availabilityStatus,
          availabilityAction,
          availabilityStatusText,
          availabilityStatusButtonText,
        }: {
          availabilityStatus: AvailabilityStatus;
          availabilityAction?: (() => void) | undefined;
          availabilityStatusText?: string | undefined;
          availabilityStatusButtonText?: string | undefined;
        }) => {
          if (availabilityStatus === AvailabilityStatus.AVAILABLE) {
            return null;
          }

          return (
            <AsChildSlot
              asChild={asChild}
              data-testid={TestIds.itemAvailability}
              customElement={children}
              customElementProps={{
                availabilityStatus,
                availabilityStatusText,
                availabilityStatusButtonText,
                availabilityAction,
              }}
              ref={ref}
              {...rest}
            >
              <p className={textClassName}>{availabilityStatusText}</p>
              {availabilityStatusButtonText && availabilityAction && (
                <button
                  className={buttonClassName}
                  onClick={availabilityAction}
                >
                  {availabilityStatusButtonText}
                </button>
              )}
            </AsChildSlot>
          );
        }}
      </CoreItemDetails.AvailabilityComponent>
    );
  },
);

AvailabilityComponent.displayName = 'AvailabilityComponent';
