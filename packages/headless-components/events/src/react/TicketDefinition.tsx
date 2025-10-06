import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { type TicketDefinition } from '../services/ticket-definition-service.js';
import { type PricingOption as PricingOptionType } from '../services/pricing-option-service.js';
import { isTicketDefinitionAvailable } from '../utils/ticket-definition.js';
import * as PricingOption from './PricingOption.js';
import * as CoreTicketDefinition from './core/TicketDefinition.js';

enum TestIds {
  ticketDefinitionRoot = 'ticket-definition-root',
  ticketDefinitionName = 'ticket-definition-name',
  ticketDefinitionDescription = 'ticket-definition-description',
  ticketDefinitionFixedPricing = 'ticket-definition-fixed-pricing',
  ticketDefinitionGuestPricing = 'ticket-definition-guest-pricing',
  ticketDefinitionPricingRange = 'ticket-definition-pricing-range',
  ticketDefinitionTax = 'ticket-definition-tax',
  ticketDefinitionFee = 'ticket-definition-fee',
  ticketDefinitionRemaining = 'ticket-definition-remaining',
  ticketDefinitionSaleStartDate = 'ticket-definition-sale-start-date',
  ticketDefinitionSaleEndDate = 'ticket-definition-sale-end-date',
  ticketDefinitionQuantity = 'ticket-definition-quantity',
  ticketDefinitionPricingOptions = 'ticket-definition-pricing-options',
}

/**
 * Props for the TicketDefinition Root component.
 */
export interface RootProps {
  /** Ticket definition */
  ticketDefinition: TicketDefinition;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the ticket definition */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides ticket definition context to all child components.
 * Must be used as the top-level TicketDefinition component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { TicketDefinition } from '@wix/events/components';
 *
 * function TicketDefinitionComponent({ ticketDefinition }) {
 *   return (
 *     <TicketDefinition.Root ticketDefinition={ticketDefinition}>
 *       <TicketDefinition.Name />
 *       <TicketDefinition.Description />
 *       <TicketDefinition.FixedPricing />
 *       <TicketDefinition.GuestPricing />
 *       <TicketDefinition.PricingOptions>
 *         <TicketDefinition.PricingOptionRepeater>
 *           <PricingOption.Name />
 *           <PricingOption.Pricing />
 *           <PricingOption.Quantity />
 *         </TicketDefinition.PricingOptionRepeater>
 *       </TicketDefinition.PricingOptions>
 *       <TicketDefinition.Remaining />
 *       <TicketDefinition.SaleStartDate />
 *       <TicketDefinition.SaleEndDate />
 *       <TicketDefinition.Quantity />
 *     </TicketDefinition.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { ticketDefinition, asChild, children, className, ...otherProps } =
    props;

  return (
    <CoreTicketDefinition.Root ticketDefinition={ticketDefinition}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionRoot}
        data-sold-out={ticketDefinition.limitPerCheckout === 0}
        data-sale-started={ticketDefinition.saleStatus === 'SALE_STARTED'}
        data-sale-ended={ticketDefinition.saleStatus === 'SALE_ENDED'}
        data-free={!!ticketDefinition.pricingMethod?.free}
        data-fixed-pricing={!!ticketDefinition.pricingMethod?.fixedPrice}
        data-guest-pricing={!!ticketDefinition.pricingMethod?.guestPrice}
        data-pricing-options={!!ticketDefinition.pricingMethod?.pricingOptions}
        data-available={isTicketDefinitionAvailable(ticketDefinition)}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreTicketDefinition.Root>
  );
});

/**
 * Props for the TicketDefinition Name component.
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
 * Displays the ticket definition name with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.Name className="text-xl font-bold" />
 *
 * // asChild with primitive
 * <TicketDefinition.Name asChild>
 *   <h2 className="text-xl font-bold" />
 * </TicketDefinition.Name>
 *
 * // asChild with react component
 * <TicketDefinition.Name asChild>
 *   {React.forwardRef(({ name, ...props }, ref) => (
 *     <h2 ref={ref} {...props} className="text-xl font-bold">
 *       {name}
 *     </h2>
 *   ))}
 * </TicketDefinition.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketDefinition.Name>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketDefinitionName}
          customElement={children}
          customElementProps={{ name }}
          content={name}
          {...otherProps}
        >
          <span>{name}</span>
        </AsChildSlot>
      )}
    </CoreTicketDefinition.Name>
  );
});

/**
 * Props for the TicketDefinition Description component.
 */
export interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the ticket definition description with customizable rendering. Not rendered if there is no description.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.Description className="text-sm text-gray-600" />
 *
 * // asChild with primitive
 * <TicketDefinition.Description asChild>
 *   <p className="text-sm text-gray-600" />
 * </TicketDefinition.Description>
 *
 * // asChild with react component
 * <TicketDefinition.Description asChild>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-sm text-gray-600">
 *       {description}
 *     </p>
 *   ))}
 * </TicketDefinition.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.Description>
        {({ description }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionDescription}
            customElement={children}
            customElementProps={{ description }}
            content={description}
            {...otherProps}
          >
            <span>{description}</span>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.Description>
    );
  },
);

/**
 * Props for the TicketDefinition FixedPricing component.
 */
export interface FixedPricingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price: number;
    currency: string;
    formattedPrice: string;
    free: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the fixed pricing for the ticket definition. Only renders when ticket definition has fixed price pricing method.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.FixedPricing className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <TicketDefinition.FixedPricing asChild>
 *   <span className="text-lg font-semibold" />
 * </TicketDefinition.FixedPricing>
 *
 * // asChild with react component
 * <TicketDefinition.FixedPricing asChild>
 *   {React.forwardRef(({ free, price, currency, formattedPrice, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-semibold">
 *       {free ? 'Free' : `${formattedPrice}`}
 *     </span>
 *   ))}
 * </TicketDefinition.FixedPricing>
 * ```
 */
export const FixedPricing = React.forwardRef<HTMLElement, FixedPricingProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.FixedPricing>
        {({ price, currency, formattedPrice, free }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionFixedPricing}
            customElement={children}
            customElementProps={{
              price,
              currency,
              formattedPrice,
              free,
            }}
            content={formattedPrice}
            {...otherProps}
          >
            <span>{formattedPrice}</span>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.FixedPricing>
    );
  },
);

/**
 * Props for the TicketDefinition GuestPricing component.
 */
export interface GuestPricingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    price: string | undefined;
    minPrice: number;
    currency: string;
    formattedMinPrice: string;
    setPrice: (price: string) => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays an input for guest pricing (pay-what-you-want). Only renders when ticket definition has guest price pricing method.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.GuestPricing className="border rounded px-3 py-2" />
 *
 * // asChild with primitive
 * <TicketDefinition.GuestPricing asChild>
 *   <input className="border rounded px-3 py-2" />
 * </TicketDefinition.GuestPricing>
 *
 * // asChild with react component
 * <TicketDefinition.GuestPricing asChild>
 *   {React.forwardRef(({ minPrice, currency, formattedMinPrice, setPrice, ...props }, ref) => (
 *     <input ref={ref} {...props} className="border rounded px-3 py-2" />
 *   ))}
 * </TicketDefinition.GuestPricing>
 * ```
 */
export const GuestPricing = React.forwardRef<HTMLElement, GuestPricingProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.GuestPricing>
        {({ price, minPrice, currency, formattedMinPrice, setPrice }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionGuestPricing}
            customElement={children}
            customElementProps={{
              price,
              minPrice,
              currency,
              formattedMinPrice,
              setPrice,
            }}
            type="number"
            placeholder={formattedMinPrice}
            value={price}
            min={minPrice}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(event.target.value)
            }
            {...otherProps}
          >
            <input />
          </AsChildSlot>
        )}
      </CoreTicketDefinition.GuestPricing>
    );
  },
);

/**
 * Props for the TicketDefinition PricingRange component.
 */
