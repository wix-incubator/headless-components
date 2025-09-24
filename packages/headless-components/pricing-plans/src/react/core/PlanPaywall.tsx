import {
  PlanPaywallService,
  PlanPaywallServiceConfig,
  PlanPaywallServiceDefinition,
} from '../../services/index.js';
import { WixServices, useService } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

interface RootProps {
  children: React.ReactNode;
  planPaywallServiceConfig: PlanPaywallServiceConfig;
}

export function Root({ children, planPaywallServiceConfig }: RootProps) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        PlanPaywallServiceDefinition,
        PlanPaywallService,
        planPaywallServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface PaywallData {
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
  isLoggedIn: boolean;
  accessPlanIds: string[];
}

interface PaywallProps {
  children: (props: PaywallData) => React.ReactNode;
}

export function Paywall({ children }: PaywallProps) {
  const {
    isLoadingSignal,
    errorSignal,
    hasAccessSignal,
    isLoggedInSignal,
    accessPlanIds,
  } = useService(PlanPaywallServiceDefinition);
  const isLoading = isLoadingSignal.get();
  const error = errorSignal.get();
  const hasAccess = hasAccessSignal.get();
  const isLoggedIn = isLoggedInSignal.get();

  return children({ isLoading, error, hasAccess, isLoggedIn, accessPlanIds });
}
