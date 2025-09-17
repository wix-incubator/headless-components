import { defineService, implementService } from '@wix/services-definitions';
import {
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { plansV3 } from '@wix/pricing-plans';
import { enhancePlanData, PlanWithEnhancedData } from './plan-service.js';

export const PlanListServiceDefinition = defineService<{
  planListSignal: ReadOnlySignal<PlanWithEnhancedData[]>;
  isLoadingSignal: ReadOnlySignal<boolean>;
  errorSignal: ReadOnlySignal<Error | null>;
}>('planListService');

export type PlanListServiceConfig =
  | { planIds?: string[] }
  | { plans: PlanWithEnhancedData[] };

export const PlanListService =
  implementService.withConfig<PlanListServiceConfig>()(
    PlanListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<Error | null>(null);
      const configHasPlans = 'plans' in config;
      const planListSignal = signalsService.signal<PlanWithEnhancedData[]>(
        configHasPlans ? config.plans : [],
      );

      if (!configHasPlans) {
        loadPlanList(config.planIds);
      }

      async function loadPlanList(planIds?: string[]) {
        isLoadingSignal.set(true);
        errorSignal.set(null);
        try {
          const plans = await fetchAndEnhancePlans(planIds);
          planListSignal.set(plans);
        } catch (error) {
          console.error('Error loading plan list:', error);
          errorSignal.set(
            error instanceof Error ? error : new Error(error as any),
          );
        } finally {
          isLoadingSignal.set(false);
        }
      }

      return {
        planListSignal: planListSignal,
        isLoadingSignal: isLoadingSignal,
        errorSignal: errorSignal,
      };
    },
  );

async function fetchAndEnhancePlans(
  planIds?: string[],
): Promise<PlanWithEnhancedData[]> {
  try {
    let request = plansV3.queryPlans().eq('visibility', 'PUBLIC');

    if (planIds?.length) {
      request = request.in('_id', planIds);
    }

    const result = await request.find();
    return result.items.map((plan) => enhancePlanData(plan));
  } catch (error) {
    console.log('Error fetching and enhancing plans:', error);
    throw error;
  }
}

export async function loadPlanListServiceConfig(
  planIds: string[],
): Promise<PlanListServiceConfig> {
  const plans = await fetchAndEnhancePlans(planIds);
  return { plans };
}
