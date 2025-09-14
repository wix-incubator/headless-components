import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  PlanListService,
  PlanListServiceConfig,
  PlanListServiceDefinition,
  PlanWithEnhancedData,
} from '../../services/index.js';

interface RootProps {
  children: React.ReactNode;
  planListServiceConfig: PlanListServiceConfig;
}

export function Root({ children, planListServiceConfig }: RootProps) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        PlanListServiceDefinition,
        PlanListService,
        planListServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export type PlansData =
  | { isLoading: true; error: null; plans: null }
  | { isLoading: false; error: null; plans: PlanWithEnhancedData[] }
  | { isLoading: false; error: Error; plans: null };

interface PlansProps {
  children: (props: PlansData) => React.ReactNode;
}

export function Plans({ children }: PlansProps) {
  const { planListSignal, isLoadingSignal, errorSignal } = useService(
    PlanListServiceDefinition,
  );
  const isLoading = isLoadingSignal.get();
  const error = errorSignal.get();

  if (isLoading) {
    return children({ isLoading: true, error: null, plans: null });
  }

  if (error) {
    return children({ isLoading: false, error, plans: null });
  }

  const plans = planListSignal.get();
  return children({ isLoading: false, error: null, plans });
}

interface PlanRepeaterData {
  plans: PlanWithEnhancedData[];
}

interface PlanRepeaterProps {
  children: (props: PlanRepeaterData) => React.ReactNode;
}

export function PlanRepeater({ children }: PlanRepeaterProps) {
  const { planListSignal } = useService(PlanListServiceDefinition);
  const plans = planListSignal.get();

  return children({ plans });
}
