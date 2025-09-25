import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { orders } from '@wix/events';

export type Order = orders.Order;

export interface OrderServiceAPI {
  order: Signal<Order>;
}

export interface OrderServiceConfig {
  order: Order;
}

export const OrderServiceDefinition = defineService<
  OrderServiceAPI,
  OrderServiceConfig
>('order');

export const OrderService = implementService.withConfig<OrderServiceConfig>()(
  OrderServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const order = signalsService.signal<Order>(config.order);

    return {
      order,
    };
  },
);

export async function loadOrderServiceConfig(
  eventId: string,
  orderNumber: string,
): Promise<OrderServiceConfig> {
  const order = await orders.getOrder(
    { eventId, orderNumber },
    {
      fieldset: [
        orders.OrderFieldset.TICKETS,
        orders.OrderFieldset.DETAILS,
        orders.OrderFieldset.INVOICE,
      ],
    },
  );

  console.log('order', order);

  return { order };
}
