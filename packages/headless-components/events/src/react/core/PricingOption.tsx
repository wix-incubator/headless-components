import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  PricingOptionService,
  PricingOptionServiceDefinition,
  type PricingOption,
  type PricingOptionServiceConfig,
} from '../../services/pricing-option-service.js';
import { TicketDefinitionListServiceDefinition } from '../../services/ticket-definition-list-service.js';
import { TicketDefinitionServiceDefinition } from '../../services/ticket-definition-service.js';
import { EventServiceDefinition } from '../../services/event-service.js';
import {
  getTicketDefinitionFee,
  getTicketDefinitionTax,
  isTicketDefinitionAvailable,
} from '../../utils/ticket-definition.js';
import { formatPrice } from '../../utils/price.js';

export interface RootProps {
  /** Child components that will have access to the pricing option service */
  children: React.ReactNode;
  /** Pricing option */
  pricingOption: PricingOption;
}

/**
 * PricingOption Root core component that provides pricing option service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, pricingOption } = props;

  const pricingOptionServiceConfig: PricingOptionServiceConfig = {
    pricingOption,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        PricingOptionServiceDefinition,
        PricingOptionService,
        pricingOptionServiceConfig,
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
  /** Pricing option name */
  name: string;
}

/**
 * PricingOption Name core component that provides pricing option name.
 *
 * @component
 */
export function Name(props: NameProps): React.ReactNode {
  const pricingOptionService = useService(PricingOptionServiceDefinition);

  const pricingOption = pricingOptionService.pricingOption.get();
  const name = pricingOption.name!;

  return props.children({ name });
}

export interface PricingProps {
  /** Render prop function */
  children: (props: PricingRenderProps) => React.ReactNode;
  /** Locale */
  locale?: Intl.LocalesArgument;
}

export interface PricingRenderProps {
  /** Price */
  value: number;
  /** Price currency */
  currency: string;
  /** Formatted price */
  formattedValue: string;
}

/**
 * PricingOption Pricing core component that provides pricing data.
 *
 * @component
 */
export function Pricing(props: PricingProps): React.ReactNode {
  const pricingOptionService = useService(PricingOptionServiceDefinition);

  const pricingOption = pricingOptionService.pricingOption.get();
  const value = Number(pricingOption.price!.value!);
  const currency = pricingOption.price!.currency!;
  const formattedValue = formatPrice(value, currency, props.locale);

  return props.children({
    value,
    currency,
    formattedValue,
  });
}

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
  /** Locale */
  locale?: Intl.LocalesArgument;
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
 * PricingOption Tax core component that provides tax data. Not rendered when event has no tax settings.
 *
 * @component
 */
export function Tax(props: TaxProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);
  const pricingOptionService = useService(PricingOptionServiceDefinition);

  const event = eventService.event.get();
  const pricingOption = pricingOptionService.pricingOption.get();
  const taxSettings = event.registration?.tickets?.taxSettings;

  if (!taxSettings) {
    return null;
  }

  const price = Number(pricingOption.price!.value!);
  const currency = pricingOption.price!.currency!;

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
  locale?: Intl.LocalesArgument;
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
 * PricingOption Fee core component that provides fee data. Not rendered when ticket definition has no fee enabled, or when fee is included in the price.
 *
 * @component
 */
export function Fee(props: FeeProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);
  const pricingOptionService = useService(PricingOptionServiceDefinition);

  const event = eventService.event.get();
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const pricingOption = pricingOptionService.pricingOption.get();
  const taxSettings = event.registration?.tickets?.taxSettings;

  if (ticketDefinition.feeType !== 'FEE_ADDED_AT_CHECKOUT') {
    return null;
  }

  const price = Number(pricingOption.price!.value!);
  const currency = pricingOption.price!.currency!;

  const { rate, value, formattedValue } = getTicketDefinitionFee(
    taxSettings,
    price,
    currency,
    false,
    props.locale,
  );

  return props.children({
    rate,
    value,
    currency,
    formattedValue,
  });
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
 * PricingOption Quantity core component that provides quantity controls. Not rendered if ticket definition is not available (is sold out or sale hasn't started).
 *
 * @component
 */
export function Quantity(props: QuantityProps): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );
  const ticketDefinitionService = useService(TicketDefinitionServiceDefinition);
  const pricingOptionService = useService(PricingOptionServiceDefinition);

  const pricingOption = pricingOptionService.pricingOption.get();
  const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
  const pricingOptionId = pricingOption.optionId!;
  const ticketDefinitionId = ticketDefinition._id!;

  if (!isTicketDefinitionAvailable(ticketDefinition)) {
    return null;
  }

  const quantity = ticketDefinitionListService.getCurrentQuantity(
    ticketDefinitionId,
    pricingOptionId,
  );
  const maxQuantity =
    ticketDefinitionListService.getMaxQuantity(ticketDefinitionId);

  const options = Array.from({ length: maxQuantity + 1 }, (_, index) => index);

  const increment = () =>
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      pricingOptionId,
      quantity: quantity + 1,
    });

  const decrement = () =>
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      pricingOptionId,
      quantity: quantity - 1,
    });

  const setQuantity = (quantity: number) =>
    ticketDefinitionListService.setQuantity({
      ticketDefinitionId,
      pricingOptionId,
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
