import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketService,
  TicketDefinitionServiceDefinition,
  type TicketDefinition,
  type TicketServiceConfig,
} from '../services/ticket-service.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TicketDefinitionListServiceDefinition } from '../services/ticket-list-service.js';
import { PricingOption } from './index.js';

enum TestIds {
  ticketDefinitionName = 'ticket-definition-name',
  ticketDefinitionDescription = 'ticket-definition-description',
  ticketDefinitionPrice = 'ticket-definition-price',
  ticketDefinitionRemaining = 'ticket-definition-remaining',
  ticketDefinitionSoldOut = 'ticket-definition-sold-out',
  ticketDefinitionSaleStarts = 'ticket-definition-sale-starts',
  ticketDefinitionSaleEnded = 'ticket-definition-sale-ended',
  ticketDefinitionQuantity = 'ticket-definition-quantity',
  ticketDefinitionFixedPricing = 'ticket-definition-fixed-pricing',
  ticketDefinitionGuestPricing = 'ticket-definition-guest-pricing',
  ticketDefinitionFreePricing = 'ticket-definition-free-pricing',
  ticketDefinitionPricingOptions = 'ticket-definition-pricing-options',
  ticketDefinitionPricingOptionOptions = 'ticket-definition-pricing-option-options',
  ticketDefinitionPricingOption = 'ticket-definition-pricing-option',
  pricingOptionRoot = 'pricing-option-root',
  pricingOptionName = 'pricing-option-name',
  pricingOptionPricing = 'pricing-option-pricing',
}

export interface RootProps {
  ticketDefinition: TicketDefinition;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { ticketDefinition, children } = props;

  const ticketServiceConfig: TicketServiceConfig = {
    ticketDefinition,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        TicketDefinitionServiceDefinition,
        TicketService,
        ticketServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
};

export interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}

export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className } = props;

  const service = useService(TicketDefinitionServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();
  const name = ticketDefinition.name ?? '';

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.ticketDefinitionName}
      customElement={children}
      customElementProps={{ name }}
      content={name}
    >
      <span>{name}</span>
    </AsChildSlot>
  );
});

export interface FixedPricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ value: string; currency: string }>;
  className?: string;
}

export const FixedPricing = React.forwardRef<HTMLElement, FixedPricingProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();

    if (ticketDefinition.pricingMethod?.fixedPrice) {
      const { value, currency } = ticketDefinition.pricingMethod.fixedPrice;
      const price = `${value} ${currency}`;

      return (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketDefinitionFixedPricing}
          customElement={children}
          customElementProps={{ value, currency }}
          content={price}
        >
          <span>{price}</span>
        </AsChildSlot>
      );
    }

    return null;
  },
);

export interface FreePricingProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FreePricing = React.forwardRef<HTMLElement, FreePricingProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();

    if (ticketDefinition.pricingMethod?.free) {
      return (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketDefinitionFreePricing}
          customElement={children}
        >
          <span>{children}</span>
        </AsChildSlot>
      );
    }

    return null;
  },
);

export interface GuestPricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ min: string; currency: string }>;
  className?: string;
}

export const GuestPricing = React.forwardRef<HTMLElement, GuestPricingProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketDefinitionServiceDefinition);
    const listService = useService(TicketDefinitionListServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();

    if (ticketDefinition.pricingMethod?.guestPrice) {
      const { value, currency } = ticketDefinition.pricingMethod.guestPrice;

      const onChange = (val: string) => {
        listService.setQuantity({
          ticketDefinitionId: ticketDefinition._id!,
          priceOverride: val,
        });
      };

      return (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketDefinitionGuestPricing}
          customElement={children}
          customElementProps={{ min: value, currency, onChange }}
          type="number"
          placeholder={`${value} ${currency}`}
          onChange={(e: any) => onChange(e.target.value)}
          min={value}
        >
          <input />
        </AsChildSlot>
      );
    }

    return null;
  },
);

export interface DescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  className?: string;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const description = ticketDefinition.description ?? '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionDescription}
        customElement={children}
        customElementProps={{ description }}
        content={description}
      >
        <span>{description}</span>
      </AsChildSlot>
    );
  },
);

export interface RemainingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ remaining: number }>;
  className?: string;
}

export const Remaining = React.forwardRef<HTMLElement, RemainingProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const limitPerCheckout = ticketDefinition.limitPerCheckout || 0;

    const remainingStr = limitPerCheckout.toString();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionRemaining}
        customElement={children}
        customElementProps={{ remaining: limitPerCheckout }}
        content={remainingStr}
      >
        <span>{remainingStr}</span>
      </AsChildSlot>
    );
  },
);

