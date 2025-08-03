import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import * as checkout from "@wix/auto_sdk_ecom_checkout";
import { redirects } from "@wix/redirects";

const CATALOG_APP_ID_V3 = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

export interface CheckoutServiceAPI {
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  createCheckout: () => Promise<void>;
}

export const CheckoutServiceDefinition =
  defineService<CheckoutServiceAPI>("checkout");

export interface CheckoutServiceConfig {
  productId: string;
  variantId?: string;
  quantity?: number;
  channelType?: checkout.ChannelType;
  postFlowUrl?: string;
}

export const CheckoutService =
  implementService.withConfig<CheckoutServiceConfig>()(
    CheckoutServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const isLoading: Signal<boolean> = signalsService.signal(false);
      const error: Signal<string | null> = signalsService.signal(null as any);

      const createCheckout = async () => {
        try {
          isLoading.set(true);
          error.set(null);

          const checkoutResult = await checkout.createCheckout({
            lineItems: [
              {
                catalogReference: {
                  catalogItemId: config.productId,
                  appId: CATALOG_APP_ID_V3,
                  options: config.variantId
                    ? {
                        variantId: config.variantId,
                      }
                    : {},
                },
                quantity: config.quantity || 1,
              },
            ],
            channelType: config.channelType || checkout.ChannelType.WEB,
          });

          if (!checkoutResult._id) {
            throw new Error("Failed to create checkout");
          }

          const { redirectSession } = await redirects.createRedirectSession({
            ecomCheckout: { checkoutId: checkoutResult._id },
            callbacks: {
              postFlowUrl:
                config.postFlowUrl ||
                (typeof window !== "undefined" ? window.location.href : ""),
            },
          });

          if (redirectSession?.fullUrl) {
            if (typeof window !== "undefined") {
              window.location.href = redirectSession.fullUrl;
            }
          } else {
            throw new Error("Failed to create redirect session");
          }
        } catch (err) {
          error.set(
            err instanceof Error ? err.message : "Failed to create checkout",
          );
        } finally {
          isLoading.set(false);
        }
      };

      return {
        isLoading,
        error,
        createCheckout,
      };
    },
  );

export type CheckoutServiceConfigResult = {
  [CheckoutServiceDefinition]: CheckoutServiceConfig;
};

/**
 * Load initial configuration for the Checkout service.
 * This function prepares the catalog reference configuration for checkout creation.
 *
 * @param productId - The product ID to create checkout for
 * @param variantId - Optional variant ID
 * @param quantity - Optional quantity (defaults to 1)
 * @param channelType - Optional channel type (defaults to WEB)
 * @param postFlowUrl - Optional URL to redirect after checkout completion
 * @returns Promise resolving to service configuration
 */
export const loadCheckoutServiceInitialData = async (
  productId: string,
  variantId?: string,
  quantity?: number,
  channelType?: checkout.ChannelType,
  postFlowUrl?: string,
): Promise<CheckoutServiceConfigResult> => {
  return {
    [CheckoutServiceDefinition]: {
      productId,
      ...(variantId && { variantId }),
      ...(quantity && { quantity }),
      ...(channelType && { channelType }),
      ...(postFlowUrl && { postFlowUrl }),
    },
  };
};

export const checkoutServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadCheckoutServiceInitialData>
    >[typeof CheckoutServiceDefinition];
  },
>(
  servicesConfigs: T,
) => {
  return [
    CheckoutServiceDefinition,
    CheckoutService,
    servicesConfigs[CheckoutServiceDefinition] as any,
  ] as const;
};
