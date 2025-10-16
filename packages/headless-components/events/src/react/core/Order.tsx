import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  isOrderReady,
  OrderService,
  OrderServiceDefinition,
  type OrderServiceConfig,
} from '../../services/order-service.js';
import { type InvoiceItem } from '../../services/invoice-item-service.js';
import { formatMonthDayYear } from '../../utils/date.js';
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

  if (!order) {
    return null;
  }

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

  if (!order) {
    return null;
  }

  const guestEmail = order.email!;

  return props.children({ guestEmail });
}

export interface CreatedDateProps {
  /** Render prop function */
  children: (props: CreatedDateRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
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

  if (!order) {
    return null;
  }

  const createdDate = new Date(order.created!);
  const formattedDate = formatMonthDayYear(createdDate, props.locale);

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

  if (!order) {
    return null;
  }

  const ticketsPdfUrl = order.ticketsPdf!;
  const isPolling = orderService.isPolling.get();
  const isReady = isOrderReady(order);

  if (!isReady || isPolling) {
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

  if (!order) {
    return null;
  }

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

  if (!order) {
    return null;
  }

  const invoiceItems = order.invoice!.items!;

  return props.children({ invoiceItems });
}

export interface SubtotalProps {
  /** Render prop function */
  children: (props: SubtotalRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface SubtotalRenderProps {
  /** Subtotal value */
  value: number;
  /** Subtotal currency */
  currency: string;
  /** Formatted subtotal value */
  formattedValue: string;
}

/**
 * Order Subtotal core component that provides order subtotal.
 *
 * @component
 */
export function Subtotal(props: SubtotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();

  if (!order) {
    return null;
  }

  const subtotal = order.invoice!.subTotal!;
  const value = Number(subtotal.value!);
  const currency = subtotal.currency!;

  return props.children({
    value,
    currency,
    formattedValue: formatPrice(value, currency, props.locale),
  });
}

export interface PaidPlanDiscountProps {
  /** Render prop function */
  children: (props: PaidPlanDiscountRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface PaidPlanDiscountRenderProps {
  /** Paid plan discount value */
  value: number;
  /** Paid plan discount currency */
  currency: string;
  /** Formatted paid plan discount value */
  formattedValue: string;
  /** Paid plan discount rate */
  rate: number;
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

  if (!order) {
    return null;
  }

  const discounts = order.invoice!.discount?.discounts;
  const paidPlanDiscount = discounts?.find((item) => item.paidPlan);

  if (!paidPlanDiscount) {
    return null;
  }

  const value = Number(paidPlanDiscount.amount!.value!);
  const currency = paidPlanDiscount.amount!.currency!;

  return props.children({
    value,
    currency,
    formattedValue: formatPrice(value, currency, props.locale),
    rate: Number(paidPlanDiscount.paidPlan!.percentDiscount!.rate!),
  });
}

export interface CouponDiscountProps {
  /** Render prop function */
  children: (props: CouponDiscountRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface CouponDiscountRenderProps {
  /** Coupon discount value */
  value: number;
  /** Coupon discount currency */
  currency: string;
  /** Formatted coupon discount value */
  formattedValue: string;
}

/**
 * Order CouponDiscount core component that provides coupon discount.
 *
 * @component
 */
export function CouponDiscount(props: CouponDiscountProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();

  if (!order) {
    return null;
  }

  const discounts = order.invoice!.discount?.discounts;
  const couponDiscount = discounts?.find((item) => item.coupon);

  if (!couponDiscount) {
    return null;
  }

  const value = Number(couponDiscount.amount!.value!);
  const currency = couponDiscount.amount!.currency!;

  return props.children({
    value,
    currency,
    formattedValue: formatPrice(value, currency, props.locale),
  });
}

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface TaxRenderProps {
  /** Tax value */
  value: number;
  /** Tax currency */
  currency: string;
  /** Formatted tax value */
  formattedValue: string;
  /** Tax rate */
  rate: number;
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

  if (!order) {
    return null;
  }

  const tax = order.invoice!.tax;

  if (!tax) {
    return null;
  }

  const value = Number(tax.amount!.value!);
  const currency = tax.amount!.currency!;

  return props.children({
    value,
    currency,
    formattedValue: formatPrice(value, currency, props.locale),
    rate: Number(tax.rate!),
    name: tax.name!,
  });
}

export interface FeeProps {
  /** Render prop function */
  children: (props: FeeRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface FeeRenderProps {
  /** Fee value */
  value: number;
  /** Fee currency */
  currency: string;
  /** Formatted fee value */
  formattedValue: string;
  /** Fee rate */
  rate: number;
}

/**
 * Order Fee core component that provides order fee.
 *
 * @component
 */
export function Fee(props: FeeProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();

  if (!order) {
    return null;
  }

  const fees = order.invoice!.fees;
  const addedFee = fees?.find((fee) => fee.type === 'FEE_ADDED_AT_CHECKOUT');

  if (!addedFee) {
    return null;
  }

  const value = Number(addedFee.amount!.value!);
  const currency = addedFee.amount!.currency!;

  return props.children({
    value,
    currency,
    formattedValue: formatPrice(value, currency, props.locale),
    rate: Number(addedFee!.rate!),
  });
}

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
  /** Locale */
  locale: Intl.LocalesArgument;
}

export interface TotalRenderProps {
  /** Total value */
  value: number;
  /** Total currency */
  currency: string;
  /** Formatted total value */
  formattedValue: string;
}

/**
 * Order Total core component that provides order total.
 *
 * @component
 */
export function Total(props: TotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);

  const order = orderService.order.get();

  if (!order) {
    return null;
  }

  const total = order.invoice!.grandTotal!;
  const value = Number(total.value!);
  const currency = total.currency!;

  return props.children({
    value,
    currency,
    formattedValue: formatPrice(value, currency, props.locale),
  });
}
