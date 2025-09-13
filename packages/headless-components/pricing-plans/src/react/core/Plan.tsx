import React, { createContext, useContext } from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  PlanDuration,
  PlanRecurrence,
  PlanService,
  PlanServiceConfig,
  PlanServiceDefinition,
  PlanWithEnhancedData,
} from '../../services/PlanService.js';
import { plansV3 } from '@wix/pricing-plans';

interface RootProps {
  planServiceConfig: PlanServiceConfig;
  children: React.ReactNode;
}

/**
 * The root container that provides plan context to all child components.
 *
 * @order 1
 * @component
 *
 * @todo: Example
 */
export function Root({ planServiceConfig, children }: RootProps) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        PlanServiceDefinition,
        PlanService,
        planServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export type ContainerRenderProps =
  | { isLoading: true; error: null; plan: null }
  | { isLoading: false; error: null; plan: plansV3.Plan }
  | { isLoading: false; error: Error; plan: null };

interface ContainerProps {
  children: (props: ContainerRenderProps) => React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  const { isLoadingSignal, planSignal, errorSignal } = useService(
    PlanServiceDefinition,
  );

  const isLoading = isLoadingSignal.get();
  const error = errorSignal.get();

  if (isLoading) {
    return children({ isLoading: true, error: null, plan: null });
  }

  if (error) {
    return children({ isLoading: false, error, plan: null });
  }

  const plan = planSignal.get()!;
  return children({ isLoading: false, error: null, plan });
}

interface ImageRenderProps {
  image: string;
}

interface ImageProps {
  children: (props: ImageRenderProps) => React.ReactNode;
}

export function Image({ children }: ImageProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  // TODO: How to handle image not being available? Perhaps we need to forward null in case consumer needs to handle it?
  if (!plan || !plan.image) {
    return null;
  }

  return children({ image: plan.image });
}

interface NameRenderProps {
  name: string;
}

interface NameProps {
  children: (props: NameRenderProps) => React.ReactNode;
}

export function Name({ children }: NameProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ name: plan.name! });
}

interface DescriptionRenderProps {
  description: string;
}

interface DescriptionProps {
  children: (props: DescriptionRenderProps) => React.ReactNode;
}

export function Description({ children }: DescriptionProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ description: plan.description ?? '' });
}

interface PriceRenderProps {
  price: { amount: number; currency: string; formattedPrice: string };
}

interface PriceProps {
  children: (props: PriceRenderProps) => React.ReactNode;
}

export function Price({ children }: PriceProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ price: plan.enhancedData.price });
}

interface AdditionalFeesRenderProps {
  additionalFees: {
    name: string;
    amount: number;
    currency: string;
    formattedPrice: string;
  }[];
}

interface AdditionalFeesProps {
  children: (props: AdditionalFeesRenderProps) => React.ReactNode;
}

export function AdditionalFees({ children }: AdditionalFeesProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan || !plan.enhancedData.additionalFees.length) {
    return null;
  }

  return children({ additionalFees: plan.enhancedData.additionalFees });
}

interface AdditionalFeesRepeaterRenderProps {
  additionalFees: FeeValue[];
}

interface AdditionalFeesRepeaterProps {
  children: (props: AdditionalFeesRepeaterRenderProps) => React.ReactNode;
}

export function AdditionalFeesRepeater({
  children,
}: AdditionalFeesRepeaterProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ additionalFees: plan.enhancedData.additionalFees });
}

// Context for sharing current fee data between repeater and individual fee components
type FeeValue = PlanWithEnhancedData['enhancedData']['additionalFees'][number];

const FeeContext = createContext<FeeValue | null>(null);

interface AdditionalFeeRootProps {
  fee: FeeValue;
  children: React.ReactNode;
}

export function AdditionalFeeRoot({ fee, children }: AdditionalFeeRootProps) {
  return <FeeContext.Provider value={fee}>{children}</FeeContext.Provider>;
}

interface AdditionalFeeNameRenderProps {
  name: string;
}

interface AdditionalFeeNameProps {
  children: (props: AdditionalFeeNameRenderProps) => React.ReactNode;
}

export function AdditionalFeeName({ children }: AdditionalFeeNameProps) {
  const fee = useContext(FeeContext);

  if (!fee) {
    return null;
  }

  return children({ name: fee.name });
}

interface AdditionalFeeAmountRenderProps {
  amount: string;
}

interface AdditionalFeeAmountProps {
  children: (props: AdditionalFeeAmountRenderProps) => React.ReactNode;
}

export function AdditionalFeeAmount({ children }: AdditionalFeeAmountProps) {
  const fee = useContext(FeeContext);

  if (!fee) {
    return null;
  }

  return children({ amount: fee.formattedPrice });
}

interface RecurrenceRenderProps {
  recurrence: PlanRecurrence | null;
}

interface RecurrenceProps {
  children: (renderProps: RecurrenceRenderProps) => React.ReactNode;
}

export function Recurrence({ children }: RecurrenceProps) {
  const { planSignal } = useService(PlanServiceDefinition);

  const plan = planSignal.get();
  if (!plan) {
    return null;
  }

  return children({ recurrence: plan.enhancedData.recurrence });
}

interface DurationRenderProps {
  duration: PlanDuration | null;
}

interface DurationProps {
  children: (renderProps: DurationRenderProps) => React.ReactNode;
}

export function Duration({ children }: DurationProps) {
  const { planSignal } = useService(PlanServiceDefinition);

  const plan = planSignal.get();
  if (!plan) {
    return null;
  }

  return children({ duration: plan.enhancedData.duration });
}
