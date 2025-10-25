import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { i18n } from '@wix/essentials';

/**
 * Currency code type (e.g., 'USD', 'EUR', 'GBP')
 */
export type Currency = string;

/**
 * Locale code type (e.g., 'en-US', 'fr-FR', 'de-DE')
 */
export type Locale = string;

/**
 * Configuration interface for the Currency service.
 * Contains the default currency and locale codes used as fallbacks.
 *
 * @interface CurrencyServiceConfig
 */
export type CurrencyServiceConfig = {
  /** Default currency code to use as fallback (e.g., 'USD', 'EUR', 'GBP') */
  defaultCurrency: Currency;
  /** Default locale code to use as fallback (e.g., 'en-US', 'fr-FR', 'de-DE') */
  defaultLocale: Locale;
};

/**
 * Service definition for the Currency service.
 * This defines the reactive API contract for managing currency and locale information.
 * Provides reactive signals for currency code and locale code.
 * The service automatically attempts to get the current locale from @wix/essentials i18n service.
 *
 * @constant
 */
export const CurrencyServiceDefinition = defineService<
  {
    /** Reactive signal containing the current currency code */
    currency: Signal<Currency>;
    /** Reactive signal containing the current locale code */
    locale: Signal<Locale>;
  },
  CurrencyServiceConfig
>('currency');

/**
 * Implementation of the Currency service that manages reactive currency and locale data.
 * This service provides signals for currency and locale information.
 * The service automatically attempts to get the current locale from @wix/essentials i18n service,
 * falling back to the provided defaultLocale if unavailable. The currency uses the defaultCurrency value.
 *
 * @example
 * ```tsx
 * import { CurrencyService, CurrencyServiceDefinition } from '@wix/headless-components';
 * import { useService } from '@wix/services-manager-react';
 *
 * function CurrencyComponent() {
 *   const currencyConfig = {
 *     defaultCurrency: 'USD',
 *     defaultLocale: 'en-US'
 *   };
 *
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [CurrencyServiceDefinition, CurrencyService.withConfig(currencyConfig)]
 *     ])}>
 *       <CurrencyDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function CurrencyDisplay() {
 *   const currencyService = useService(CurrencyServiceDefinition);
 *   const currency = currencyService.currency.get(); // 'USD'
 *   const locale = currencyService.locale.get();     // Current site locale or 'en-US' fallback
 *
 *   return (
 *     <div>
 *       <p>Currency: {currency}</p>
 *       <p>Locale: {locale}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const CurrencyService =
  implementService.withConfig<CurrencyServiceConfig>()(
    CurrencyServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const currencySignal = signalsService.signal<Currency>(
        config.defaultCurrency,
      );
      const localeSignal = signalsService.signal<Locale>(config.defaultLocale);

      try {
        // For now, return a default currency code - this should be replaced with actual API call
        currencySignal.set(config.defaultCurrency);
        localeSignal.set(i18n.getLocale() ?? config.defaultLocale);
      } catch (error) {
        // Fallback to default
        currencySignal.set(config.defaultCurrency);
        localeSignal.set(config.defaultLocale);
      }

      return {
        currency: currencySignal,
        locale: localeSignal,
      };
    },
  );
