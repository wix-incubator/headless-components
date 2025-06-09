import { defineAction } from 'astro:actions';
import { getCustomLineItemCheckoutURLFactory, type CustomLineItemCheckoutOptions } from '@wix/headless-stores/server-actions';

const customCheckout = getCustomLineItemCheckoutURLFactory({ price: "100" });

export const customCheckoutAction = defineAction({
  handler: async function() {
    console.log("customCheckoutAction started");
    const checkoutUrl = await customCheckout({
      productName: "test",
      priceDescription: "test",
      policies: [{ content: "test", title: "test" }],
      quantity: 1,
    });

    console.log("customCheckoutAction ended");
    return checkoutUrl;
  },
});
