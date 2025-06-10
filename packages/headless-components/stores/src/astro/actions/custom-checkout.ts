/// <reference types="astro/client" />
import { defineAction } from 'astro:actions';
import { getCustomLineItemCheckoutURLFactory, type CustomLineItemCheckoutOptions } from '@wix/headless-stores/server-actions';

/**
 * Creates an Astro action factory for custom checkout functionality with line items.
 *
 * This factory function generates an Astro action that can be used to create custom
 * checkout URLs with specific line items. It wraps the Wix headless stores server
 * action functionality in an Astro-compatible action format.
 *
 * @param {CustomLineItemCheckoutOptions} factoryOpts - Configuration options for the custom checkout
 * @param {string} factoryOpts.productName - The name of the product for the custom line item
 * @param {string} [factoryOpts.priceDescription] - A description for the price, which will be displayed to the customer
 * @param {Array<{content: string, title: string}>} [factoryOpts.policies] - An array of policies related to this custom item
 * @param {string} [factoryOpts.postFlowUrl] - The URL to redirect the user to after the checkout is successfully completed
 * @param {number} [factoryOpts.quantity=1] - The quantity of the product
 * @param {string} factoryOpts.price - The price of the product
 *
 * @returns {import('astro:actions').ActionAPIContext} An Astro action that when called,
 *   returns a Promise resolving to the custom checkout URL
 *
 * @example
 * ```typescript
 * // Define the action with your configuration
 * const customCheckoutAction = customCheckoutActionFactory({
 *   productName: "Premium Subscription",
 *   price: "29.99",
 *   priceDescription: "per month",
 *   quantity: 1,
 *   postFlowUrl: "https://yoursite.com/thank-you",
 *   policies: [
 *     {
 *       title: "Refund Policy",
 *       content: "30-day money back guarantee"
 *     }
 *   ]
 * });
 *
 * // Use in your Astro component or API route
 * const checkoutUrl = await customCheckoutAction();
 * ```
 *
 * @example
 * ```typescript
 * // In your Astro actions file (src/actions/index.ts)
 * import { customCheckoutActionFactory } from '@wix/headless-components/stores/astro';
 *
 * export const server = {
 *   checkout: customCheckoutActionFactory({
 *     productName: "Custom Service",
 *     price: "99.00",
 *     quantity: 1
 *   })
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link https://docs.astro.build/en/guides/actions/} Astro Actions Documentation
 * @see {@link https://dev.wix.com/docs/sdk/headless/api-reference/stores/checkout} Wix Stores Checkout API
 */
export const customCheckoutActionFactory = (factoryOpts: CustomLineItemCheckoutOptions) => defineAction({
  handler: () => getCustomLineItemCheckoutURLFactory(factoryOpts)(),
});
