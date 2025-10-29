import { defineService, implementService } from '@wix/services-definitions';
import {
  operations as operationsSDK,
  operationGroups as operationGroupsSDK,
  menuOrderingSettings as menuOrderingSettingsSDK
} from "@wix/restaurants";
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { MenusServiceConfig } from '@wix/restaurants/services';
import { OperationMapper } from '../mappers/operation-mapper.js';
export interface OLOSettingsServiceAPI {
  operationGroup: Signal<operationGroupsSDK.OperationGroup | undefined>;
  operation: Signal<operationsSDK.Operation | undefined>;
  selectedItem?: Signal<unknown>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  currentFulfillment: Signal<string>;
  currentTimeSlot: Signal<string>;
  filterMenus: (
    menus: MenusServiceConfig['menus'],
  ) => MenusServiceConfig['menus'];
}

export interface OLOSettingsServiceConfig {
  operationGroup?: operationGroupsSDK.OperationGroup;
  operation?: operationsSDK.Operation;
  menuIdsByOperation?: string[];
}

export const OLOSettingsServiceDefinition =
  defineService<OLOSettingsServiceAPI>('oloSettings');

export const OLOSettingsService =
  implementService.withConfig<OLOSettingsServiceConfig>()(
    OLOSettingsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const operationGroup = signalsService.signal<
      operationGroupsSDK.OperationGroup | undefined
      >(config.operationGroup);
      const operation = signalsService.signal<
        operationsSDK.Operation | undefined
      >(config.operation);
      const selectedItem = signalsService.signal<unknown>(null);
      const isLoading = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);
      const currentFulfillment = signalsService.signal<string>('Pickup');
      const currentTimeSlot = signalsService.signal<string>('10-14');
      // const isAsap = operation.get()?.orderSchedulingType === OrderSchedulingType.ASAP;

      const filterMenus = (menus: MenusServiceConfig['menus']) => {
        return menus?.filter(
          (menu) =>
            menu.visible && config.menuIdsByOperation?.includes(menu._id || ''),
        );
      };

      return {
        operationGroup,
        operation,
        isLoading,
        error,
        selectedItem,
        currentFulfillment,
        currentTimeSlot,
        filterMenus,
      };
    },
  );

export async function loadOLOSettingsServiceConfig() {
  try {
    // Fetch operation groups and operations in parallel
    const [operationGroupsResponse, operationsResponse] = await Promise.all([
      operationGroupsSDK.queryOperationGroups().find(),
      operationsSDK.queryOperation().find(),
    ]);

    const [currentOperation] = operationsResponse.items;
    if (!currentOperation) {
      throw new Error('Operation not found');
    }
    const operation = OperationMapper(currentOperation);

    const menuIdsByOperation = await menuOrderingSettingsSDK
      .queryMenuOrderingSettings()
      .in('operationId', operationsResponse.items[0]?._id)
      .find();

    return {
      operationGroup: operationGroupsResponse.items[0] || undefined,
      operation,
      menuIdsByOperation: menuIdsByOperation.items.map((menu) => menu.menuId),
    };
  } catch (error) {
    console.error('Failed to load OLO settings service config:', error);
    return {
      operationGroup: undefined,
      operation: undefined,
      isLoading: false,
      error:
        (error as Error)?.message ||
        'Failed to load OLO settings service config',
    };
  }
}
