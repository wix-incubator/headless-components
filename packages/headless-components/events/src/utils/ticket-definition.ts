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
) => {
  const name = taxSettings.name!;
  const rate = Number(taxSettings.rate!);
  const included = taxSettings.type === 'INCLUDED_IN_PRICE';

  const tax = {
    name,
    rate,
    included,
    taxableAmount: 0,
    taxAmount: 0,
    formattedTaxAmount: '',
  };

  if (included) {
    tax.taxableAmount = roundPrice((price * 100) / (100 + rate), currency);
    tax.taxAmount = roundPrice(price - tax.taxableAmount, currency);
    tax.formattedTaxAmount = formatPrice(tax.taxAmount, currency);
  } else {
    tax.taxableAmount = price;
    tax.taxAmount = roundPrice(price * (rate / 100), currency);
    tax.formattedTaxAmount = formatPrice(tax.taxAmount, currency);
  }

  return tax;
};

export const getTicketDefinitionFee = (
  taxSettings: wixEventsV2.TaxSettings | undefined,
  price: number,
  currency: string,
  guestPricing: boolean,
) => {
  const addedTax =
    taxSettings?.type === 'ADDED_AT_CHECKOUT' &&
    (!guestPricing || taxSettings.appliedToDonations)
      ? getTicketDefinitionTax(taxSettings, price, currency)
      : undefined;
  const priceWithAddedTax = addedTax ? price + addedTax.taxAmount : price;
  const amount = roundPrice(priceWithAddedTax * (WIX_FEE_RATE / 100), currency);
  const formattedAmount = formatPrice(amount, currency);

  return {
    rate: WIX_FEE_RATE,
    amount,
    formattedAmount,
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
