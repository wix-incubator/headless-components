import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { PricingOption } from '../services/pricing-option-service.js';
import * as CorePricingOption from './core/PricingOption.js';

enum TestIds {
  pricingOptionRoot = 'pricing-option-root',
  pricingOptionName = 'pricing-option-name',
  pricingOptionPricing = 'pricing-option-pricing',
  pricingOptionTax = 'pricing-option-tax',
  pricingOptionFee = 'pricing-option-fee',
  pricingOptionQuantity = 'pricing-option-quantity',
}

/**
 * Props for the PricingOption Root component.
 */
export interface RootProps {
  /** Pricing option */
  pricingOption: PricingOption;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the pricing option */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides pricing option context to all child components.
 * Must be used as the top-level PricingOption component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { PricingOption } from '@wix/events/components';
 *
 * function PricingOptionComponent({ pricingOption }) {
 *   return (
 *     <PricingOption.Root pricingOption={pricingOption}>
 *       <PricingOption.Name />
 *       <PricingOption.Pricing />
 *       <PricingOption.Quantity />
 *     </PricingOption.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { pricingOption, asChild, children, className, ...otherProps } = props;

  return (
    <CorePricingOption.Root pricingOption={pricingOption}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.pricingOptionRoot}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CorePricingOption.Root>
  );
});

/**
 * Props for the PricingOption Name component.
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
 * Displays the pricing option name with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PricingOption.Name className="text-xl font-bold" />
 *
 * // asChild with primitive
 * <PricingOption.Name asChild>
 *   <h2 className="text-xl font-bold" />
 * </PricingOption.Name>
 *
 * // asChild with react component
 * <PricingOption.Name asChild>
 *   {React.forwardRef(({ name, ...props }, ref) => (
 *     <h2 ref={ref} {...props} className="text-xl font-bold">
 *       {name}
 *     </h2>
 *   ))}
 * </PricingOption.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CorePricingOption.Name>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.pricingOptionName}
          customElement={children}
          customElementProps={{ name }}
          content={name}
          {...otherProps}
        >
          <span>{name}</span>
        </AsChildSlot>
      )}
    </CorePricingOption.Name>
  );
});

/**
 * Props for the PricingOption Pricing component.
 */
interface PricingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price: number;
    currency: string;
    formattedPrice: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the pricing option price with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PricingOption.Pricing className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <PricingOption.Pricing asChild>
 *   <span className="text-lg font-semibold" />
 * </PricingOption.Pricing>
 *
 * // asChild with react component
 * <PricingOption.Pricing asChild>
 *   {React.forwardRef(({ price, currency, formattedPrice, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-semibold">
 *       {formattedPrice}
 *     </span>
 *   ))}
 * </PricingOption.Pricing>
 * ```
 */
export const Pricing = React.forwardRef<HTMLElement, PricingProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CorePricingOption.Pricing>
        {({ price, currency, formattedPrice }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.pricingOptionPricing}
            customElement={children}
            customElementProps={{
              price,
              currency,
              formattedPrice,
            }}
            content={formattedPrice}
            {...otherProps}
          >
            <span>{formattedPrice}</span>
          </AsChildSlot>
        )}
      </CorePricingOption.Pricing>
    );
  },
);

/**
 * Props for the PricingOption Tax component.
 */
export interface TaxProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    name: string;
    rate: number;
    included: boolean;
    taxableAmount: number;
    taxAmount: number;
    currency: string;
    formattedTaxAmount: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the tax for the pricing option. Only renders when event has tax settings.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PricingOption.Tax className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <PricingOption.Tax asChild>
 *   <span className="text-sm text-gray-500" />
 * </PricingOption.Tax>
 *
 * // asChild with react component
 * <PricingOption.Tax asChild>
 *   {React.forwardRef(({ name, rate, included, taxableAmount, taxAmount, currency, formattedTaxAmount, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-gray-500">
 *       {included ? `${name} included` : `+${formattedTaxAmount} ${name}`}
 *     </span>
 *   ))}
 * </PricingOption.Tax>
 * ```
 */
export const Tax = React.forwardRef<HTMLElement, TaxProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CorePricingOption.Tax>
      {({
        name,
        rate,
        included,
        taxableAmount,
        taxAmount,
        currency,
        formattedTaxAmount,
      }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.pricingOptionTax}
          customElement={children}
          customElementProps={{
            name,
            rate,
            included,
            taxableAmount,
            taxAmount,
            currency,
            formattedTaxAmount,
          }}
          content={formattedTaxAmount}
          {...otherProps}
        >
          <span>{formattedTaxAmount}</span>
        </AsChildSlot>
      )}
    </CorePricingOption.Tax>
  );
});

/**
 * Props for the PricingOption Fee component.
 */
export interface FeeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    rate: number;
    amount: number;
    currency: string;
    formattedAmount: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the fee for the pricing option. Only renders when ticket definition has fee enabled.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PricingOption.Fee className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <PricingOption.Fee asChild>
 *   <span className="text-sm text-gray-500" />
 * </PricingOption.Fee>
 *
 * // asChild with react component
 * <PricingOption.Fee asChild>
 *   {React.forwardRef(({ rate, amount, currency, formattedAmount, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-gray-500">
 *       +{formattedAmount} service fee
 *     </span>
 *   ))}
 * </PricingOption.Fee>
 * ```
 */
export const Fee = React.forwardRef<HTMLElement, FeeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CorePricingOption.Fee>
      {({ rate, amount, currency, formattedAmount }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.pricingOptionFee}
          customElement={children}
          customElementProps={{
            rate,
            amount,
            currency,
            formattedAmount,
          }}
          content={formattedAmount}
          {...otherProps}
        >
          <span>{formattedAmount}</span>
        </AsChildSlot>
      )}
    </CorePricingOption.Fee>
  );
});

/**
 * Props for the PricingOption Quantity component.
 */
export interface QuantityProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    quantity: number;
    maxQuantity: number;
    increment: () => void;
    decrement: () => void;
    setQuantity: (quantity: number) => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays a quantity selector for the pricing option. Only renders when the sale has started and the ticket definition is not sold out.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PricingOption.Quantity className="border rounded px-3 py-2" />
 *
 * // asChild with primitive
 * <PricingOption.Quantity asChild>
 *   <select className="border rounded px-3 py-2" />
 * </PricingOption.Quantity>
 *
 * // asChild with react component
 * <PricingOption.Quantity asChild>
 *   {React.forwardRef(({ quantity, maxQuantity, increment, decrement, setQuantity, ...props }, ref) => (
 *     <div ref={ref} {...props} className="flex items-center space-x-2">
 *       <button disabled={quantity === 0} onClick={decrement}>-</button>
 *       <span>{quantity}</span>
 *       <button disabled={quantity >= maxQuantity} onClick={increment}>+</button>
 *     </div>
 *   ))}
 * </PricingOption.Quantity>
 * ```
 */
export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CorePricingOption.Quantity>
        {({ quantity, maxQuantity, increment, decrement, setQuantity }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.pricingOptionQuantity}
            customElement={children}
            customElementProps={{
              quantity,
              maxQuantity,
              increment,
              decrement,
              setQuantity,
            }}
            value={quantity}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setQuantity(Number(event.target.value))
            }
            {...otherProps}
          >
            <select>
              {Array.from({ length: maxQuantity + 1 }).map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </AsChildSlot>
        )}
      </CorePricingOption.Quantity>
    );
  },
);
