import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { orders } from '@wix/events';

export type InvoiceItem = orders.Item;

export interface InvoiceItemServiceAPI {
  invoiceItem: Signal<InvoiceItem>;
}

export interface InvoiceItemServiceConfig {
  invoiceItem: InvoiceItem;
}

export const InvoiceItemServiceDefinition = defineService<
  InvoiceItemServiceAPI,
  InvoiceItemServiceConfig
>('invoiceItem');

export const InvoiceItemService =
  implementService.withConfig<InvoiceItemServiceConfig>()(
    InvoiceItemServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const invoiceItem = signalsService.signal<InvoiceItem>(
        config.invoiceItem,
      );

      return { invoiceItem };
    },
  );
