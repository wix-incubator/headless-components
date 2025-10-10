import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InvoiceItemService,
  InvoiceItemServiceDefinition,
  type InvoiceItem,
  type InvoiceItemServiceConfig,
} from '../../services/invoice-item-service.js';
import { formatPrice } from '../../utils/price.js';

export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Invoice item */
  invoiceItem: InvoiceItem;
}

/**
 * InvoiceItem Root core component that provides invoice item service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, invoiceItem } = props;

  const invoiceItemServiceConfig: InvoiceItemServiceConfig = {
    invoiceItem,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        InvoiceItemServiceDefinition,
        InvoiceItemService,
        invoiceItemServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface NameProps {
  /** Render prop function */
  children: (props: NameRenderProps) => React.ReactNode;
}

export interface NameRenderProps {
  /** Invoice item name */
  name: string;
}

/**
 * InvoiceItem Name core component that provides invoice item name.
 *
 * @component
 */
export function Name(props: NameProps): React.ReactNode {
  const invoiceItemService = useService(InvoiceItemServiceDefinition);

  const invoiceItem = invoiceItemService.invoiceItem.get();
  const name = invoiceItem.name!;

  return props.children({ name });
}

export interface PriceProps {
  /** Render prop function */
  children: (props: PriceRenderProps) => React.ReactNode;
}

export interface PriceRenderProps {
  /** Formatted invoice item price amount */
  formattedAmount: string;
  /** Invoice item price amount */
  amount: number;
  /** Invoice item price currency */
  currency: string;
}

/**
 * InvoiceItem Price core component that provides invoice item price.
 *
 * @component
 */
export function Price(props: PriceProps): React.ReactNode {
  const invoiceItemService = useService(InvoiceItemServiceDefinition);

  const invoiceItem = invoiceItemService.invoiceItem.get();
  const price = invoiceItem.price!;
  const currency = price.currency!;
  const amount = Number(price.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    amount,
    currency,
  });
}

export interface QuantityProps {
  /** Render prop function */
  children: (props: QuantityRenderProps) => React.ReactNode;
}

export interface QuantityRenderProps {
  /** Invoice item quantity */
  quantity: number;
}

/**
 * InvoiceItem Quantity core component that provides invoice item quantity.
 *
 * @component
 */
export function Quantity(props: QuantityProps): React.ReactNode {
  const invoiceItemService = useService(InvoiceItemServiceDefinition);

  const invoiceItem = invoiceItemService.invoiceItem.get();
  const quantity = invoiceItem.quantity!;

  return props.children({ quantity });
}

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
}

export interface TotalRenderProps {
  /** Formatted invoice item total amount */
  formattedAmount: string;
  /** Invoice item total amount */
  amount: number;
  /** Invoice item total currency */
  currency: string;
}

/**
 * InvoiceItem Total core component that provides invoice item total.
 *
 * @component
 */
export function Total(props: TotalProps): React.ReactNode {
  const invoiceItemService = useService(InvoiceItemServiceDefinition);

  const invoiceItem = invoiceItemService.invoiceItem.get();
  const total = invoiceItem.total!;
  const currency = total.currency!;
  const amount = Number(total.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    amount,
    currency,
  });
}
