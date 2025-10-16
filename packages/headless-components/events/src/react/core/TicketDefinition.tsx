import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketDefinitionService,
  TicketDefinitionServiceDefinition,
  type TicketDefinition,
  type TicketDefinitionServiceConfig,
} from '../../services/ticket-definition-service.js';
import { TicketDefinitionListServiceDefinition } from '../../services/ticket-definition-list-service.js';
import { type PricingOption } from '../../services/pricing-option-service.js';
import { EventServiceDefinition } from '../../services/event-service.js';
import {
  getTicketDefinitionCurrency,
  getTicketDefinitionFee,
  getTicketDefinitionTax,
  isTicketDefinitionAvailable,
} from '../../utils/ticket-definition.js';
import { formatFullDate } from '../../utils/date.js';
import { formatPrice } from '../../utils/price.js';

export interface RootProps {
  /** Child components that will have access to the ticket definition service */
  children: React.ReactNode;
  /** Ticket definition */
  ticketDefinition: TicketDefinition;
}

/**
 * TicketDefinition Root core component that provides ticket definition service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, ticketDefinition } = props;

  const ticketDefinitionServiceConfig: TicketDefinitionServiceConfig = {
    ticketDefinition,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        TicketDefinitionServiceDefinition,
        TicketDefinitionService,
        ticketDefinitionServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface NameProps {
  /** Render prop function */
  children: (props: NameRenderProps) => React.ReactNode;
}

export interface NameRenderProps {
  /** Ticket definition name */
  name: string;
}

/**
 * TicketDefinition Name core component that provides ticket definition name.
 *
 * @component
 */
export function Name(props: NameProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const name = ticketDefinition.name!;

  return props.children({ name });
}

export interface DescriptionProps {
  /** Render prop function */
  children: (props: DescriptionRenderProps) => React.ReactNode;
}

export interface DescriptionRenderProps {
  /** Ticket definition description */
  description: string;
}

/**
 * TicketDefinition Description core component that provides ticket definition description. Not rendered if there is no description.
 *
 * @component
 */
export function Description(props: DescriptionProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const description = ticketDefinition.description;

  if (!description) {
    return null;
  }

  return props.children({ description });
}

