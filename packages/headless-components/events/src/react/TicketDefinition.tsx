import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketService,
  TicketServiceDefinition,
  type TicketDefinition,
  type TicketServiceConfig,
} from '../services/ticket-service.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TicketListServiceDefinition } from '../services/ticket-list-service.js';

enum TestIds {
  ticketDefinitionName = 'ticket-definition-name',
  ticketDefinitionDescription = 'ticket-definition-description',
  ticketDefinitionPrice = 'ticket-definition-price',
  ticketDefinitionRemaining = 'ticket-definition-remaining',
  ticketDefinitionSoldOut = 'ticket-definition-sold-out',
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
        TicketServiceDefinition,
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

  const service = useService(TicketServiceDefinition);
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

    const service = useService(TicketServiceDefinition);
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

    const service = useService(TicketServiceDefinition);
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

    const service = useService(TicketServiceDefinition);
    const listService = useService(TicketListServiceDefinition);
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

    const service = useService(TicketServiceDefinition);
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

    const service = useService(TicketServiceDefinition);
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

    const listService = useService(TicketListServiceDefinition);
    const service = useService(TicketServiceDefinition);
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

    const listService = useService(TicketListServiceDefinition);
    const service = useService(TicketServiceDefinition);
    const ticketDefinitionId = service.ticketDefinition.get()._id ?? '';
    const currentQuantity =
      listService.getCurrentSelectedQuantity(ticketDefinitionId);
    const maxQuantity = listService.getMaxQuantity(ticketDefinitionId);

    const increment = () => listService.incrementQuantity(ticketDefinitionId);
    const decrement = () => listService.decrementQuantity(ticketDefinitionId);
    const setQuantity = (quantity: number) =>
      listService.setQuantity({ ticketDefinitionId, quantity });

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

interface PricingOptionsContextValue {
  hasOptions: boolean;
  options: any[]; // Replace with proper type from SDK if needed
}

const PricingOptionsContext =
  React.createContext<PricingOptionsContextValue | null>(null);

function usePricingOptionsContext(): PricingOptionsContextValue {
  const context = React.useContext(PricingOptionsContext);
  if (!context) {
    throw new Error(
      'usePricingOptionsContext must be used within PricingOptions',
    );
  }
  return context;
}

export interface PricingOptionsProps {
  children: React.ReactNode;
  className?: string;
}

export const PricingOptions = React.forwardRef<
  HTMLDivElement,
  PricingOptionsProps
>((props, ref) => {
  const { children, className } = props;

  const service = useService(TicketServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();

  const options =
    ticketDefinition.pricingMethod?.pricingOptions?.optionDetails || [];
  const hasOptions = options.length > 0;

  if (!hasOptions) return null;

  const contextValue = { hasOptions, options };

  return (
    <PricingOptionsContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={className}
        data-testid={TestIds.ticketDefinitionPricingOptions}
      >
        {children}
      </div>
    </PricingOptionsContext.Provider>
  );
});

export interface PricingOptionOptionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export const PricingOptionOptions = React.forwardRef<
  HTMLDivElement,
  PricingOptionOptionsProps
>((props, ref) => {
  const { children, emptyState, className } = props;

  const { hasOptions } = usePricingOptionsContext();

  if (!hasOptions) return emptyState || null;

  return (
    <div
      ref={ref}
      className={className}
      data-testid={TestIds.ticketDefinitionPricingOptionOptions}
    >
      {children}
    </div>
  );
});

export interface PricingOptionRepeaterProps {
  children: React.ReactNode;
}

export const PricingOptionRepeater = (props: PricingOptionRepeaterProps) => {
  const { children } = props;
  const { options } = usePricingOptionsContext();

  return (
    <>
      {options.map((option) => (
        <PricingOption.Root
          key={option.optionId}
          option={option}
          data-testid={TestIds.ticketDefinitionPricingOption}
        >
          {children}
        </PricingOption.Root>
      ))}
    </>
  );
};

interface PricingOptionContextValue {
  option: any; // Replace with OptionDetails type
}

const PricingOptionContext =
  React.createContext<PricingOptionContextValue | null>(null);

function usePricingOptionContext(): PricingOptionContextValue {
  const context = React.useContext(PricingOptionContext);
  if (!context) {
    throw new Error(
      'usePricingOptionContext must be used within PricingOption.Root',
    );
  }
  return context;
}

export interface PricingOptionRootProps {
  option: any;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const PricingOption = {
  Root: React.forwardRef<HTMLDivElement, PricingOptionRootProps>(
    (props, ref) => {
      const { option, children, ...attrs } = props;
      return (
        <PricingOptionContext.Provider value={{ option }}>
          <div ref={ref} {...attrs}>
            {children}
          </div>
        </PricingOptionContext.Provider>
      );
    },
  ),

  Name: React.forwardRef<
    HTMLElement,
    {
      asChild?: boolean;
      children?: AsChildChildren<{ name: string }>;
      className?: string;
    }
  >((props, ref) => {
    const { asChild, children, className } = props;

    const { option } = usePricingOptionContext();
    const name = option.name || '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.pricingOptionName}
        customElement={children}
        customElementProps={{ name }}
        content={name}
      >
        <span>{name}</span>
      </AsChildSlot>
    );
  }),

  Pricing: React.forwardRef<
    HTMLElement,
    {
      asChild?: boolean;
      children?: AsChildChildren<{ value: string; currency: string }>;
      className?: string;
    }
  >((props, ref) => {
    const { asChild, children, className } = props;

    const { option } = usePricingOptionContext();
    const price = option.price;

    if (price) {
      const { value, currency } = price;
      const formatted = `${value} ${currency}`;

      return (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.pricingOptionPricing}
          customElement={children}
          customElementProps={{ value, currency }}
          content={formatted}
        >
          <span>{formatted}</span>
        </AsChildSlot>
      );
    }

    return null;
  }),
};
