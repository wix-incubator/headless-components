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
import { PricingOption } from '../../services/pricing-option-service.js';

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
  const { ticketDefinition, children } = props;

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
}

export interface FixedPricingRenderProps {
  /** Whether ticket definition is free */
  free: boolean;
  /** Fixed price */
  price: number;
  /** Price currency */
  currency: string;
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

  return props.children({
    free: ticketDefinition.pricingMethod!.free!,
    price: Number(fixedPrice.value!),
    currency: fixedPrice.currency!,
  });
}

export interface GuestPricingProps {
  /** Render prop function */
  children: (props: GuestPricingRenderProps) => React.ReactNode;
}

export interface GuestPricingRenderProps {
  /** Minimum price */
  minPrice: number;
  /** Price currency */
  currency: string;
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
  const guestPrice = ticketDefinition.pricingMethod?.guestPrice;

  if (!guestPrice) {
    return null;
  }

  const setPrice = (price: string) => {
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId: ticketDefinition._id!,
      priceOverride: price,
    });
  };

  return props.children({
    minPrice: Number(guestPrice.value!),
    currency: guestPrice.currency!,
    setPrice,
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
}

export interface SaleStartDateRenderProps {
  /** Sale start date in ISO string format */
  startDate: string;
  /** Formatted sale start date */
  startDateFormatted: string;
}

/**
 * TicketDefinition SaleStartDate core component that provides sale start date. Not rendered if sale isn't scheduled.
 *
 * @component
 */
export function SaleStartDate(props: SaleStartDateProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const saleScheduled =
    ticketDefinition.saleStatus === 'SALE_SCHEDULED' &&
    !!ticketDefinition.salePeriod?.startDate;

  if (!saleScheduled) {
    return null;
  }

  const dateObj = new Date(ticketDefinition.salePeriod!.startDate!);
  const startDate = dateObj.toISOString();
  const startDateFormatted = new Intl.DateTimeFormat('en-US').format(dateObj);

  return props.children({ startDate, startDateFormatted });
}

export interface SaleEndDateProps {
  /** Render prop function */
  children: (props: SaleEndDateRenderProps) => React.ReactNode;
}

export interface SaleEndDateRenderProps {
  /** Sale end date in ISO string format */
  endDate: string;
  /** Formatted sale end date */
  endDateFormatted: string;
  /** Whether sale has ended */
  saleEnded: boolean;
}

/**
 * TicketDefinition SaleEndDate core component that provides sale end date. Not rendered if sale is scheduled.
 *
 * @component
 */
export function SaleEndDate(props: SaleEndDateProps): React.ReactNode {
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const saleScheduled =
    ticketDefinition.saleStatus === 'SALE_SCHEDULED' &&
    !!ticketDefinition.salePeriod?.endDate;
  const saleEnded = ticketDefinition.saleStatus === 'SALE_ENDED';

  if (saleScheduled || !ticketDefinition.salePeriod) {
    return null;
  }

  const dateObj = new Date(ticketDefinition.salePeriod!.endDate!);
  const endDate = dateObj.toISOString();
  const endDateFormatted = new Intl.DateTimeFormat('en-US').format(dateObj);

  return props.children({ endDate, endDateFormatted, saleEnded });
}

export interface QuantityProps {
  /** Render prop function */
  children: (props: QuantityRenderProps) => React.ReactNode;
}

export interface QuantityRenderProps {
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
 * TicketDefinition Quantity core component that provides quantity controls. Not rendered for ticket definitions with pricing options or if sale hasn't started.
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

  if (
    ticketDefinition.pricingMethod?.pricingOptions ||
    ticketDefinition.saleStatus !== 'SALE_STARTED'
  ) {
    return null;
  }

  const quantity =
    ticketDefinitionListService.getCurrentSelectedQuantity(ticketDefinitionId);
  const maxQuantity =
    ticketDefinitionListService.getMaxQuantity(ticketDefinitionId);

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
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails || [];
  const hasPricingOptions = !!pricingOptions.length;

  if (!hasPricingOptions) {
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
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails || [];
  const hasPricingOptions = !!pricingOptions.length;

  if (!hasPricingOptions) {
    return null;
  }

  return props.children({ pricingOptions });
}
