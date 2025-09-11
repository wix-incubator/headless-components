import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { WixServices, useService } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  PricingOption,
  PricingOptionService,
  PricingOptionServiceConfig,
  PricingOptionServiceDefinition,
} from '../services/pricing-option-service.js';
import { TicketDefinitionServiceDefinition } from '../services/ticket-definition-service.js';
import { TicketDefinitionListServiceDefinition } from '../services/ticket-definition-list-service.js';

enum TestIds {
  pricingOptionName = 'pricing-option-name',
  pricingOptionPricing = 'pricing-option-pricing',
  pricingOptionQuantity = 'pricing-option-quantity',
}

export interface RootProps {
  pricingOption: PricingOption;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { pricingOption, children } = props;

  const pricingOptionServiceConfig: PricingOptionServiceConfig = {
    pricingOption,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        PricingOptionServiceDefinition,
        PricingOptionService,
        pricingOptionServiceConfig,
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

  const pricingOptionService = useService(PricingOptionServiceDefinition);
  const pricingOption = pricingOptionService.pricingOption.get();
  const name = pricingOption.name ?? '';

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
});

interface PricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ pricing: string }>;
  className?: string;
}

export const Pricing = React.forwardRef<HTMLElement, PricingProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const pricingOptionService = useService(PricingOptionServiceDefinition);
    const pricingOption = pricingOptionService.pricingOption.get();
    const { value, currency } = pricingOption.price!;
    const pricing = `${value} ${currency}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.pricingOptionPricing}
        customElement={children}
        customElementProps={{ pricing }}
        content={pricing}
      >
        <span>{pricing}</span>
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

    const ticketDefinitionListService = useService(
      TicketDefinitionListServiceDefinition,
    );
    const ticketDefinitionService = useService(
      TicketDefinitionServiceDefinition,
    );
    const pricingOptionService = useService(PricingOptionServiceDefinition);
    const pricingOption = pricingOptionService.pricingOption.get();

    const pricingOptionId = pricingOption.optionId ?? undefined;

    const ticketDefinition = ticketDefinitionService.ticketDefinition.get();
    const ticketDefinitionId = ticketDefinition._id ?? '';
    const currentQuantity =
      ticketDefinitionListService.getCurrentSelectedQuantity(
        ticketDefinitionId,
        pricingOptionId,
      );

    const maxQuantity =
      ticketDefinitionListService.getMaxQuantity(ticketDefinitionId);

    const increment = () =>
      ticketDefinitionListService.setQuantity({
        ticketDefinitionId,
        quantity: currentQuantity + 1,
        pricingOptionId: pricingOptionId,
      });

    const decrement = () =>
      ticketDefinitionListService.setQuantity({
        ticketDefinitionId,
        quantity: currentQuantity - 1,
        pricingOptionId: pricingOptionId,
      });

    const setQuantity = (quantity: number) =>
      ticketDefinitionListService.setQuantity({
        ticketDefinitionId,
        quantity,
        pricingOptionId: pricingOptionId,
      });

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.pricingOptionQuantity}
        customElement={children}
        value={currentQuantity}
        onChange={(e: any) => setQuantity(Number(e.target.value))}
        customElementProps={{
          value: currentQuantity,
          max: maxQuantity,
          increment,
          decrement,
          onChange: setQuantity,
        }}
        content={currentQuantity}
      >
        <select>
          {Array.from({ length: maxQuantity + 1 }).map((_, index) => (
            <option key={index} value={index}>
              {index}
            </option>
          ))}
        </select>
      </AsChildSlot>
    );
  },
);