export interface PricingRangeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    minPrice: number;
    maxPrice: number;
    currency: string;
    formattedMinPrice: string;
    formattedMaxPrice: string;
    formattedPriceRange: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the pricing range for the ticket definition. Only renders when ticket definition has pricing options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.PricingRange className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <TicketDefinition.PricingRange asChild>
 *   <span className="text-sm text-gray-500" />
 * </TicketDefinition.PricingRange>
 *
 * // asChild with react component
 * <TicketDefinition.PricingRange asChild>
 *   {React.forwardRef(({ minPrice, maxPrice, currency, formattedPriceRange, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-gray-500">
 *       {formattedPriceRange}
 *     </span>
 *   ))}
 * </TicketDefinition.PricingRange>
 * ```
 */
export const PricingRange = React.forwardRef<HTMLElement, PricingRangeProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.PricingRange>
        {({
          minPrice,
          maxPrice,
          currency,
          formattedMinPrice,
          formattedMaxPrice,
          formattedPriceRange,
        }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionPricingRange}
            customElement={children}
            customElementProps={{
              minPrice,
              maxPrice,
              currency,
              formattedMinPrice,
              formattedMaxPrice,
              formattedPriceRange,
            }}
            content={formattedPriceRange}
            {...otherProps}
          >
            <span>{formattedPriceRange}</span>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.PricingRange>
    );
  },
);

/**
 * Props for the TicketDefinition Tax component.
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
 * Displays the tax for the ticket definition. Only renders when event has tax settings, ticket definition is not free and has no pricing options, or ticket definition has guest pricing and tax is applied to donations.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.Tax className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <TicketDefinition.Tax asChild>
 *   <span className="text-sm text-gray-500" />
 * </TicketDefinition.Tax>
 *
 * // asChild with react component
 * <TicketDefinition.Tax asChild>
 *   {React.forwardRef(({ name, rate, included, taxableAmount, taxAmount, currency, formattedTaxAmount, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-gray-500">
 *       {included ? `${name} included` : `+${formattedTaxAmount} ${name}`}
 *     </span>
 *   ))}
 * </TicketDefinition.Tax>
 * ```
 */
export const Tax = React.forwardRef<HTMLElement, TaxProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketDefinition.Tax>
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
          data-testid={TestIds.ticketDefinitionTax}
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
    </CoreTicketDefinition.Tax>
  );
});

/**
 * Props for the TicketDefinition Fee component.
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
 * Displays the fee for the ticket definition. Only renders when ticket definition has fee enabled, is not free and has no pricing options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.Fee className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <TicketDefinition.Fee asChild>
 *   <span className="text-sm text-gray-500" />
 * </TicketDefinition.Fee>
 *
 * // asChild with react component
 * <TicketDefinition.Fee asChild>
 *   {React.forwardRef(({ rate, amount, currency, formattedAmount, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-gray-500">
 *       +{formattedAmount} service fee
 *     </span>
 *   ))}
 * </TicketDefinition.Fee>
 * ```
 */
export const Fee = React.forwardRef<HTMLElement, FeeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketDefinition.Fee>
      {({ rate, amount, currency, formattedAmount }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketDefinitionFee}
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
    </CoreTicketDefinition.Fee>
  );
});

/**
 * Props for the TicketDefinition Remaining component.
 */
export interface RemainingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ remaining: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the remaining count.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.Remaining className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <TicketDefinition.Remaining asChild>
 *   <span className="text-sm text-gray-500" />
 * </TicketDefinition.Remaining>
 *
 * // asChild with react component
 * <TicketDefinition.Remaining asChild>
 *   {React.forwardRef(({ remaining, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-gray-500">
 *       {remaining} remaining
 *     </span>
 *   ))}
 * </TicketDefinition.Remaining>
 * ```
 */
export const Remaining = React.forwardRef<HTMLElement, RemainingProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.Remaining>
        {({ remaining }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionRemaining}
            customElement={children}
            customElementProps={{ remaining }}
            content={remaining}
            {...otherProps}
          >
            <span>{remaining}</span>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.Remaining>
    );
  },
);

/**
 * Props for the TicketDefinition SaleStartDate component.
 */
export interface SaleStartDateProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Sale start date */
    startDate: Date;
    /** Formatted sale start date */
    startDateFormatted: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the sale start date. Only renders when the sale is scheduled to start in the future.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.SaleStartDate className="text-sm" />
 *
 * // asChild with primitive
 * <TicketDefinition.SaleStartDate asChild>
 *   <span className="text-sm" />
 * </TicketDefinition.SaleStartDate>
 *
 * // asChild with react component
 * <TicketDefinition.SaleStartDate asChild>
 *   {React.forwardRef(({ startDate, startDateFormatted, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm">
 *       Sale starts: {startDateFormatted}
 *     </span>
 *   ))}
 * </TicketDefinition.SaleStartDate>
 * ```
 */
export const SaleStartDate = React.forwardRef<HTMLElement, SaleStartDateProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.SaleStartDate>
        {({ startDate, startDateFormatted }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionSaleStartDate}
            customElement={children}
            customElementProps={{ startDate, startDateFormatted }}
            content={startDateFormatted}
            {...otherProps}
          >
            <span>{startDateFormatted}</span>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.SaleStartDate>
    );
  },
);

/**
 * Props for the TicketDefinition SaleEndDate component.
 */
