import React from 'react';
import type { EnhancedModifier } from '../services/types.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import { CoreModifier, ModifierName, ModifierPrice } from './core/index.js';

export interface ModifierRootProps {
  modifier?: EnhancedModifier;
  children: React.ReactNode;
}

export const Root = (props: ModifierRootProps) => {
  if (!props.modifier) {
    return null;
  }

  return (
    <CoreModifier modifier={props.modifier}>{props.children}</CoreModifier>
  );
};

export interface ModifierNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ModifierPriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price: number;
    additionalCharge?: string;
    formattedAdditionalCharge?: string;
    hasAdditionalCharge: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the modifier name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Modifier.Name className="text-sm" />
 *
 * // asChild with primitive
 * <Modifier.Name asChild>
 *   <span className="text-sm" />
 * </Modifier.Name>
 *
 * // asChild with react component
 * <Modifier.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm">
 *       {name}
 *     </span>
 *   ))}
 * </Modifier.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, ModifierNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <ModifierName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.modifierName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <p>{name}</p>
            </AsChildSlot>
          );
        }}
      </ModifierName>
    );
  },
);

/**
 * Displays the modifier price with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Modifier.Price className="text-sm font-medium" />
 *
 * // asChild with primitive
 * <Modifier.Price asChild>
 *   <span className="text-sm font-medium" />
 * </Modifier.Price>
 *
 * // asChild with react component
 * <Modifier.Price asChild>
 *   {React.forwardRef(({price, hasAdditionalCharge, formattedAdditionalCharge, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {hasAdditionalCharge ? formattedAdditionalCharge : `$${price.toFixed(2)}`}
 *     </span>
 *   ))}
 * </Modifier.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, ModifierPriceProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <ModifierPrice>
        {({
          hasAdditionalCharge,
          formattedAdditionalCharge,
          additionalCharge,
        }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.modifierPrice}
              customElement={children}
              customElementProps={{
                hasAdditionalCharge,
                formattedAdditionalCharge,
                additionalCharge,
              }}
              content={formattedAdditionalCharge ?? additionalCharge}
              {...otherProps}
            >
              <p>{formattedAdditionalCharge ?? additionalCharge}</p>
            </AsChildSlot>
          );
        }}
      </ModifierPrice>
    );
  },
);

Name.displayName = 'Modifier.Name';
Price.displayName = 'Modifier.Price';

/**
 * Modifier namespace containing all modifier components
 * following the compound component pattern: ModifierComponent.Root, ModifierComponent.Name, ModifierComponent.Price
 */
export const ModifierComponent = {
  /** Modifier root component */
  Root,
  /** Modifier name component */
  Name,
  /** Modifier price component */
  Price,
} as const;