export interface FixedPricingProps {
  /** Render prop function */
  children: (props: FixedPricingRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface FixedPricingRenderProps {
  /** Fixed price value */
  value: number;
  /** Price currency */
  currency: string;
  /** Formatted price value */
  formattedValue: string;
  /** Whether ticket definition is free */
  free: boolean;
}

/**
 * TicketDefinition FixedPricing core component that provides fixed pricing data. Not rendered if ticket definition doesn't have fixed pricing.
 *
 * @component
 */
export function FixedPricing(props: FixedPricingProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const fixedPrice = ticketDefinition.pricingMethod?.fixedPrice;

  if (!fixedPrice) {
    return null;
  }

  const value = Number(fixedPrice.value!);
  const currency = getTicketDefinitionCurrency(ticketDefinition);
  const formattedValue = formatPrice(value, currency, props.locale);

  return props.children({
    value,
    currency,
    formattedValue,
    free: ticketDefinition.pricingMethod!.free!,
  });
}

export interface GuestPricingProps {
  /** Render prop function */
  children: (props: GuestPricingRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface GuestPricingRenderProps {
  /** Current price */
  price: string | undefined;
  /** Minimum price */
  minPrice: number;
  /** Price currency */
  currency: string;
  /** Formatted minimum price */
  formattedMinPrice: string;
  /** Function to set price */
  setPrice: (price: string) => void;
}

/**
 * TicketDefinition GuestPricing core component that provides guest pricing data. Not rendered if ticket definition doesn't have guest pricing.
 *
 * @component
 */
export function GuestPricing(props: GuestPricingProps): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const ticketDefinitionId = ticketDefinition._id!;
  const guestPrice = ticketDefinition.pricingMethod?.guestPrice;

  if (!guestPrice) {
    return null;
  }

  const setPrice = (price: string) => {
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      priceOverride: price,
    });
  };

  const price =
    ticketDefinitionListService.getCurrentPriceOverride(ticketDefinitionId);
  const minPrice = Number(guestPrice.value!);
  const currency = getTicketDefinitionCurrency(ticketDefinition);
  const formattedMinPrice = formatPrice(minPrice, currency, props.locale);

  return props.children({
    price,
    minPrice,
    currency,
    formattedMinPrice,
    setPrice,
  });
}

export interface PricingRangeProps {
  /** Render prop function */
  children: (props: PricingRangeRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface PricingRangeRenderProps {
  /** Minimum price */
  minPrice: number;
  /** Maximum price */
  maxPrice: number;
  /** Price currency */
  currency: string;
  /** Formatted minimum price */
  formattedMinPrice: string;
  /** Formatted maximum price */
  formattedMaxPrice: string;
  /** Formatted price range */
  formattedPriceRange: string;
}

/**
 * TicketDefinition PricingRange core component that provides pricing range data. Not rendered if ticket definition doesn't have pricing options.
 *
 * @component
 */
export function PricingRange(props: PricingRangeProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const pricingOptions =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails ?? [];

  if (!pricingOptions.length) {
    return null;
  }

  const prices = pricingOptions.map((option) => Number(option.price!.value!));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currency = getTicketDefinitionCurrency(ticketDefinition);
  const formattedMinPrice = formatPrice(minPrice, currency, props.locale);
  const formattedMaxPrice = formatPrice(maxPrice, currency, props.locale);
  const formattedPriceRange =
    minPrice === maxPrice
      ? formattedMinPrice
      : `${formattedMinPrice} - ${formattedMaxPrice}`;

  return props.children({
    minPrice,
    maxPrice,
    currency,
    formattedMinPrice,
    formattedMaxPrice,
    formattedPriceRange,
  });
}

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface TaxRenderProps {
  /** Tax name */
  name: string;
  /** Tax rate */
  rate: number;
  /** Whether tax is included in price */
  included: boolean;
  /** Taxable value */
  taxableValue: number;
  /** Tax value */
  taxValue: number;
  /** Tax currency */
  currency: string;
  /** Formatted tax value */
  formattedTaxValue: string;
}

/**
 * TicketDefinition Tax core component that provides tax data. Not rendered when event has no tax settings, or when ticket definition is free or has pricing options, or when ticket definition has guest pricing and tax is not applied to donations.
 *
 * @component
 */
export function Tax(props: TaxProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );

  const event = eventService.event.get();
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();

  const taxSettings = event.registration?.tickets?.taxSettings;
  const fixedPrice = ticketDefinition.pricingMethod?.fixedPrice;
  const guestPrice = ticketDefinition.pricingMethod?.guestPrice;
  const pricingOptions =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails ?? [];

  if (
    !taxSettings ||
    ticketDefinition.pricingMethod!.free ||
    pricingOptions.length ||
    (guestPrice && !taxSettings.appliedToDonations)
  ) {
    return null;
  }

  const priceOverride = ticketDefinitionListService.getCurrentPriceOverride(
    ticketDefinition._id!,
  );
  const price = Number(guestPrice ? priceOverride || '0' : fixedPrice!.value);
  const currency = getTicketDefinitionCurrency(ticketDefinition);

  const { name, rate, included, taxableValue, taxValue, formattedTaxValue } =
    getTicketDefinitionTax(taxSettings, price, currency, props.locale);

  return props.children({
    name,
    rate,
    included,
    taxableValue,
    taxValue,
    currency,
    formattedTaxValue,
  });
}

export interface FeeProps {
  /** Render prop function */
  children: (props: FeeRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface FeeRenderProps {
  /** Fee rate */
  rate: number;
  /** Fee value */
  value: number;
  /** Fee currency */
  currency: string;
  /** Formatted fee value */
  formattedValue: string;
}

/**
 * TicketDefinition Fee core component that provides fee data. Not rendered when ticket definition has no fee enabled, or when ticket definition is free or has pricing options, or when fee is included in the price.
 *
 * @component
 */
export function Fee(props: FeeProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );

  const event = eventService.event.get();
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();

  const taxSettings = event.registration?.tickets?.taxSettings;
  const fixedPrice = ticketDefinition.pricingMethod?.fixedPrice;
  const guestPrice = ticketDefinition.pricingMethod?.guestPrice;
  const pricingOptions =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails ?? [];

  if (
    ticketDefinition.feeType !== 'FEE_ADDED_AT_CHECKOUT' ||
    ticketDefinition.pricingMethod!.free ||
    pricingOptions.length
  ) {
    return null;
  }

  const priceOverride = ticketDefinitionListService.getCurrentPriceOverride(
    ticketDefinition._id!,
  );
  const price = Number(guestPrice ? priceOverride || '0' : fixedPrice!.value);
  const currency = getTicketDefinitionCurrency(ticketDefinition);

  const { rate, value, formattedValue } = getTicketDefinitionFee(
    taxSettings,
    price,
    currency,
    !!guestPrice,
    props.locale,
  );

  return props.children({
    rate,
    value,
    currency,
    formattedValue,
  });
}

export interface RemainingProps {
  /** Render prop function */
  children: (props: RemainingRenderProps) => React.ReactNode;
}

export interface RemainingRenderProps {
  /** Remaining tickets count */
  remaining: number;
}

/**
 * TicketDefinition Remaining core component that provides remaining tickets count.
 *
 * @component
 */
export function Remaining(props: RemainingProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const remaining = ticketDefinition.limitPerCheckout || 0;

  return props.children({ remaining });
}

export interface SaleStartDateProps {
  /** Render prop function */
  children: (props: SaleStartDateRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface SaleStartDateRenderProps {
  /** Sale start date */
  startDate: Date;
  /** Formatted sale start date */
  startDateFormatted: string;
}

/**
 * TicketDefinition SaleStartDate core component that provides sale start date. Not rendered if sale isn't scheduled.
 *
 * @component
 */
export function SaleStartDate(props: SaleStartDateProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const event = eventService.event.get();
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const saleScheduled = ticketDefinition.saleStatus === 'SALE_SCHEDULED';
  const timeZoneId = event.dateAndTimeSettings!.timeZoneId!;

  if (!saleScheduled) {
    return null;
  }

  const startDate = new Date(ticketDefinition.salePeriod!.startDate!);
  const startDateFormatted = formatFullDate(
    startDate,
    timeZoneId,
    false,
    props.locale,
  );

  return props.children({ startDate, startDateFormatted });
}

export interface SaleEndDateProps {
  /** Render prop function */
  children: (props: SaleEndDateRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface SaleEndDateRenderProps {
  /** Sale end date */
  endDate: Date;
  /** Formatted sale end date */
  endDateFormatted: string;
  /** Whether sale has ended */
  saleEnded: boolean;
}

/**
 * TicketDefinition SaleEndDate core component that provides sale end date. Not rendered if sale is scheduled or there is no sale period.
 *
 * @component
 */
export function SaleEndDate(props: SaleEndDateProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const event = eventService.event.get();
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const saleScheduled = ticketDefinition.saleStatus === 'SALE_SCHEDULED';
  const saleEnded = ticketDefinition.saleStatus === 'SALE_ENDED';
  const timeZoneId = event.dateAndTimeSettings!.timeZoneId!;

  if (saleScheduled || !ticketDefinition.salePeriod) {
    return null;
  }

  const endDate = new Date(ticketDefinition.salePeriod!.endDate!);
  const endDateFormatted = formatFullDate(
    endDate,
    timeZoneId,
    false,
    props.locale,
  );

  return props.children({ endDate, endDateFormatted, saleEnded });
}

export interface QuantityProps {
  /** Render prop function */
  children: (props: QuantityRenderProps) => React.ReactNode;
}

export interface QuantityRenderProps {
  /** Array of quantity options */
  options: number[];
  /** Current quantity */
  quantity: number;
  /** Maximum quantity allowed */
  maxQuantity: number;
  /** Function to increment quantity */
  increment: () => void;
  /** Function to decrement quantity */
  decrement: () => void;
  /** Function to set specific quantity */
  setQuantity: (quantity: number) => void;
}

/**
 * TicketDefinition Quantity core component that provides quantity controls. Not rendered for ticket definitions with pricing options, or if ticket definition is not available (is sold out or sale hasn't started).
 *
 * @component
 */
export function Quantity(props: QuantityProps): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const ticketDefinitionId = ticketDefinition._id!;
  const pricingOptions =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails ?? [];

  if (!isTicketDefinitionAvailable(ticketDefinition) || pricingOptions.length) {
    return null;
  }

  const quantity =
    ticketDefinitionListService.getCurrentQuantity(ticketDefinitionId);
  const maxQuantity =
    ticketDefinitionListService.getMaxQuantity(ticketDefinitionId);

  const options = Array.from({ length: maxQuantity + 1 }, (_, index) => index);

  const increment = () =>
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      quantity: quantity + 1,
    });

  const decrement = () =>
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      quantity: quantity - 1,
    });

