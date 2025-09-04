import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';

export type PricingOption = ticketDefinitionsV2.OptionDetails;

export interface PricingOptionServiceAPI {
  pricingOption: Signal<PricingOption>;
}

export interface PricingOptionServiceConfig {
  pricingOption: PricingOption;
}

export const PricingOptionServiceDefinition = defineService<
  PricingOptionServiceAPI,
  PricingOptionServiceConfig
>('pricing-option');

export const PricingOptionService = implementService.withConfig<PricingOptionServiceConfig>()(
  PricingOptionServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const pricingOption: Signal<PricingOption> = signalsService.signal(
      config.pricingOption,
    );

    return { pricingOption };
  },
);
