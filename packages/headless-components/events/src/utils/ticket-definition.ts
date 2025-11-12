import { wixEventsV2 } from '@wix/events';
import { WIX_FEE_RATE } from '../constants.js';
import { type TicketDefinition } from '../services/ticket-definition-service.js';
import { formatPrice, roundPrice } from './price.js';

export const getTicketDefinitionCurrency = (
  ticketDefinition: TicketDefinition,
) => {
  const { fixedPrice, guestPrice, pricingOptions } =
    ticketDefinition.pricingMethod!;

  return (fixedPrice?.currency ??
    guestPrice?.currency ??
    pricingOptions?.optionDetails?.[0]?.price?.currency)!;
};

export const getTicketDefinitionTax = (
  taxSettings: wixEventsV2.TaxSettings,
  price: number,
  currency: string,
  locale: Intl.LocalesArgument,
) => {
  const name = taxSettings.name!;
  const rate = Number(taxSettings.rate!);
  const included = taxSettings.type === 'INCLUDED_IN_PRICE';

  const tax = {
    name,
    rate,
    included,
    taxableValue: 0,
    taxValue: 0,
    formattedTaxValue: '',
  };

  if (included) {
    tax.taxableValue = roundPrice((price * 100) / (100 + rate), currency);
    tax.taxValue = roundPrice(price - tax.taxableValue, currency);
    tax.formattedTaxValue = formatPrice(tax.taxValue, currency, locale);
  } else {
    tax.taxableValue = price;
    tax.taxValue = roundPrice(price * (rate / 100), currency);
    tax.formattedTaxValue = formatPrice(tax.taxValue, currency, locale);
  }

  return tax;
};

export const getTicketDefinitionFee = (
  taxSettings: wixEventsV2.TaxSettings | undefined,
  price: number,
  currency: string,
  guestPricing: boolean,
  locale: Intl.LocalesArgument,
) => {
  const addedTax =
    taxSettings?.type === 'ADDED_AT_CHECKOUT' &&
    (!guestPricing || taxSettings.appliedToDonations)
      ? getTicketDefinitionTax(taxSettings, price, currency, locale)
      : undefined;
  const priceWithAddedTax = addedTax ? price + addedTax.taxValue : price;
  const value = roundPrice(priceWithAddedTax * (WIX_FEE_RATE / 100), currency);
  const formattedValue = formatPrice(value, currency, locale);

  return {
    rate: WIX_FEE_RATE,
    value,
    formattedValue,
  };
};

export const isTicketDefinitionAvailable = (
  ticketDefinition: TicketDefinition,
) => {
  return (
    !!ticketDefinition.limitPerCheckout &&
    ticketDefinition.saleStatus === 'SALE_STARTED'
  );
};
