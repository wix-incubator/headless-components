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
  pollOrder: () => Promise<void>;
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
            const response = await orders.getOrder(
              { eventId, orderNumber },
              {
                fieldset: [
                  orders.OrderFieldset.TICKETS,
                  orders.OrderFieldset.DETAILS,
                  orders.OrderFieldset.INVOICE,
                ],
              },
            );

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

    return {
      order,
      isPolling,
      pollOrder,
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

  console.log('invoice', order.invoice?.fees);

  return { order, eventId, orderNumber };
}

export const isOrderReady = (order: Order) =>
  order.ticketsQuantity === order.tickets?.length;
