import { wixEventsV2 } from '@wix/events';

export const getTaxConfig = (
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
