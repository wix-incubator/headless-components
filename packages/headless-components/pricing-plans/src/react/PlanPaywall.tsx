import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { PlanPaywallServiceConfig } from '../services/index.js';
import {
  Root as CoreRoot,
  Paywall as CorePaywall,
  PaywallData,
} from './core/PlanPaywall.js';

enum PlanPaywallTestId {
  Paywall = 'plan-paywall-paywall',
}

interface RootProps {
  children: React.ReactNode;
  planPaywallServiceConfig: PlanPaywallServiceConfig;
}

/**
 * Root component that provides plan paywall context to child components
 *
 * @component
 * @example
 * ```tsx
 * <PlanPaywall.Root planPaywallServiceConfig={{ requiredPlanIds: ['planId'] }}>
 *   <PlanPaywall.Paywall>
 *     <div>Paywalled content</div>
 *   </PlanPaywall.Paywall>
 * </PlanPaywall.Root>
 *
 * ```
 */
export const Root = ({ children, planPaywallServiceConfig }: RootProps) => {
  return (
    <CoreRoot planPaywallServiceConfig={planPaywallServiceConfig}>
      {children}
    </CoreRoot>
  );
};

export type PlanPaywallData = PaywallData;

interface PaywallProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPaywallData> | React.ReactNode;
  loadingState?: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Container for controlling access to the paywalled content.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PlanPaywall.Paywall loadingState={<div>Loading...</div>} fallback={<div>You need to buy a plan to access this content</div>}>
 *   <div>Paywalled content</div>
 * </PlanPaywall.Paywall>
 *
 * // With asChild
 * <PlanPaywall.Paywall asChild>
 *   {React.forwardRef(({isLoading, error, hasAccess}, ref) => {
 *     if (isLoading) {
 *       return loadingState;
 *     }
 *
 *     if (error) {
 *       return <div>Error!</div>;
 *     }
 *
 *     if (hasAccess) {
 *       return <div>Paywalled content</div>;
 *     }
 *
 *     return <div>You need to buy a plan to access this content</div>;
 *   })}
 * </PlanPaywall.Paywall>
 * ```
 */
export const Paywall = ({
  asChild,
  children,
  loadingState,
  fallback = null,
}: PaywallProps) => (
  <CorePaywall>
    {(paywallData) => (
      <AsChildSlot
        asChild={asChild}
        customElement={children}
        customElementProps={paywallData}
        data-testid={PlanPaywallTestId.Paywall}
        data-is-loading={paywallData.isLoading}
        data-has-error={paywallData.error !== null}
        data-has-access={paywallData.hasAccess}
      >
        <div>
          {paywallData.isLoading
            ? loadingState
            : paywallData.hasAccess
              ? (children as React.ReactNode)
              : fallback}
        </div>
      </AsChildSlot>
    )}
  </CorePaywall>
);
