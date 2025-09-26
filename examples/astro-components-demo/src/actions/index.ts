import { customCheckoutActionFactory } from "@wix/headless-stores/astro/actions";

export const server = {
  buyTestProduct: customCheckoutActionFactory({
    price: "321",
    productName: "test",
    priceDescription: "Very special price",
  }),
};
