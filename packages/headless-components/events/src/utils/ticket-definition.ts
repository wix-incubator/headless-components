import { wixEventsV2 } from '@wix/events';
import { type TicketDefinition } from '../services/ticket-definition-service.js';

const FEE_RATE = '2.5';

export const getTicketDefinitionTax = (
  taxSettings: wixEventsV2.TaxSettings,
  price: number,
  currency: string,
) => {
  const name = taxSettings.name!;
  const rate = taxSettings.rate!;
  const rateAmount = Number(rate);
  const included = taxSettings.type === 'INCLUDED_IN_PRICE';
  const amount = included
    ? (price - (price * 100) / (100 + rateAmount)).toFixed(2)
    : ((price * rateAmount) / 100).toFixed(2);
  const formattedAmount = `${amount} ${currency}`;

  return {
    name,
    rate,
    included,
    amount,
    formattedAmount,
  };
};

export const getTicketDefinitionFee = (
  taxSettings: wixEventsV2.TaxSettings | undefined,
  price: number,
  currency: string,
  guestPricing: boolean,
) => {
  const rateAmount = Number(FEE_RATE);
  const priceWithTax =
    taxSettings?.type === 'ADDED_AT_CHECKOUT' &&
    (!guestPricing || taxSettings.appliedToDonations)
      ? price * ((100 + Number(taxSettings.rate)) / 100)
      : price;
  const amount = ((priceWithTax * rateAmount) / 100).toFixed(2);
  const formattedAmount = `${amount} ${currency}`;

  return {
    rate: FEE_RATE,
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
