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
  const orderNumber = orderService.order.get().orderNumber!;

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
  const guestEmail = orderService.order.get().email!;

  return props.children({ guestEmail });
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
  const createdDate = formatDateMonthDayYear(orderService.order.get().created!);

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
  const isPolling = orderService.isPolling.get();
  const isReady = isOrderReady(orderService.order.get());

  const isUrlReady = isReady && !isPolling;

  useEffect(() => {
    orderService.pollOrder();
  }, []);

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
  const invoiceItems = orderService.order.get().invoice!.items!;

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
  const invoiceItems = orderService.order.get().invoice!.items!;

  return props.children({ invoiceItems });
}

export interface SubtotalProps {
  /** Render prop function */
  children: (props: SubtotalRenderProps) => React.ReactNode;
}

export interface SubtotalRenderProps {
  /** Formatted subtotal amount */
  formattedAmount: string;
}

/**
 * Order Subtotal core component that provides order subtotal.
 *
 * @component
 */
export function Subtotal(props: SubtotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const subtotal = orderService.order.get().invoice!.subTotal!;

  return props.children({
    formattedAmount: formatPrice(subtotal.value!, subtotal.currency!),
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
  rate: string;
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
  const discounts = orderService.order.get().invoice!.discount?.discounts;
  const paidPlanDiscount = discounts?.find((item) => item.paidPlan);

  if (!paidPlanDiscount) {
    return null;
  }

  return props.children({
    formattedAmount: formatPrice(
      `-${paidPlanDiscount.amount?.value!}`,
      paidPlanDiscount.amount?.currency!,
    ),
    rate: paidPlanDiscount.paidPlan?.percentDiscount?.rate!,
  });
}

export interface CouponDiscountProps {
  /** Render prop function */
  children: (props: CouponDiscountRenderProps) => React.ReactNode;
}

export interface CouponDiscountRenderProps {
  /** Formatted coupon discount amount */
  formattedAmount: string;
}

/**
 * Order CouponDiscount core component that provides coupon discount.
 *
 * @component
 */
export function CouponDiscount(props: CouponDiscountProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const discounts = orderService.order.get().invoice!.discount?.discounts;
  const couponDiscount = discounts?.find((item) => item.coupon);

  if (!couponDiscount) {
    return null;
  }

  return props.children({
    formattedAmount: formatPrice(
      `-${couponDiscount.amount?.value!}`,
      couponDiscount.amount?.currency!,
    ),
  });
}

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
}

export interface TaxRenderProps {
  /** Tax rate */
  rate: string;
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
  const tax = orderService.order.get().invoice!.tax;

  if (!tax?.amount?.value) {
    return null;
  }

  return props.children({
    rate: tax.rate!,
    formattedAmount: formatPrice(tax.amount!.value!, tax.amount!.currency!),
    name: tax.name!,
  });
}

export interface ServiceFeeProps {
  /** Render prop function */
  children: (props: ServiceFeeRenderProps) => React.ReactNode;
}

export interface ServiceFeeRenderProps {
  /** Service fee rate */
  rate: string;
  /** Formatted service fee amount */
  formattedAmount: string;
}

/**
 * Order ServiceFee core component that provides order service fee.
 *
 * @component
 */
export function ServiceFee(props: ServiceFeeProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const fees = orderService.order.get().invoice!.fees!;
  const addedFee = fees.find(
    ({ type }) => type === 'FEE_ADDED' || type === 'FEE_ADDED_AT_CHECKOUT',
  );

  if (!addedFee) {
    return null;
  }

  return props.children({
    formattedAmount: formatPrice(
      addedFee!.amount!.value!,
      addedFee!.amount!.currency!,
    ),
    rate: addedFee!.rate!,
  });
}

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
}

export interface TotalRenderProps {
  /** Formatted total amount */
  formattedAmount: string;
}

/**
 * Order Total core component that provides order total.
 *
 * @component
 */
export function Total(props: TotalProps): React.ReactNode {
  const orderService = useService(OrderServiceDefinition);
  const total = orderService.order.get().invoice!.grandTotal!;

  return props.children({
    formattedAmount: formatPrice(total.value!, total.currency!),
  });
}
