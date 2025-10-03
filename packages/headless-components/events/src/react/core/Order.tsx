import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  isOrderReady,
  OrderService,
  OrderServiceDefinition,
  type OrderServiceConfig,
} from '../../services/order-service.js';
import { type InvoiceItem } from '../../services/invoice-item-service.js';
import { formatDateMonthDayYear } from '../../utils/date.js';
import { formatPrice } from '../../utils/price.js';

export interface RootProps {
  /** Child components that will have access to the order service */
  children: React.ReactNode;
  /** Configuration for the order service */
  orderServiceConfig?: OrderServiceConfig;
}

/**
 * Order Root core component that provides order service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, orderServiceConfig } = props;

  if (!orderServiceConfig) {
    return children;
  }

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        OrderServiceDefinition,
        OrderService,
        orderServiceConfig,
      )}
    >
      {children}
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

  const order = orderService.order.get();
  const orderNumber = order.orderNumber!;

  return props.children({ orderNumber });
}

export interface GuestEmailProps {
  /** Render prop function */
  children: (props: GuestEmailRenderProps) => React.ReactNode;
}

export interface GuestEmailRenderProps {
  /** Guest email */
  guestEmail: string;
}

/**
 * Order GuestEmail core component that provides guest email.
 *
 * @component
 */
export function GuestEmail(props: GuestEmailProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const guestEmail = order.email!;

  return props.children({ guestEmail });
}

export interface CreatedDateProps {
  /** Render prop function */
  children: (props: CreatedDateRenderProps) => React.ReactNode;
}

export interface CreatedDateRenderProps {
  /** Created date */
  createdDate: Date;
  /** Formatted date */
  formattedDate: string;
}

/**
 * Order CreatedDate core component that provides created date.
 *
 * @component
 */
export function CreatedDate(props: CreatedDateProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const createdDate = order.created!;
  const formattedDate = formatDateMonthDayYear(createdDate);

  return props.children({ createdDate, formattedDate });
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

  const order = orderService.order.get();
  const ticketsPdfUrl = order.ticketsPdf!;
  const isPolling = orderService.isPolling.get();
  const isReady = isOrderReady(order);

  const isUrlReady = isReady && !isPolling;

  if (!isUrlReady) {
    return null;
  }

  return props.children({ ticketsPdfUrl });
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

  const order = orderService.order.get();
  const invoiceItems = order.invoice!.items!;

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
 * Order InvoiceItemRepeater core component that provides invoice items.
 *
 * @component
 */
export function InvoiceItemRepeater(
  props: InvoiceItemRepeaterProps,
): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const invoiceItems = order.invoice!.items!;

  return props.children({ invoiceItems });
}

export interface SubtotalProps {
  /** Render prop function */
  children: (props: SubtotalRenderProps) => React.ReactNode;
}

export interface SubtotalRenderProps {
  /** Formatted subtotal amount */
  formattedAmount: string;
  /** Subtotal amount */
  amount: number;
  /** Subtotal currency */
  currency: string;
}

/**
 * Order Subtotal core component that provides order subtotal.
 *
 * @component
 */
export function Subtotal(props: SubtotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const subtotal = order.invoice!.subTotal!;

  const currency = subtotal.currency!;
  const amount = Number(subtotal.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    amount,
    currency,
  });
}

export interface PaidPlanDiscountProps {
  /** Render prop function */
  children: (props: PaidPlanDiscountRenderProps) => React.ReactNode;
}

export interface PaidPlanDiscountRenderProps {
  /** Formatted paid plan discount amount */
  formattedAmount: string;
  /** Paid plan discount rate */
  rate: number;
  /** Paid plan discount amount */
  amount: number;
  /** Paid plan discount currency */
  currency: string;
}

/**
 * Order PaidPlanDiscount core component that provides paid plan discount.
 *
 * @component
 */
export function PaidPlanDiscount(
  props: PaidPlanDiscountProps,
): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const discounts = order.invoice!.discount?.discounts;
  const paidPlanDiscount = discounts?.find((item) => item.paidPlan);

  if (!paidPlanDiscount) {
    return null;
  }

  const currency = paidPlanDiscount.amount!.currency!;
  const amount = Number(paidPlanDiscount.amount!.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    rate: Number(paidPlanDiscount.paidPlan!.percentDiscount!.rate!),
    amount,
    currency,
  });
}

export interface CouponDiscountProps {
  /** Render prop function */
  children: (props: CouponDiscountRenderProps) => React.ReactNode;
}

export interface CouponDiscountRenderProps {
  /** Formatted coupon discount amount */
  formattedAmount: string;
  /** Coupon discount amount */
  amount: number;
  /** Coupon discount currency */
  currency: string;
}

/**
 * Order CouponDiscount core component that provides coupon discount.
 *
 * @component
 */
export function CouponDiscount(props: CouponDiscountProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const discounts = order.invoice!.discount?.discounts;
  const couponDiscount = discounts?.find((item) => item.coupon);

  if (!couponDiscount) {
    return null;
  }

  const currency = couponDiscount.amount!.currency!;
  const amount = Number(couponDiscount.amount!.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    amount,
    currency,
  });
}

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
}

export interface TaxRenderProps {
  /** Tax rate */
  rate: number;
  /** Tax amount */
  amount: number;
  /** Tax currency */
  currency: string;
  /** Formatted tax amount */
  formattedAmount: string;
  /** Tax name */
  name: string;
}

/**
 * Order Tax core component that provides order tax.
 *
 * @component
 */
export function Tax(props: TaxProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const tax = order.invoice!.tax;

  if (!tax) {
    return null;
  }

  const currency = tax.amount!.currency!;
  const amount = Number(tax.amount!.value!);

  return props.children({
    rate: Number(tax.rate!),
    amount,
    currency,
    formattedAmount: formatPrice(amount, currency),
    name: tax.name!,
  });
}

export interface FeeProps {
  /** Render prop function */
  children: (props: FeeRenderProps) => React.ReactNode;
}

export interface FeeRenderProps {
  /** Fee rate */
  rate: number;
  /** Fee amount */
  amount: number;
  /** Fee currency */
  currency: string;
  /** Formatted fee amount */
  formattedAmount: string;
}

/**
 * Order Fee core component that provides order fee.
 *
 * @component
 */
export function Fee(props: FeeProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const fees = order.invoice!.fees;
  const addedFee = fees?.find((fee) => fee.type === 'FEE_ADDED_AT_CHECKOUT');

  if (!addedFee) {
    return null;
  }

  const currency = addedFee.amount!.currency!;
  const amount = Number(addedFee.amount!.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    rate: Number(addedFee!.rate!),
    amount,
    currency,
  });
}

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
}

export interface TotalRenderProps {
  /** Formatted total amount */
  formattedAmount: string;
  /** Total amount */
  amount: number;
  /** Total currency */
  currency: string;
}

/**
 * Order Total core component that provides order total.
 *
 * @component
 */
export function Total(props: TotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();
  const total = order.invoice!.grandTotal!;

  const currency = total.currency!;
  const amount = Number(total.value!);

  return props.children({
    formattedAmount: formatPrice(amount, currency),
    amount,
    currency,
  });
}
