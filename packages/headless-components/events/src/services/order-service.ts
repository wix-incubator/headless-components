import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { orders } from '@wix/events';
import { poll } from '../utils/poll.js';

export type Order = orders.Order;

export interface OrderServiceAPI {
  order: Signal<Order>;
  isPolling: Signal<boolean>;
}

export interface OrderServiceConfig {
  order: Order;
  eventId: string;
  orderNumber: string;
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
    const isPolling = signalsService.signal<boolean>(false);
    const { eventId, orderNumber } = config;

    const pollOrder = async () => {
      if (isOrderReady(order.get())) {
        return;
      }

      isPolling.set(true);

      try {
        await poll({
          callback: async () => {
            const response = await loadOrder({ eventId, orderNumber });

            order.set(response);

            return isOrderReady(response);
          },
          intervalMs: 2000,
          totalMs: 15000,
        });
      } catch (error) {
        console.log(`Error polling order: ${error}`);
      } finally {
        isPolling.set(false);
      }
    };

    if (config.order) {
      pollOrder();
    }

    return {
      order,
      isPolling,
    };
  },
);

export async function loadOrderServiceConfig({
  eventId,
  orderNumber,
}: LoadOrderServiceConfigParams): Promise<OrderServiceConfig> {
  const order = await loadOrder({ eventId, orderNumber });

  return { order, eventId, orderNumber };
}

export function isOrderReady(order: Order) {
  return order.ticketsQuantity === order.tickets?.length;
}

function loadOrder({ eventId, orderNumber }: LoadOrderParams) {
  return orders.getOrder(
    { eventId, orderNumber },
    {
      fieldset: [
        orders.OrderFieldset.TICKETS,
        orders.OrderFieldset.DETAILS,
        orders.OrderFieldset.INVOICE,
      ],
    },
  );
}

interface LoadOrderServiceConfigParams {
  eventId: string;
  orderNumber: string;
}

interface LoadOrderParams {
  eventId: string;
  orderNumber: string;
}
