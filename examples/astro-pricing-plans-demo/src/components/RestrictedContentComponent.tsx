import { PricingPlans } from '@wix/headless-pricing-plans/react';

interface RestrictedContentComponentProps {
  planIds: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RestrictedContentComponent: React.FC<
  RestrictedContentComponentProps
> = ({ planIds, children, fallback }) => {
  return (
    <PricingPlans.PlanPaywall.Root
      planPaywallServiceConfig={{ requiredPlanIds: planIds }}
    >
      <PricingPlans.PlanPaywall.Paywall fallback={fallback}>
        {children}
      </PricingPlans.PlanPaywall.Paywall>
    </PricingPlans.PlanPaywall.Root>
  );
};
