import React from 'react';
import { type LineItem } from '../services/common-types.js';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { DataComponentTags } from '../data-component-tags.js';
import { WixMediaImage } from '@wix/headless-media/react';
import * as SelectedOption from './SelectedOption.js';
import { Item as CoreItem } from './core/CurrentCart.js';

import { Quantity as QuantityComponent } from '@wix/headless-components/react';

// LineItem Context
interface LineItemContextValue {
  lineItem: LineItem;
}

const LineItemContext = React.createContext<LineItemContextValue | null>(null);

function useLineItemContext(): LineItemContextValue {
  const context = React.useContext(LineItemContext);
  if (!context) {
    throw new Error(
      'useLineItemContext must be used within a LineItem.Root component',
    );
  }
  return context;
}

export interface LineItemRootProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children: AsChildChildren<{ item: LineItem }>;
  /** The line item data */
  item: LineItem;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Root component for a cart line item that provides the LineItem context to its children
 *
 * @example
 * ```tsx
 * <LineItem.Root item={cartItem}>
 *   <LineItem.Image />
 *   <LineItem.Title />
 *   <LineItem.Quantity />
 * </LineItem.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, LineItemRootProps>(
  (props, ref) => {
    const { asChild, children, item, ...otherProps } = props;

    const contextValue: LineItemContextValue = {
      lineItem: item,
    };

    return (
      <LineItemContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          data-testid={TestIds.lineItemRoot}
          customElement={children}
          customElementProps={{ item }}
          data-component-tag={DataComponentTags.lineItemRoot}
          {...otherProps}
        >
          <div>{children}</div>
        </AsChildSlot>
      </LineItemContext.Provider>
    );
  },
);

Root.displayName = 'LineItem.Root';

enum TestIds {
  lineItemRoot = 'line-item-root',
  lineItemTitle = 'line-item-title',
  lineItemImage = 'line-item-image',
  lineItemQuantity = 'line-item-quantity',
  lineItemSelectedOptions = 'line-item-selected-options',
  selectedOption = 'selected-option',
}

/**
 * Props for LineItem Title component
 */
export interface TitleProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ title: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the line item title/product name with customizable rendering options following the V2 API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LineItem.Title className="text-lg font-medium" />
 *
 * // asChild with primitive element
 * <LineItem.Title asChild>
 *   <h3 className="text-lg font-medium" />
 * </LineItem.Title>
 *
 * // asChild with React component
 * <LineItem.Title asChild>
 *   {React.forwardRef(({title, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-medium">
 *       {title}
 *     </h3>
 *   ))}
 * </LineItem.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { lineItem } = useLineItemContext();

  return (
    <CoreItem item={lineItem}>
      {({ title }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          data-testid={TestIds.lineItemTitle}
          customElement={children}
          customElementProps={{ title }}
          content={title}
          {...otherProps}
        >
          <span>{title}</span>
        </AsChildSlot>
      )}
    </CoreItem>
  );
});

Title.displayName = 'LineItem.Title';

/**
 * Props for LineItem Image component
 */
export interface ImageProps {
  asChild?: boolean;
  children?: AsChildChildren<{ src: string; alt: string }>;
  className?: string;
  [key: string]: any;
}

/**
 * Displays the line item product image using WixMediaImage for optimization.
 * Supports custom rendering via asChild pattern with specific src/alt props.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with WixMediaImage
 * <LineItem.Image className="w-16 h-16 rounded-lg object-cover" />
 *
 * // Custom rendering with specific props
 * <LineItem.Image asChild>
 *   {React.forwardRef(({ src, alt }, ref) => (
 *     <img
 *       ref={ref}
 *       src={src}
 *       alt={alt}
 *       className="w-16 h-16 rounded-lg object-cover custom-image"
 *     />
 *   ))}
 * </LineItem.Image>
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const { lineItem } = useLineItemContext();

    return (
      <CoreItem item={lineItem}>
        {({ image, title }) => {
          const src = image || '';
          const alt = title || 'Product image';

          if (asChild && children) {
            // Call the ForwardRefRenderFunction with the specific props
            return children({ src, alt }, ref);
          }

          return (
            <WixMediaImage
              ref={ref}
              media={{ image: lineItem?.image }}
              alt={alt}
              data-testid={TestIds.lineItemImage}
              {...otherProps}
            />
          );
        }}
      </CoreItem>
    );
  },
);

Image.displayName = 'LineItem.Image';

/**
 * Props for LineItem Quantity component
 */
export interface QuantityProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components for quantity controls */
  children: AsChildChildren<{
    quantity: number;
    updateQuantity: (quantity: number) => void;
  }>;
  /** How much to increment/decrement (default: 1) */
  steps?: number;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Container for line item quantity selection controls.
 * Wraps children with Quantity.Root and connects to line item context for quantity operations.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with quantity controls
 * <LineItem.Quantity steps={1}>
 *   <Quantity.Decrement />
 *   <Quantity.Input />
 *   <Quantity.Increment />
 *   <Quantity.Reset />
 * </LineItem.Quantity>
 * ```
 */
