export const roundPrice = (amount: number, _currency: string) =>
  Number(amount.toFixed(2));

export const formatPrice = (
  amount: number,
  currency: string,
  locale: Intl.LocalesArgument,
) => {
  try {
    return new Intl.NumberFormat(locale, {
      currency,
      style: 'currency',
    }).format(amount);
  } catch (error) {
    return `${amount.toFixed(2)} ${currency}`;
  }
};
