import { checkout } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { auth } from "@wix/essentials";

/**
 * Options for creating a checkout with a custom line item.
 */
export interface CustomLineItemCheckoutOptions {
  /**
   * The name of the product for the custom line item.
   * @example "My Custom Product"
   */
  productName: string;
  /**
   * A description for the price, which will be displayed to the customer.
   * @example "per month"
   */
  priceDescription: string;
  /**
   * An array of policies related to this custom item.
   * Each policy should have a title and content.
   */
  policies?: { content: string, title: string }[];
  /**
   * The URL to redirect the user to after the checkout is successfully completed.
   */
  postFlowUrl?: string;
  /**
   * The quantity of the product.
   * @default 1
   */
  quantity?: number;
  /**
   * The price of the product.
   */
  price: string;
  /**
   * The currency of the product. It will only take effect after configuring the payment provider to accept this currency.
   */
  currency: string;
}

/**
 * Creates a factory function to generate checkout URLs for custom line items with a fixed price.
 * This is useful when you have a single product or service with a known price,
 * and you want to dynamically create checkout sessions for it.
 *
 * @param factoryOpts - The options for the factory, including the price.
 * @returns A function that takes `CustomLineItemCheckoutOptions` and returns a checkout URL.
 */
export function getCustomLineItemCheckoutURLFactory(factoryOpts: CustomLineItemCheckoutOptions) {
  /**
   * Generates a checkout URL for a custom line item.
   * @param opts - The options for the custom line item checkout.
   * @returns A promise that resolves to the full URL for the redirect session to the checkout.
   * @throws Will throw an error if the checkout creation or redirect session fails.
   */
   return async function getCustomLineItemCheckoutURL() {
    try {
      const checkoutResult = await auth.elevate(checkout.createCheckout)({
        customLineItems: [
          {
            productName: {
              original: factoryOpts.productName,
            },
            price: factoryOpts.price,
            quantity: factoryOpts.quantity || 1,
            itemType: {
              preset: checkout.ItemTypeItemType.PHYSICAL,
            },
            priceDescription: {
              original: factoryOpts.priceDescription
            },
            policies: factoryOpts.policies || [],
          }
        ],
        channelType: checkout.ChannelType.WEB,
        ...(factoryOpts.currency ? {
          checkoutInfo: {
            currency: factoryOpts.currency,
          }
        } : {})
      });

      if (!checkoutResult._id) {
        throw new Error(`Failed to create checkout for custom line item ${factoryOpts.productName}`);
      }

      const { redirectSession } = await redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkoutResult._id },
        callbacks: {
          ...(factoryOpts.postFlowUrl ? {postFlowUrl: factoryOpts.postFlowUrl} : {})
        },
      });

      return redirectSession?.fullUrl!;
    } catch (error) {
      throw error;
    }
  }
}
