import { defineService, implementService } from '@wix/services-definitions';
import {
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { plansV3 } from '@wix/pricing-plans';

type ValidPeriod = Exclude<plansV3.PeriodWithLiterals, 'UNKNOWN_PERIOD'>;

export interface PlanRecurrence {
  count: number;
  period: ValidPeriod;
}

export interface PlanDuration {
  count: number;
  period: ValidPeriod;
}

export interface PlanWithEnhancedData extends plansV3.Plan {
  enhancedData: {
    price: {
      pricingVariantId: string;
      amount: number;
      currency: string;
      formattedPrice: string;
    };
    additionalFees: {
      name: string;
      amount: number;
      currency: string;
      formattedFee: string;
    }[];
    recurrence: PlanRecurrence | null;
    duration: PlanDuration | null;
  };
}

export const PlanServiceDefinition = defineService<{
  planSignal: ReadOnlySignal<PlanWithEnhancedData | null>;
  isLoadingSignal: ReadOnlySignal<boolean>;
  errorSignal: ReadOnlySignal<Error | null>;
}>('planService');

export type PlanServiceConfig =
  | { planId: string }
  | { plan: PlanWithEnhancedData };

export const PlanService = implementService.withConfig<PlanServiceConfig>()(
  PlanServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<Error | null>(null);
    const configHasPlan = 'plan' in config;
    const planSignal = signalsService.signal<PlanWithEnhancedData | null>(
      configHasPlan ? config.plan : null,
    );

    if (!configHasPlan) {
      loadPlan(config.planId);
    }

    async function loadPlan(planId: string): Promise<void> {
      isLoadingSignal.set(true);
      errorSignal.set(null);
      try {
        const plan = await fetchAndEnhancePlan(planId);
        planSignal.set(plan);
      } catch (error) {
        errorSignal.set(
          error instanceof Error ? error : new Error(error as any),
        );
      } finally {
        isLoadingSignal.set(false);
      }
    }

    return {
      planSignal: planSignal,
      isLoadingSignal: isLoadingSignal,
      errorSignal: errorSignal,
    };
  },
);

export function enhancePlanData(plan: plansV3.Plan): PlanWithEnhancedData {
  return {
    ...plan,
    enhancedData: {
      price: formatPlanPrice(plan),
      additionalFees: getFormattedAdditionalFeesData(plan),
      recurrence: getPlanRecurrence(plan),
      duration: getPlanDuration(plan),
    },
  };
}

function formatPlanPrice(
  plan: plansV3.Plan,
): PlanWithEnhancedData['enhancedData']['price'] {
  const pricingVariant = plan.pricingVariants?.[0];
  if (!pricingVariant) {
    throw new Error('No pricing variant found');
  }

  const priceAmount = Number(
    pricingVariant?.pricingStrategies?.[0]?.flatRate?.amount,
  );

  if (Number.isNaN(priceAmount)) {
    throw new Error('No price amount found');
  }

  // TODO: Remove this once we have a generic price formatting component
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: plan.currency,
  }).format(priceAmount);

  return {
    pricingVariantId: pricingVariant._id!,
    amount: priceAmount,
    currency: plan.currency!,
    formattedPrice,
  };
}

function getFormattedAdditionalFeesData(
  plan: plansV3.Plan,
): PlanWithEnhancedData['enhancedData']['additionalFees'] {
  const additionalFees = plan.pricingVariants?.[0]?.fees;
  if (!additionalFees) {
    return [];
  }

  return additionalFees
    .map((additionalFee) => {
      const amount = Number(additionalFee.fixedAmountOptions?.amount);
      if (Number.isNaN(amount)) {
        return null;
      }

      const formattedFee = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: plan.currency,
      }).format(amount);

      return {
        name: additionalFee.name ?? '',
        amount: amount,
        currency: plan.currency!,
        formattedFee,
      };
    })
    .filter((fee): fee is NonNullable<typeof fee> => !!fee);
}

function getPlanRecurrence(
  plan: plansV3.Plan,
): PlanWithEnhancedData['enhancedData']['recurrence'] {
  if (!isPlanRecurring(plan)) {
    return null;
  }

  const billingTerms = plan.pricingVariants?.[0]?.billingTerms;
  if (!billingTerms) {
    return null;
  }

  const count = Number(billingTerms.billingCycle?.count);
  const period = billingTerms.billingCycle?.period as ValidPeriod;

  return { count, period };
}

function isPlanRecurring(plan: plansV3.Plan): boolean {
  const billingTerms = plan.pricingVariants?.[0]?.billingTerms;

  if (billingTerms?.endType === 'UNTIL_CANCELLED') {
    return !!billingTerms?.billingCycle;
  }

  if (billingTerms?.endType === 'CYCLES_COMPLETED') {
    return billingTerms?.cyclesCompletedDetails?.billingCycleCount !== '1';
  }

  return false;
}

function getPlanDuration(
  plan: plansV3.Plan,
): PlanWithEnhancedData['enhancedData']['duration'] {
  const billingTerms = plan.pricingVariants?.[0]?.billingTerms;
  if (!billingTerms || billingTerms.endType === 'UNTIL_CANCELLED') {
    return null;
  }

  if (isPlanRecurring(plan)) {
    const recurrence = getPlanRecurrence(plan)!;
    const totalCycleCount = Number(
      billingTerms.cyclesCompletedDetails?.billingCycleCount,
    );

    return {
      count: recurrence.count * totalCycleCount,
      period: recurrence.period,
    };
  }

  return {
    count: Number(billingTerms.billingCycle?.count),
    period: billingTerms.billingCycle?.period as ValidPeriod,
  };
}

async function fetchAndEnhancePlan(
  planId: string,
): Promise<PlanWithEnhancedData> {
  try {
    const result = await plansV3
      .queryPlans()
      .eq('_id', planId)
      .eq('visibility', 'PUBLIC')
      .find();
    const [plan] = result.items;

    if (!plan) {
      // TODO: Is there an HttpError class where we could set status code?
      throw new Error(`Plan ${planId} not found`);
    }

    return enhancePlanData(plan);
  } catch (error) {
    console.log('Error fetching and enhancing plan data:', error);
    throw error;
  }
}

export async function loadPlanServiceConfig(
  planId: string,
): Promise<PlanServiceConfig> {
  const plan = await fetchAndEnhancePlan(planId);
  return { plan };
}
