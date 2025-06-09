import { defineAction } from 'astro:actions';
import { getCustomLineItemCheckoutURLFactory } from '@wix/headless-stores/server-actions';

const customCheckout = getCustomLineItemCheckoutURLFactory({ price: "100" });

export const customCheckoutAction = defineAction({
  handler: async function() {
    const checkoutUrl = await customCheckout({
      productName: "test",
      priceDescription: "test",
      policies: [{ content: "test", title: "test" }],
      quantity: 1,
    });

    return checkoutUrl;
  },
});
