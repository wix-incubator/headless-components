import {
  defineService,
  implementService,
  ServiceAPI,
} from '@wix/services-definitions';
import {
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { orders } from '@wix/pricing-plans';
import { type IOAuthStrategy } from '@wix/sdk';
import { auth } from '@wix/essentials';

export const PlanPaywallServiceDefinition = defineService<{
  isLoadingSignal: ReadOnlySignal<boolean>;
  errorSignal: ReadOnlySignal<string | null>;
  hasAccessSignal: ReadOnlySignal<boolean>;
  isLoggedInSignal: ReadOnlySignal<boolean>;
  accessPlanIds: string[];
}>('planPaywallService');

export interface PlanPaywallServiceConfig {
  accessPlanIds: string[];
  memberOrders?: orders.Order[];
}

export type PlanPaywallServiceAPI = ServiceAPI<
  typeof PlanPaywallServiceDefinition
>;

export const PlanPaywallService =
  implementService.withConfig<PlanPaywallServiceConfig>()(
    PlanPaywallServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);
      const isLoggedInSignal =
        signalsService.signal<boolean>(isMemberLoggedIn());
      const memberOrdersSignal = signalsService.signal<orders.Order[] | null>(
        config.memberOrders ?? null,
      );
      const hasAccessSignal = signalsService.computed(() => {
        const memberOrders = memberOrdersSignal.get();
        if (memberOrders) {
          // Additional filtering in case provided orders are not only active
          const activePlanOrders = memberOrders.filter(
            (order) =>
              order.status === 'ACTIVE' &&
              config.accessPlanIds.includes(order.planId!),
          );
          return activePlanOrders.length > 0;
        }
        return !!memberOrdersSignal.get()?.length;
      });

      if (!config.memberOrders) {
        loadMemberOrders(config.accessPlanIds);
      }

      async function loadMemberOrders(accessPlanIds: string[]) {
        try {
          isLoadingSignal.set(true);
          errorSignal.set(null);
          const isLoggedIn = isMemberLoggedIn();
          isLoggedInSignal.set(isLoggedIn);
          if (!isLoggedIn) {
            memberOrdersSignal.set(null);
            return;
          }

          const memberOrders = await fetchMemberOrders(accessPlanIds);
          memberOrdersSignal.set(memberOrders);
        } catch (error) {
          errorSignal.set(
            error instanceof Error
              ? error.message
              : 'Failed to check member access',
          );
        } finally {
          isLoadingSignal.set(false);
        }
      }

      return {
        isLoadingSignal,
        errorSignal,
        hasAccessSignal,
        isLoggedInSignal,
        accessPlanIds: config.accessPlanIds,
      };
    },
  );

async function fetchMemberOrders(
  planIds: string[],
): Promise<orders.Order[] | null> {
  try {
    const memberOrders = await orders.memberListOrders({
      planIds,
      orderStatuses: ['ACTIVE'],
    });

    return memberOrders?.orders ?? null;
  } catch (error) {
    console.error('Error fetching member orders:', error);
    throw error;
  }
}

function isMemberLoggedIn(): boolean {
  return auth.getContextualAuth<IOAuthStrategy>().loggedIn();
}

export async function loadPlanPaywallServiceConfig(
  accessPlanIds: string[],
): Promise<PlanPaywallServiceConfig> {
  if (!isMemberLoggedIn()) {
    return { memberOrders: [], accessPlanIds };
  }

  const memberOrders = await fetchMemberOrders(accessPlanIds);
  return { memberOrders: memberOrders ?? [], accessPlanIds };
}
