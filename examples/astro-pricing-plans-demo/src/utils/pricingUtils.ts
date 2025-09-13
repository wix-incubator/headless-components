/**
 * Utility functions for pricing and currency formatting
 */

export interface PricingInfo {
  displayPrice: string;
  period: string;
  rawPrice: any;
}

/**
 * Currency symbols mapping for different currencies
 */
export const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
  RUB: '₽',
  BRL: 'R$',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF ',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
  RSD: 'din',
  BAM: 'КМ',
  MKD: 'ден',
  ALL: 'L',
  AMD: '֏',
  AZN: '₼',
  BYN: 'Br',
  GEL: '₾',
  KZT: '₸',
  KGS: 'с',
  MDL: 'L',
  TJS: 'ЅМ',
  TMT: 'T',
  UZS: 'soʻm',
  UAH: '₴',
};

/**
 * Currencies that don't use decimal places
 */
export const noDécimalCurrencies = [
  'JPY',
  'KRW',
  'VND',
  'CLP',
  'PYG',
  'RWF',
  'UGX',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
];

/**
 * Extracts pricing information from a Wix plan pricing object
 */
export const getPricingInfo = (
  pricing: any,
  logPrefix: string = ''
): PricingInfo => {
  if (!pricing) {
    return { displayPrice: 'Free', period: '', rawPrice: null };
  }

  if (logPrefix) {
    console.log(
      `${logPrefix} pricing structure:`,
      JSON.stringify(pricing, null, 2)
    );
  }

  let price = null;
  let period = '';

  if (pricing.singlePaymentForDuration) {
    price = pricing.singlePaymentForDuration.price;
    period = 'one-time';
  } else if (pricing.recurrences && pricing.recurrences.length > 0) {
    const recurrence = pricing.recurrences[0];
    price = recurrence.price;
    period = `per ${recurrence.cycleDuration.interval}`;
  }

  return {
    displayPrice: formatPrice(price, logPrefix),
    period,
    rawPrice: price,
  };
};

/**
 * Formats a price object into a display-ready string with currency symbol
 */
export const formatPrice = (price: any, logPrefix: string = ''): string => {
  if (!price) {
    if (logPrefix) {
      console.warn(`${logPrefix}: No price data available`);
    }
    return 'Free';
  }

  if (logPrefix) {
    console.log(`${logPrefix} price object:`, JSON.stringify(price, null, 2));
  }

  let value = 0;
  let currency = 'USD';

  // Extract value from various possible structures
  if (typeof price.value === 'number') {
    value = price.value;
  } else if (typeof price.amount === 'number') {
    value = price.amount;
  } else if (typeof price.price === 'number') {
    value = price.price;
  } else if (price.money && typeof price.money.value === 'number') {
    value = price.money.value;
  } else if (price.money && typeof price.money.amount === 'number') {
    value = price.money.amount;
  } else if (typeof price === 'number') {
    value = price;
  }

  // Extract currency
  if (price.currency) {
    currency = price.currency;
  } else if (price.currencyCode) {
    currency = price.currencyCode;
  } else if (price.money && price.money.currency) {
    currency = price.money.currency;
  } else if (price.money && price.money.currencyCode) {
    currency = price.money.currencyCode;
  }

  const hasDecimals = !noDécimalCurrencies.includes(currency);

  // Convert cents to dollars if needed (intelligent detection)
  if (value >= 100 && hasDecimals && currency !== 'JPY') {
    const dollarsValue = value / 100;
    if (dollarsValue < 1000) {
      value = dollarsValue;
    }
  }

  const symbol = currencySymbols[currency] || currency + ' ';

  // Format the final price
  if (hasDecimals) {
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2);
    return `${symbol}${formatted}`;
  } else {
    return `${symbol}${Math.round(value)}`;
  }
};
