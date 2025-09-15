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
import { members } from '@wix/members';

export const PlanPaywallServiceDefinition = defineService<{
  isLoadingSignal: ReadOnlySignal<boolean>;
  errorSignal: ReadOnlySignal<string | null>;
  hasAccessSignal: ReadOnlySignal<boolean>;
}>('planPaywallService');

export interface PlanPaywallServiceConfig {
  requiredPlanIds: string[];
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
              config.requiredPlanIds.includes(order.planId!),
          );
          return activePlanOrders.length > 0;
        }
        return !!memberOrdersSignal.get()?.length;
      });

      if (!config.memberOrders) {
        loadMemberOrders(config.requiredPlanIds);
      }

      async function loadMemberOrders(requiredPlanIds: string[]) {
        try {
          isLoadingSignal.set(true);
          errorSignal.set(null);
          const isLoggedIn = await isMemberLoggedIn();
          if (!isLoggedIn) {
            memberOrdersSignal.set(null);
            return;
          }

          const memberOrders = await fetchMemberOrders(requiredPlanIds);
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

async function isMemberLoggedIn(): Promise<boolean> {
  try {
    const { member } = await members.getCurrentMember();
    return !!member;
  } catch (error) {
    console.error('Error checking if member is logged in:', error);
    return false;
  }
}

export async function loadPlanPaywallServiceConfig(
  requiredPlanIds: string[],
): Promise<PlanPaywallServiceConfig> {
  const memberOrders = await fetchMemberOrders(requiredPlanIds);
  return { memberOrders: memberOrders ?? [], requiredPlanIds };
}
