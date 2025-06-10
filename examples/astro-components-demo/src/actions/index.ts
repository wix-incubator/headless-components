import { customCheckoutActionFactory } from "@wix/headless-stores/astro/actions";

export const server = {
  customCheckoutAction: customCheckoutActionFactory("321"),
};
