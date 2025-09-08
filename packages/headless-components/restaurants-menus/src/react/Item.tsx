import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { Item as CoreItem } from './core/Item';
import { Item } from '../services/common-types';

enum TestIds {
  itemRoot = 'item-root',
  itemName = 'item-name',
  itemDescription = 'item-description',
  itemPrice = 'item-price',
}

// Item Context
interface ItemContextValue {
  item: Item;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItemContext(): ItemContextValue {
  const context = React.useContext(ItemContext);

  if (!context) {
    throw new Error(
      'useItemContext must be used within a Item.Root component',
    );
  }

  return context;
}

export interface ItemRootProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children: AsChildChildren<{ item: Item }>;
  /** The line item data */
  item: Item;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Root component for a item that provides the Item context to its children
 *
 * @example
 * ```tsx
 * <Item.Root item={item}>
 * </Item.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, ItemRootProps>(
  (props, ref) => {
    const { asChild, children, item, ...otherProps } = props;

    const contextValue: ItemContextValue = {
      item,
    };


    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        data-testid={TestIds.itemRoot}
        customElement={children}
        customElementProps={{ item }}
        {...otherProps}
      >
        <ItemContext.Provider value={contextValue}>
          <div>{children}</div>
        </ItemContext.Provider>
      </AsChildSlot>
    );
  },
);

Root.displayName = 'Item.Root';

/**
 * Props for Item Name component
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the item name with customizable rendering options following the V2 API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Name className="text-lg font-medium" />
 *
 * // asChild with primitive element
 * <Item.Name asChild>
 *   <h3 className="text-lg font-medium" />
 * </Item.Name>
 *
 * // asChild with React component
 * <Item.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-medium">
 *       {name}
 *     </h3>
 *   ))}
 * </Item.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { item } = useItemContext();

  return (
    <CoreItem item={item}>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          data-testid={TestIds.itemName}
          customElement={children}
          customElementProps={{ name }}
          content={name}
          {...otherProps}
        >
          <span>{name}</span>
        </AsChildSlot>
      )}
    </CoreItem>
  );
});

Name.displayName = 'Item.Name';

/**
 * Props for Item Description component
 */
export interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the item description with customizable rendering options following the V2 API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Description className="text-sm text-gray-600" />
 *
 * // asChild with primitive element
 * <Item.Description asChild>
 *   <p className="text-sm text-gray-600" />
 * </Item.Description>
 *
 * // asChild with React component
 * <Item.Description asChild>
 *   {React.forwardRef(({description, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-sm text-gray-600">
 *       {description}
 *     </p>
 *   ))}
 * </Item.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { item } = useItemContext();

  return (
    <CoreItem item={item}>
      {({ description }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          data-testid={TestIds.itemDescription}
          customElement={children}
          customElementProps={{ description }}
          content={description}
          {...otherProps}
        >
          <span>{description}</span>
        </AsChildSlot>
      )}
    </CoreItem>
  );
});

Description.displayName = 'Item.Description';

/**
 * Props for Item Price component
 */
export interface PriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ price: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the item price with customizable rendering options following the V2 API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Item.Price className="text-lg font-semibold" />
 *
 * // asChild with primitive element
 * <Item.Price asChild>
 *   <span className="text-lg font-semibold" />
 * </Item.Price>
 *
 * // asChild with React component
 * <Item.Price asChild>
 *   {React.forwardRef(({price, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-semibold">
 *       {price}
 *     </span>
 *   ))}
 * </Item.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { item } = useItemContext();

  return (
    <CoreItem item={item}>
      {({ price }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          data-testid={TestIds.itemPrice}
          customElement={children}
          customElementProps={{ price }}
          content={price}
          {...otherProps}
        >
          <span>{price}</span>
        </AsChildSlot>
      )}
    </CoreItem>
  );
});

Price.displayName = 'Item.Price';
