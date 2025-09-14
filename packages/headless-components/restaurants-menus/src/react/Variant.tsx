import React from 'react';
import { CoreVariant, VariantName, VariantPrice } from './core';
import type { Variant } from '../services/types';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TestIds } from './TestIds';

export interface VariantRootProps {
  children: React.ReactNode;
  variant: Variant & {
    priceInfo?: {
      price?: string;
      formattedPrice?: string;
    };
  };
}

export interface VariantNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface VariantPriceProps {
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

export function Root(props: VariantRootProps) {
  if (!props.variant) {
    return null;
  }

  return <CoreVariant variant={props.variant}>{props.children}</CoreVariant>;
}

/**
 * Displays the variant name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Variant.Name className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <Variant.Name asChild>
 *   <h3 className="text-lg font-semibold" />
 * </Variant.Name>
 *
 * // asChild with react component
 * <Variant.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-semibold">
 *       {name}
 *     </h3>
 *   ))}
 * </Variant.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, VariantNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <VariantName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.variantName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <div>{name}</div>
            </AsChildSlot>
          );
        }}
      </VariantName>
    );
  },
);

/**
 * Displays the variant price with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Variant.Price className="text-lg font-bold text-primary" />
 *
 * // asChild with primitive
 * <Variant.Price asChild>
 *   <span className="text-lg font-bold text-primary" />
 * </Variant.Price>
 *
 * // asChild with react component
 * <Variant.Price asChild>
 *   {React.forwardRef(({price, formattedPrice, hasPrice, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-bold text-primary">
 *       {formattedPrice || price || 'No price'}
 *     </span>
 *   ))}
 * </Variant.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, VariantPriceProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <VariantPrice>
        {({ price, formattedPrice, hasPrice }) => {
          const displayPrice = formattedPrice || price || 'No price';

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.variantPrice}
              customElement={children}
              customElementProps={{ price, formattedPrice, hasPrice }}
              content={displayPrice}
              {...otherProps}
            >
              <div>{displayPrice}</div>
            </AsChildSlot>
          );
        }}
      </VariantPrice>
    );
  },
);

Name.displayName = 'Variant.Name';
Price.displayName = 'Variant.Price';

/**
 * Variant namespace containing all variant components
 * following the compound component pattern: VariantComponent.Root, VariantComponent.Name, VariantComponent.Price
 */
export const VariantComponent = {
  /** Variant root component */
  Root,
  /** Variant name component */
  Name,
  /** Variant price component */
  Price,
} as const;
