import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import * as checkout from "@wix/auto_sdk_ecom_checkout";
import { redirects } from "@wix/redirects";

export { ChannelType } from "@wix/auto_sdk_ecom_checkout";

export type LineItem = checkout.LineItem;

export interface CheckoutServiceAPI {
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  createCheckout: (lineItems: LineItem[]) => Promise<void>;
}

export const CheckoutServiceDefinition =
  defineService<CheckoutServiceAPI>("checkout");

export interface CheckoutServiceConfig {
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

      const createCheckout = async (lineItems: LineItem[]) => {
        try {
          isLoading.set(true);
          error.set(null);

          const checkoutResult = await checkout.createCheckout({
            lineItems,
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
 * @param channelType - Optional channel type (defaults to WEB)
 * @param postFlowUrl - Optional URL to redirect after checkout completion
 * @returns Promise resolving to service configuration
 */
export const loadCheckoutServiceInitialData = async (
  channelType?: checkout.ChannelType,
  postFlowUrl?: string,
): Promise<CheckoutServiceConfigResult> => {
  return {
    [CheckoutServiceDefinition]: {
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
