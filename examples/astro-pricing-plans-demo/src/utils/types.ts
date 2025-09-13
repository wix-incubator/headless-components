import { plansV3, orders } from '@wix/pricing-plans';
import { members } from '@wix/members';

export type Plan = plansV3.Plan;
export type PlanData = {
  id: string;
  name: string;
  description?: string;
  perks: string[];
  image?: string;
  price: number;
  recurrence: {
    cycleCount: number | null;
    cycleDuration: {
      count: number;
      period: Exclude<plansV3.PeriodWithLiterals, 'UNKNOWN_PERIOD'>;
    };
  } | null;
  freeTrialDays: plansV3.PricingVariant['freeTrialDays'];
  additionalFees: { name: string; amount: number }[];
  duration: {
    count: number;
    period: Exclude<plansV3.PeriodWithLiterals, 'UNKNOWN_PERIOD'>;
  } | null;
  currency: string;
};
export type Member = members.Member;
export type Order = orders.Order;
