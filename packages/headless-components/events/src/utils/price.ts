export const formatPrice = (amount: string, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      currency,
      style: 'currency',
    }).format(Number(amount));
  } catch (error) {
    return `${amount} ${currency}`;
  }
};
