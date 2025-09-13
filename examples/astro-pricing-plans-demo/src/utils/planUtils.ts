/**
 * Utility functions for plan data processing
 */
import { plansV3 } from '@wix/pricing-plans';
import type { PlanData } from './types';

export interface PlanDetails {
  badges: string[];
  details: string[];
}

export function resolvePlanData(plan: plansV3.Plan): PlanData {
  return {
    id: plan._id!,
    name: plan.name!,
    image: plan.image ?? undefined,
    description: plan.description ?? undefined,
    perks: plan.perks?.map((perk) => perk.description!) ?? [],
    currency: plan.currency!,
    recurrence: getRecurrence(plan),
    freeTrialDays: getFreeTrialDays(plan),
    additionalFees: getAdditionalFees(plan),
    duration: getPlanDuration(plan),
    price: getPlanPrice(plan),
  };
}

function getRecurrence(plan: plansV3.Plan): PlanData['recurrence'] {
  if (isOneTimePaymentPlan(plan)) {
    return null;
  }

  const pricingVariant = plan.pricingVariants?.[0];
  if (!pricingVariant) {
    throw Error('No pricing variant found');
  }

  const totalCycleCount =
    pricingVariant.billingTerms?.endType === 'CYCLES_COMPLETED'
      ? Number(
          pricingVariant.billingTerms!.cyclesCompletedDetails
            ?.billingCycleCount!
        )
      : null;

  if (Number.isNaN(totalCycleCount)) {
    throw Error('Invalid cycle count');
  }

  const singleCycleDurationCount = Number(
    pricingVariant.billingTerms!.billingCycle!.count!
  );

  if (Number.isNaN(singleCycleDurationCount)) {
    throw Error('Invalid single cycle duration count');
  }

  const singleCycleDurationPeriod =
    pricingVariant.billingTerms!.billingCycle!.period!;

  if (
    !singleCycleDurationPeriod ||
    singleCycleDurationPeriod === 'UNKNOWN_PERIOD'
  ) {
    throw Error('Invalid cycle duration period');
  }

  return {
    cycleCount: totalCycleCount,
    cycleDuration: {
      count: singleCycleDurationCount,
      period: singleCycleDurationPeriod,
    },
  };
}

function getFreeTrialDays(plan: plansV3.Plan): PlanData['freeTrialDays'] {
  const pricingVariant = plan.pricingVariants?.[0];
  if (!pricingVariant) {
    throw Error('No pricing variant found');
  }

  return pricingVariant.freeTrialDays ?? 0;
}

function getAdditionalFees(plan: plansV3.Plan): PlanData['additionalFees'] {
  const pricingVariant = plan.pricingVariants?.[0];
  if (!pricingVariant) {
    throw Error('No pricing variant found');
  }

  return (
    pricingVariant.fees?.map((fee) => ({
      name: fee.name!,
      amount: Number(fee.fixedAmountOptions?.amount!),
    })) ?? []
  );
}

function isRecurringPlan(plan: plansV3.Plan): boolean {
  const billingTerms = plan?.pricingVariants?.[0]?.billingTerms;
  if (!billingTerms) {
    throw Error('No billing terms found');
  }

  if (billingTerms?.endType === 'UNTIL_CANCELLED') {
    return !!billingTerms?.billingCycle;
  }

  if (billingTerms?.endType === 'CYCLES_COMPLETED') {
    return billingTerms?.cyclesCompletedDetails?.billingCycleCount !== '1';
  }

  return false;
}

function isOneTimePaymentPlan(plan: plansV3.Plan): boolean {
  const billingTerms = plan?.pricingVariants?.[0]?.billingTerms;
  if (!billingTerms) {
    throw Error('No billing terms found');
  }

  if (billingTerms?.endType === 'UNTIL_CANCELLED') {
    return !billingTerms?.billingCycle;
  }

  if (billingTerms?.endType === 'CYCLES_COMPLETED') {
    return billingTerms?.cyclesCompletedDetails?.billingCycleCount === '1';
  }
  return false;
}

function getPlanDuration(plan: plansV3.Plan): PlanData['duration'] {
  const billingTerms = plan?.pricingVariants?.[0]?.billingTerms;
  if (!billingTerms) {
    throw Error('No billing terms found');
  }

  if (billingTerms?.endType === 'UNTIL_CANCELLED') {
    return null;
  }

  if (isOneTimePaymentPlan(plan)) {
    const count = Number(billingTerms.billingCycle?.count!);
    if (Number.isNaN(count)) {
      throw Error('Invalid count');
    }
    const period = billingTerms.billingCycle?.period!;
    if (!period || period === 'UNKNOWN_PERIOD') {
      throw Error('Invalid period');
    }

    return { count, period };
  }

  if (isRecurringPlan(plan)) {
    const recurrence = getRecurrence(plan);
    if (!recurrence) {
      throw Error('No recurrence found');
    }

    return {
      count: recurrence.cycleCount! * recurrence.cycleDuration.count,
      period: recurrence.cycleDuration.period,
    };
  }

  throw Error('No duration found');
}

function getPlanPrice(plan: plansV3.Plan): PlanData['price'] {
  const pricingVariant = plan.pricingVariants?.[0];
  if (!pricingVariant) {
    throw Error('No pricing variant found');
  }

  const price = Number(
    pricingVariant.pricingStrategies?.[0]?.flatRate?.amount!
  );
  if (Number.isNaN(price)) {
    throw Error('Invalid price');
  }

  return price;
}

/**
 * Extracts badges and details from a Wix plan object
 */
export const getPlanDetails = (plan: plansV3.Plan): PlanDetails => {
  const badges: string[] = [];
  const details: string[] = [];

  // Add badges
  if (plan.buyerCanCancel) {
    badges.push('Cancel Anytime');
  }

  // Use any cast to access pricing property since it's not in the type definition
  const planWithPricing = plan as any;
  if (planWithPricing.pricing?.recurrences?.length > 0) {
    badges.push('Subscription');
  } else if (planWithPricing.pricing?.singlePaymentForDuration) {
    badges.push('One-time Payment');
  }

  return { badges, details };
};

/**
 * Formats a date string into a user-friendly format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gets the appropriate CSS class for a status badge
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-gradient-to-r from-green-500 to-green-400 text-white';
    case 'paused':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white';
    case 'cancelled':
      return 'bg-gradient-to-r from-red-500 to-red-400 text-white';
    default:
      return 'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white';
  }
};

/**
 * Gets the appropriate CSS class for a course level badge
 */
export const getLevelBadgeClass = (level: string): string => {
  switch (level) {
    case 'Beginner':
      return 'bg-gradient-to-r from-green-500 to-green-400 text-white';
    case 'Intermediate':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white';
    case 'Advanced':
      return 'bg-gradient-to-r from-red-500 to-red-400 text-white';
    default:
      return 'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white';
  }
};
