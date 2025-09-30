export const roundPrice = (amount: number, _currency: string) =>
  Number(amount.toFixed(2));

export const formatPrice = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      currency,
      style: 'currency',
    }).format(amount);
  } catch (error) {
    return `${amount.toFixed(2)} ${currency}`;
  }
};
