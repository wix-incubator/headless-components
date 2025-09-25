import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  OrderService,
  OrderServiceConfig,
  OrderServiceDefinition,
} from '../../services/order-service.js';
import { formatLongDate } from '../../utils/date.js';
import { Ticket } from '../../services/ticket-service.js';

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
}

/**
 * Order CreatedDate core component that provides created date.
 *
 * @component
 */
export function CreatedDate(props: CreatedDateProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const createdDate = formatLongDate(orderService.order.get().created!);

  return props.children({ createdDate });
}

export interface DownloadTicketsButtonProps {
  /** Render prop function */
  children: (props: DownloadTicketsButtonRenderProps) => React.ReactNode;
}

export interface DownloadTicketsButtonRenderProps {
  /** Tickets PDF URL */
  ticketsPdfUrl: string;
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

  return props.children({ ticketsPdfUrl });
}

export interface TicketsProps {
  /** Render prop function */
  children: (props: TicketsRenderProps) => React.ReactNode;
}

export interface TicketsRenderProps {
  /** Tickets */
  tickets: Ticket[];
}

/**
 * Order Tickets core component that provides tickets.
 *
 * @component
 */
export function Tickets(props: TicketsProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const tickets = orderService.order.get().invoice?.items!;

  return props.children({ tickets });
}

export interface TicketRepeaterProps {
  /** Render prop function */
  children: (props: TicketRepeaterRenderProps) => React.ReactNode;
}

export interface TicketRepeaterRenderProps {
  /** Tickets */
  tickets: Ticket[];
}

/**
 * Order TicketRepeater core component that provides tickets repeater.
 *
 * @component
 */
export function TicketRepeater(props: TicketRepeaterProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const tickets = orderService.order.get().invoice?.items!;

  return props.children({ tickets });
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

export function Total(props: TotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const total = orderService.order.get().invoice?.grandTotal!;

  return props.children({ value: total.value!, currency: total.currency! });
}