export interface SoldOutProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SoldOut = React.forwardRef<HTMLElement, SoldOutProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const listService = useService(TicketDefinitionListServiceDefinition);
    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const soldOut = listService.isSoldOut(ticketDefinition._id ?? '');

    if (!soldOut) {
      return null;
    }

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionSoldOut}
        customElement={children}
      >
        <span>{children}</span>
      </AsChildSlot>
    );
  },
);

export interface SaleStartsProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    startDate: Date | null;
    startDateFormatted: string;
  }>;
  className?: string;
}

export const SaleStarts = React.forwardRef<HTMLElement, SaleStartsProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const ticketDefinitionService = useService(
      TicketDefinitionServiceDefinition,
    );
    const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
    const saleScheduled = ticketDefinition.saleStatus === 'SALE_SCHEDULED';

    if (!saleScheduled) {
      return null;
    }

    const startDate = ticketDefinition.salePeriod?.startDate ?? null;
    const startDateFormatted = startDate ? startDate.toLocaleString() : '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionSaleStarts}
        customElement={children}
        customElementProps={{ startDate, startDateFormatted }}
        content={startDateFormatted}
      >
        <span>{startDateFormatted}</span>
      </AsChildSlot>
    );
  },
);

export interface SaleEndedProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    endDate: Date | null;
    endDateFormatted: string;
  }>;
  className?: string;
}

export const SaleEnded = React.forwardRef<HTMLElement, SaleEndedProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const saleEnded = ticketDefinition.saleStatus === 'SALE_ENDED';

    if (!saleEnded) {
      return null;
    }

    const endDate = ticketDefinition.salePeriod?.endDate ?? null;
    const endDateFormatted = endDate ? endDate.toLocaleString() : '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionSaleEnded}
        customElement={children}
        customElementProps={{ endDate, endDateStr: endDateFormatted }}
        content={endDateFormatted}
      >
        <span>{endDateFormatted}</span>
      </AsChildSlot>
    );
  },
);

export interface QuantityProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    quantity: number;
    maxQuantity: number;
    increment: () => void;
    decrement: () => void;
    setQuantity: (n: number) => void;
  }>;
  className?: string;
}

// TODO use common component
export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const listService = useService(TicketDefinitionListServiceDefinition);
    const service = useService(TicketDefinitionServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const ticketDefinitionId = ticketDefinition._id ?? '';
    const currentQuantity =
      listService.getCurrentSelectedQuantity(ticketDefinitionId);
    const maxQuantity = listService.getMaxQuantity(ticketDefinitionId);

    const increment = () =>
      listService.setQuantity({
        ticketDefinitionId,
        quantity: currentQuantity + 1,
      });
    const decrement = () =>
      listService.setQuantity({
        ticketDefinitionId,
        quantity: currentQuantity - 1,
      });

    const setQuantity = (quantity: number) =>
      listService.setQuantity({ ticketDefinitionId, quantity });

    if (
      ticketDefinition.pricingMethod?.pricingOptions ||
      ticketDefinition.saleStatus !== 'SALE_STARTED'
    ) {
      return null;
    }

    const defaultUI = (
      <div>
        <button onClick={decrement}>-</button>
        <span>{currentQuantity}</span>
        <button onClick={increment}>+</button>
      </div>
    );

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionQuantity}
        customElement={children}
        customElementProps={{
          quantity: currentQuantity,
          maxQuantity,
          increment,
          decrement,
          setQuantity,
        }}
        content={defaultUI}
      >
        {defaultUI}
      </AsChildSlot>
    );
  },
);

interface PricingOptionsPricingRepeaterProps {
  children: React.ReactNode;
}

export const PricingOptionsPricingRepeater = React.forwardRef<
  HTMLElement,
  PricingOptionsPricingRepeaterProps
>(({ children }, _ref) => {
  const service = useService(TicketDefinitionServiceDefinition);
  const listService = useService(TicketDefinitionListServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();

  if (ticketDefinition.pricingMethod?.pricingOptions?.optionDetails?.length) {
    const { optionDetails } = ticketDefinition.pricingMethod.pricingOptions;

    const onChange = (val: string) => {
      listService.setQuantity({
        ticketDefinitionId: ticketDefinition._id!,
        priceOverride: val,
      });
    };

    // TODO remove
    console.log(onChange);

    return (
      <>
        {optionDetails.map((pricingOption) => (
          <PricingOption.Root
            key={pricingOption.optionId}
            pricingOption={pricingOption}
            // onSelect={onChange}
            data-testid={TestIds.ticketDefinitionPricingOption}
          >
            {children}
          </PricingOption.Root>
        ))}
      </>
    );
  }

  return null;
});
