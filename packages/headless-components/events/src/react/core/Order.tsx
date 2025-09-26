import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  isOrderReady,
  OrderService,
  OrderServiceConfig,
  OrderServiceDefinition,
} from '../../services/order-service.js';
import { formatDateMonthDayYear } from '../../utils/date.js';
import { InvoiceItem } from '../../services/invoice-item-service.js';
import { useEffect } from 'react';

export interface RootProps {
  /** Child components that will have access to the order service */
  children: React.ReactNode;
  /** Configuration for the order service */
  orderServiceConfig: OrderServiceConfig;
}

/**
 * Order Root core component that provides order service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        OrderServiceDefinition,
        OrderService,
        props.orderServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

export interface OrderNumberProps {
  /** Render prop function */
  children: (props: OrderNumberRenderProps) => React.ReactNode;
}

export interface OrderNumberRenderProps {
  /** Order number */
  orderNumber: string;
}

/**
 * Order OrderNumber core component that provides order number.
 *
 * @component
 */
export function OrderNumber(props: OrderNumberProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const orderNumber = orderService.order.get().orderNumber!;

  return props.children({ orderNumber });
}

export interface CreatedDateProps {
  /** Render prop function */
  children: (props: CreatedDateRenderProps) => React.ReactNode;
}

export interface CreatedDateRenderProps {
  /** Created date */
  createdDate: string;
  /** Whether the order is ready */
  isReady: boolean;
}

/**
 * Order CreatedDate core component that provides created date.
 *
 * @component
 */
export function CreatedDate(props: CreatedDateProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const createdDate = formatDateMonthDayYear(orderService.order.get().created!);
  const isReady = isOrderReady(orderService.order.get());

  useEffect(() => {
    orderService.pollOrder();
  }, []);

  return props.children({ createdDate, isReady });
}

export interface DownloadTicketsButtonProps {
  /** Render prop function */
  children: (props: DownloadTicketsButtonRenderProps) => React.ReactNode;
}

export interface DownloadTicketsButtonRenderProps {
  /** Tickets PDF URL */
  ticketsPdfUrl: string;
  /** Whether the button is visible */
  isVisible: boolean;
}

/**
 * Order DownloadTicketsButton core component that provides tickets PDF URL.
 *
 * @component
 */
export function DownloadTicketsButton(
  props: DownloadTicketsButtonProps,
): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const ticketsPdfUrl = orderService.order.get().ticketsPdf!;
  const isPolling = orderService.isPolling.get();
  const isReady = isOrderReady(orderService.order.get());

  const isVisible = isReady && !isPolling;

  if (!isVisible) {
    return null;
  }

  return props.children({ ticketsPdfUrl, isVisible });
}

export interface InvoiceItemsProps {
  /** Render prop function */
  children: (props: InvoiceItemsRenderProps) => React.ReactNode;
}

export interface InvoiceItemsRenderProps {
  /** Invoice items */
  invoiceItems: InvoiceItem[];
}

/**
 * Order InvoiceItems core component that provides invoice items.
 *
 * @component
 */
export function InvoiceItems(props: InvoiceItemsProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const invoiceItems = orderService.order.get().invoice?.items!;

  return props.children({ invoiceItems });
}

export interface InvoiceItemRepeaterProps {
  /** Render prop function */
  children: (props: InvoiceItemRepeaterRenderProps) => React.ReactNode;
}

export interface InvoiceItemRepeaterRenderProps {
  /** Invoice items */
  invoiceItems: InvoiceItem[];
}

/**
 * Order InvoiceItemRepeater core component that provides invoice items repeater.
 *
 * @component
 */
export function InvoiceItemRepeater(
  props: InvoiceItemRepeaterProps,
): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const invoiceItems = orderService.order.get().invoice?.items!;

  return props.children({ invoiceItems });
}

export interface SubtotalProps {
  /** Render prop function */
  children: (props: SubtotalRenderProps) => React.ReactNode;
}

export interface SubtotalRenderProps {
  /** Subtotal value */
  value: string;
  /** Currency */
  currency: string;
}

/**
 * Order Subtotal core component that provides order subtotal.
 *
 * @component
 */
export function Subtotal(props: SubtotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const subtotal = orderService.order.get().invoice?.subTotal!;

  return props.children({
    value: subtotal.value!,
    currency: subtotal.currency!,
  });
}

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
}

export interface TaxRenderProps {
  /** Tax rate */
  taxRate: string;
  /** Tax value */
  taxValue: string;
  /** Currency */
  currency: string;
}

/**
 * Order Tax core component that provides order tax.
 *
 * @component
 */
export function Tax(props: TaxProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const tax = orderService.order.get().invoice?.tax;

  if (!tax) {
    return null;
  }

  return props.children({
    taxRate: tax.rate!,
    taxValue: tax.amount!.value!,
    currency: tax.amount!.currency!,
  });
}

export interface ServiceFeeProps {
  /** Render prop function */
  children: (props: ServiceFeeRenderProps) => React.ReactNode;
}

export interface ServiceFeeRenderProps {
  /** Service fee value */
  value: string;
  /** Currency */
  currency: string;
  /** Service fee rate */
  rate: string;
}

/**
 * Order ServiceFee core component that provides order service fee.
 *
 * @component
 */
export function ServiceFee(props: ServiceFeeProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const serviceFee = orderService.order.get().invoice?.fees?.[0];

  return props.children({
    value: serviceFee!.amount!.value!,
    currency: serviceFee!.amount!.currency!,
    rate: serviceFee!.rate!,
  });
}

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
}

export interface TotalRenderProps {
  /** Total value */
  value: string;
  /** Currency */
  currency: string;
}

/**
 * Order Total core component that provides order total.
 *
 * @component
 */
export function Total(props: TotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const total = orderService.order.get().invoice?.grandTotal!;

  return props.children({ value: total.value!, currency: total.currency! });
}