  const setQuantity = (quantity: number) =>
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      quantity,
    });

  return props.children({
    options,
    quantity,
    maxQuantity,
    increment,
    decrement,
    setQuantity,
  });
}

export interface PricingOptionsProps {
  /** Render prop function */
  children: (props: PricingOptionsRenderProps) => React.ReactNode;
}

export interface PricingOptionsRenderProps {
  /** Array of pricing options */
  pricingOptions: PricingOption[];
}

/**
 * TicketDefinition PricingOptions core component that provides pricing options. Not rendered if there are no pricing options.
 *
 * @component
 */
export function PricingOptions(props: PricingOptionsProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const pricingOptions =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails ?? [];

  if (!pricingOptions.length) {
    return null;
  }

  return props.children({ pricingOptions });
}

export interface PricingOptionRepeaterProps {
  /** Render prop function */
  children: (props: PricingOptionRepeaterRenderProps) => React.ReactNode;
}

export interface PricingOptionRepeaterRenderProps {
  /** Array of pricing options */
  pricingOptions: PricingOption[];
}

/**
 * TicketDefinition PricingOptionRepeater core component that provides pricing options. Not rendered if there are no pricing options.
 *
 * @component
 */
export function PricingOptionRepeater(
  props: PricingOptionRepeaterProps,
): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);

  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const pricingOptions =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails ?? [];

  if (!pricingOptions.length) {
    return null;
  }

  return props.children({ pricingOptions });
}
