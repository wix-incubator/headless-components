import { httpClient } from '@wix/essentials';
import { CheckoutServiceDefinition } from '@wix/headless-ecom/services';
import { defineService, implementService } from '@wix/services-definitions';
import {
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { PlanWithEnhancedData, PRICING_PLANS_APP_ID } from './plan-service.js';

export const PlanCheckoutServiceDefinition = defineService<{
  isLoadingSignal: ReadOnlySignal<boolean>;
  errorSignal: ReadOnlySignal<string | null>;
  goToPlanCheckout: (plan: PlanWithEnhancedData) => Promise<void>;
}>('planCheckoutService');

export const PlanCheckoutService = implementService.withConfig<void>()(
  PlanCheckoutServiceDefinition,
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const ecomCheckoutService = getService(CheckoutServiceDefinition);

    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);

    return {
      isLoadingSignal,
      errorSignal,
      goToPlanCheckout: async (plan: PlanWithEnhancedData) => {
        isLoadingSignal.set(true);
        errorSignal.set(null);
        try {
          const address = await fetchAddress().catch(() => null);
          await ecomCheckoutService.createCheckout(
            [
              {
                quantity: 1,
                catalogReference: {
                  appId: PRICING_PLANS_APP_ID,
                  catalogItemId: plan._id!,
                  options: {
                    type: 'PLAN',
                    planOptions: {
                      pricingVariantId:
                        plan.enhancedData.price.pricingVariantId,
                    },
                  },
                },
              },
            ],
            { billingInfo: address ? { address } : undefined },
          );
        } catch (error) {
          errorSignal.set(
            error instanceof Error
              ? error.message
              : 'Failed to go to plan checkout',
          );
        } finally {
          isLoadingSignal.set(false);
        }
      },
    };
  },
);

type AddressResponse = {
  country?: string;
  subdivision?: string;
  city?: string;
};

async function fetchAddress(): Promise<AddressResponse> {
  try {
    const response = await httpClient.fetchWithAuth(
      '/_api/pricing-plans-ecom/address',
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
}
