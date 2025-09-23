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
} from '../../services/index.js';
import { plansV3 } from '@wix/pricing-plans';
import {
  ChannelType,
  CheckoutService,
  CheckoutServiceDefinition,
} from '@wix/headless-ecom/services';
import {
  PlanCheckoutService,
  PlanCheckoutServiceDefinition,
} from '../../services/plan-checkout-service.js';

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
      servicesMap={createServicesMap()
        .addService(PlanServiceDefinition, PlanService, planServiceConfig)
        .addService(CheckoutServiceDefinition, CheckoutService, {
          channelType: ChannelType.WEB,
          // TODO: Perhaps we can add postFlowUrl?
          // postFlowUrl: ''
        })
        .addService(PlanCheckoutServiceDefinition, PlanCheckoutService)}
    >
      {children}
    </WixServices>
  );
}

export type PlanData =
  | { isLoading: true; error: null; plan: null }
  | { isLoading: false; error: null; plan: plansV3.Plan }
  | { isLoading: false; error: Error; plan: null };

interface PlanProps {
  children: (props: PlanData) => React.ReactNode;
}

export function Plan({ children }: PlanProps) {
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

export interface NameData {
  name: string;
}

interface NameProps {
  children: (props: NameData) => React.ReactNode;
}

export function Name({ children }: NameProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ name: plan.name! });
}

export interface DescriptionData {
  description: string;
}

interface DescriptionProps {
  children: (props: DescriptionData) => React.ReactNode;
}

export function Description({ children }: DescriptionProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ description: plan.description ?? '' });
}

export interface PriceData {
  price: { amount: number; currency: string; formattedPrice: string };
}

interface PriceProps {
  children: (props: PriceData) => React.ReactNode;
}

export function Price({ children }: PriceProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  return children({ price: plan.enhancedData.price });
}

type FeeData = PlanWithEnhancedData['enhancedData']['additionalFees'][number];

export interface AdditionalFeesData {
  additionalFees: FeeData[];
}

interface AdditionalFeesProps {
  children: (props: AdditionalFeesData) => React.ReactNode;
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
  additionalFees: FeeData[];
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
const FeeContext = createContext<FeeData | null>(null);

interface AdditionalFeeRootProps {
  fee: FeeData;
  children: React.ReactNode;
}

export function AdditionalFeeRoot({ fee, children }: AdditionalFeeRootProps) {
  return <FeeContext.Provider value={fee}>{children}</FeeContext.Provider>;
}

export interface AdditionalFeeNameData {
  name: string;
}

interface AdditionalFeeNameProps {
  children: (props: AdditionalFeeNameData) => React.ReactNode;
}

export function AdditionalFeeName({ children }: AdditionalFeeNameProps) {
  const fee = useContext(FeeContext);

  if (!fee) {
    return null;
  }

  return children({ name: fee.name });
}

export type AdditionalFeeAmountData = Pick<
  FeeData,
  'amount' | 'currency' | 'formattedFee'
>;

interface AdditionalFeeAmountProps {
  children: (props: AdditionalFeeAmountData) => React.ReactNode;
}

export function AdditionalFeeAmount({ children }: AdditionalFeeAmountProps) {
  const fee = useContext(FeeContext);

  if (!fee) {
    return null;
  }

  return children({
    amount: fee.amount,
    currency: fee.currency,
    formattedFee: fee.formattedFee,
  });
}

export interface RecurrenceData {
  recurrence: PlanRecurrence | null;
}

interface RecurrenceProps {
  children: (renderProps: RecurrenceData) => React.ReactNode;
}

export function Recurrence({ children }: RecurrenceProps) {
  const { planSignal } = useService(PlanServiceDefinition);

  const plan = planSignal.get();
  if (!plan) {
    return null;
  }

  return children({ recurrence: plan.enhancedData.recurrence });
}

export interface DurationData {
  duration: PlanDuration | null;
}

interface DurationProps {
  children: (renderProps: DurationData) => React.ReactNode;
}

export function Duration({ children }: DurationProps) {
  const { planSignal } = useService(PlanServiceDefinition);

  const plan = planSignal.get();
  if (!plan) {
    return null;
  }

  return children({ duration: plan.enhancedData.duration });
}

export interface PerksData {
  perks: string[];
}

export interface PerkItemData {
  perk: string;
}

export const PerkItemContext = createContext<PerkItemData | null>(null);

interface PerksProps {
  children: (props: PerksData) => React.ReactNode;
}

export function Perks({ children }: PerksProps) {
  const { planSignal } = useService(PlanServiceDefinition);

  const plan = planSignal.get();
  if (!plan || !plan.perks?.length) {
    return null;
  }

  return children({
    perks: plan.perks?.map((perk) => perk.description!) ?? [],
  });
}

interface PerksRepeaterProps {
  children: (perksData: PerksData) => React.ReactNode;
}

export function PerksRepeater({ children }: PerksRepeaterProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const plan = planSignal.get();
  if (!plan) {
    return null;
  }

  return children({
    perks: plan.perks?.map((perk) => perk.description!) ?? [],
  });
}

interface PerkItemProps {
  children: (props: PerkItemData) => React.ReactNode;
}

export function PerkItem({ children }: PerkItemProps) {
  const perkItem = useContext(PerkItemContext);

  if (!perkItem) {
    return null;
  }

  return children({ perk: perkItem.perk });
}

export interface ActionBuyNowRenderProps {
  isLoading: boolean;
  error: string | null;
  goToPlanCheckout: () => Promise<void>;
}

interface ActionBuyNowProps {
  children: (props: ActionBuyNowRenderProps) => React.ReactNode;
}

export function ActionBuyNow({ children }: ActionBuyNowProps) {
  const { planSignal } = useService(PlanServiceDefinition);
  const {
    isLoadingSignal,
    errorSignal,
    goToPlanCheckout: _goToPlanCheckout,
  } = useService(PlanCheckoutServiceDefinition);
  const plan = planSignal.get();

  if (!plan) {
    return null;
  }

  const isLoading = isLoadingSignal.get();
  const error = errorSignal.get();

  return children({
    isLoading,
    error,
    goToPlanCheckout: () => _goToPlanCheckout(plan),
  });
}
