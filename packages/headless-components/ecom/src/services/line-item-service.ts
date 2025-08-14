import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { type LineItem } from "./current-cart-service.js";

export interface LineItemServiceAPI {
  lineItem: Signal<LineItem>;
}

export const LineItemServiceDefinition = defineService<LineItemServiceAPI>("lineItem");

export interface LineItemServiceConfig {
  lineItem: LineItem;
}

export const LineItemService = implementService.withConfig<LineItemServiceConfig>()(
  LineItemServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const lineItem: Signal<LineItem> = signalsService.signal(
      config.lineItem,
    );

    return {
      lineItem,
    };
  },
);
