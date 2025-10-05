import { defineService, implementService } from '@wix/services-definitions';
import * as operationsApi from '@wix/auto_sdk_restaurants_operations';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
export interface OLOSettingsServiceAPI {
  operation: Signal<operationsApi.Operation | undefined>;
  selectedItem?: Signal<unknown>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  //   fetchOperations: () => Promise<void>;
}

export interface OLOSettingsServiceConfig {
  operation?: operationsApi.Operation;
}

export const OLOSettingsServiceDefinition =
  defineService<OLOSettingsServiceAPI>('oloSettings');

export const OLOSettingsService =
  implementService.withConfig<OLOSettingsServiceConfig>()(
    OLOSettingsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const operation = signalsService.signal<
        operationsApi.Operation | undefined
      >(config.operation);
      const selectedItem = signalsService.signal<unknown>(null);
      const isLoading = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);

      return {
        operation,
        isLoading,
        error,
        selectedItem,
      };
    },
  );

export async function loadOLOSettingsServiceConfig() {
  try {
    // Fetch operation groups and operations in parallel
    const operationsResponse = await operationsApi.queryOperation().find();

    return {
      operation: operationsResponse.items[0] || undefined,
    };
  } catch (error) {
    console.error('Failed to load OLO settings service config:', error);
    return {
      operation: undefined,
      isLoading: false,
      error:
        (error as Error)?.message ||
        'Failed to load OLO settings service config',
    };
  }
}
