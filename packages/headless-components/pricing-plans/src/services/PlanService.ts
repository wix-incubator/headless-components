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
    price: { amount: number; currency: string; formattedPrice: string };
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

export type PlanServiceConfig = { planId: string } | { plan: plansV3.Plan };

export const PlanService = implementService.withConfig<PlanServiceConfig>()(
  PlanServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<Error | null>(null);
    const configHasPlan = 'plan' in config;
    const planSignal = signalsService.signal<PlanWithEnhancedData | null>(
      configHasPlan ? enhancePlan(config.plan) : null,
    );

    if (!configHasPlan) {
      loadPlan(config.planId);
    }

    async function loadPlan(planId: string): Promise<void> {
      isLoadingSignal.set(true);
      errorSignal.set(null);
      try {
        // TODO: Should use `getPlan` but that gets 403
        const result = await plansV3
          .queryPlans()
          .eq('_id', planId)
          .eq('visibility', 'PUBLIC')
          .find();
        const [plan] = result.items;

        if (!plan) {
          throw new Error(`Plan ${planId} not found`);
        }

        planSignal.set(enhancePlan(plan));
      } catch (error) {
        // TODO: Fix types
        errorSignal.set(error as Error);
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

function enhancePlan(plan: plansV3.Plan): PlanWithEnhancedData {
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
  const priceAmount = Number(
    plan.pricingVariants?.[0]?.pricingStrategies?.[0]?.flatRate?.amount,
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

// TODO: Implement
// export async function loadPlanServiceConfig(planId: string) {
//   const plan = await plansV3.getPlan(planId);
// }