export interface SaleEndDateProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Sale end date */
    endDate: Date;
    /** Formatted sale end date */
    endDateFormatted: string;
    /** Whether sale has ended */
    saleEnded: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the sale end date. Only renders when the sale has started or ended.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.SaleEndDate className="text-sm text-red-600" />
 *
 * // asChild with primitive
 * <TicketDefinition.SaleEndDate asChild>
 *   <span className="text-sm text-red-600" />
 * </TicketDefinition.SaleEndDate>
 *
 * // asChild with react component
 * <TicketDefinition.SaleEndDate asChild>
 *   {React.forwardRef(({ endDate, endDateFormatted, saleEnded, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-red-600">
 *       {saleEnded ? 'Sale ended' : 'Sale ends'}: {endDateFormatted}
 *     </span>
 *   ))}
 * </TicketDefinition.SaleEndDate>
 * ```
 */
export const SaleEndDate = React.forwardRef<HTMLElement, SaleEndDateProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.SaleEndDate>
        {({ endDate, endDateFormatted, saleEnded }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionSaleEndDate}
            customElement={children}
            customElementProps={{ endDate, endDateFormatted, saleEnded }}
            content={endDateFormatted}
            {...otherProps}
          >
            <span>{endDateFormatted}</span>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.SaleEndDate>
    );
  },
);

/**
 * Props for the TicketDefinition Quantity component.
 */
export interface QuantityProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    options: number[];
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
 * Displays a quantity selector for the ticket definition. Only renders when there are no pricing options, the sale has started, and the ticket definition is not sold out.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketDefinition.Quantity className="border rounded px-3 py-2" />
 *
 * // asChild with primitive
 * <TicketDefinition.Quantity asChild>
 *   <select className="border rounded px-3 py-2" />
 * </TicketDefinition.Quantity>
 *
 * // asChild with react component
 * <TicketDefinition.Quantity asChild>
 *   {React.forwardRef(({ options, quantity, maxQuantity, increment, decrement, setQuantity, ...props }, ref) => (
 *     <div ref={ref} {...props} className="flex items-center space-x-2">
 *       <button disabled={quantity === 0} onClick={decrement}>-</button>
 *       <span>{quantity}</span>
 *       <button disabled={quantity >= maxQuantity} onClick={increment}>+</button>
 *     </div>
 *   ))}
 * </TicketDefinition.Quantity>
 * ```
 */
export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketDefinition.Quantity>
        {({
          options,
          quantity,
          maxQuantity,
          increment,
          decrement,
          setQuantity,
        }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketDefinitionQuantity}
            customElement={children}
            customElementProps={{
              options,
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
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </AsChildSlot>
        )}
      </CoreTicketDefinition.Quantity>
    );
  },
);

/**
 * Props for the TicketDefinition PricingOptions component.
 */
export interface PricingOptionsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{ pricingOptions: PricingOptionType[] }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for pricing options. Only renders when there are pricing options available.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <TicketDefinition.PricingOptions>
 *   <TicketDefinition.PricingOptionRepeater>
 *     <PricingOption.Name />
 *     <PricingOption.Pricing />
 *     <PricingOption.Quantity />
 *   </TicketDefinition.PricingOptionRepeater>
 * </TicketDefinition.PricingOptions>
 * ```
 */
export const PricingOptions = React.forwardRef<
  HTMLElement,
  PricingOptionsProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketDefinition.PricingOptions>
      {({ pricingOptions }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketDefinitionPricingOptions}
          customElement={children}
          customElementProps={{ pricingOptions }}
          {...otherProps}
        >
          <div>{children as React.ReactNode}</div>
        </AsChildSlot>
      )}
    </CoreTicketDefinition.PricingOptions>
  );
});

/**
 * Props for the TicketDefinition PricingOptionRepeater component.
 */
export interface PricingOptionRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the pricing option element */
  className?: string;
}

/**
 * Repeater component that renders PricingOption.Root for each pricing option.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <TicketDefinition.PricingOptionRepeater>
 *   <PricingOption.Name />
 *   <PricingOption.Pricing />
 *   <PricingOption.Quantity />
 * </TicketDefinition.PricingOptionRepeater>
 * ```
 */
export const PricingOptionRepeater = (
  props: PricingOptionRepeaterProps,
): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreTicketDefinition.PricingOptionRepeater>
      {({ pricingOptions }) =>
        pricingOptions.map((pricingOption) => (
          <PricingOption.Root
            key={pricingOption.optionId}
            pricingOption={pricingOption}
            className={className}
          >
            {children}
          </PricingOption.Root>
        ))
      }
    </CoreTicketDefinition.PricingOptionRepeater>
  );
};