export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const { lineItem } = useLineItemContext();

    return (
      <CoreItem item={lineItem}>
        {({ quantity, onValueChange, remove }) => (
          <QuantityComponent.Root
            ref={ref as any}
            initialValue={quantity}
            reset={remove}
            onValueChange={onValueChange}
            data-testid={TestIds.lineItemQuantity}
            {...otherProps}
          >
            {children}
          </QuantityComponent.Root>
        )}
      </CoreItem>
    );
  },
);

Quantity.displayName = 'LineItem.Quantity';

/**
 * Props for LineItem SelectedOptions component
 */
export interface SelectedOptionsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    selectedOptions: Array<{
      name: string;
      value: string | { color: string };
    }>;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Container for selected options display. Does not render when there are no selected options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LineItem.SelectedOptions>
 *   <LineItem.SelectedOptionRepeater />
 * </LineItem.SelectedOptions>
 *
 * // asChild with primitive element
 * <LineItem.SelectedOptions asChild>
 *   <section className="selected-options-section">
 *     <LineItem.SelectedOptionRepeater />
 *   </section>
 * </LineItem.SelectedOptions>
 *
 * // asChild with React component
 * <LineItem.SelectedOptions asChild>
 *   {React.forwardRef((props, ref) => (
 *     <section ref={ref} {...props} className="selected-options-section">
 *       {props.children}
 *     </section>
 *   ))}
 * </LineItem.SelectedOptions>
 * ```
 */
export const SelectedOptions = React.forwardRef<
  HTMLElement,
  SelectedOptionsProps
>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { lineItem } = useLineItemContext();

  return (
    <CoreItem item={lineItem}>
      {({ selectedOptions }) => {
        if (selectedOptions.length === 0) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            data-testid={TestIds.lineItemSelectedOptions}
            customElement={children}
            customElementProps={{ selectedOptions }}
            {...otherProps}
          >
            <div>{children}</div>
          </AsChildSlot>
        );
      }}
    </CoreItem>
  );
});

SelectedOptions.displayName = 'LineItem.SelectedOptions';

/**
 * Props for LineItem SelectedOptionRepeater component
 */
export interface SelectedOptionRepeaterProps {
  children: React.ReactNode;
}

/**
 * Renders a list of selected options. Maps over selected options and renders SelectedOption.Root for each.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LineItem.SelectedOptionRepeater>
 *   <SelectedOption.Text />
 *   <SelectedOption.Color />
 * </LineItem.SelectedOptionRepeater>
 * ```
 */
export function SelectedOptionRepeater(
  props: SelectedOptionRepeaterProps,
): React.ReactNode {
  const { children } = props;
  const { lineItem } = useLineItemContext();

  return (
    <CoreItem item={lineItem}>
      {({ selectedOptions }) => {
        if (selectedOptions.length === 0) {
          return null;
        }

        // Convert CoreItem selectedOptions to SelectedOption service format
        const convertedOptions = selectedOptions.map((option) => {
          if (
            typeof option.value === 'object' &&
            'name' in option.value &&
            'code' in option.value
          ) {
            return {
              name: option.name,
              type: 'color' as const,
              value: {
                name: option.value.name,
                code: option.value.code,
              },
            };
          } else {
            return {
              name: option.name,
              type: 'text' as const,
              value: String(option.value),
            };
          }
        });

        return (
          <>
            {convertedOptions.map((option, index) => (
              <SelectedOption.Root
                key={`${option.name}-${index}`}
                option={option}
                data-testid={TestIds.selectedOption}
              >
                {children}
              </SelectedOption.Root>
            ))}
          </>
        );
      }}
    </CoreItem>
  );
}

SelectedOptionRepeater.displayName = 'LineItem.SelectedOptionRepeater';
