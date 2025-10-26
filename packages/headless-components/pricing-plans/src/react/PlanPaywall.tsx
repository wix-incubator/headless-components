import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { PlanPaywallServiceConfig } from '../services/index.js';
import {
  Root as CoreRoot,
  Paywall as CorePaywall,
  PaywallData,
} from './core/PlanPaywall.js';

enum PlanPaywallTestId {
  ErrorComponent = 'plan-paywall-error',
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
 * <PlanPaywall.Root planPaywallServiceConfig={{ accessPlanIds: ['planId'] }}>
 *   <PlanPaywall.Paywall>
 *     <PlanPaywall.RestrictedContent>
 *       <div>Paywalled content</div>
 *     </PlanPaywall.RestrictedContent>
 *     <PlanPaywall.Fallback>
 *       <div>You need to buy a plan to access this content</div>
 *     </PlanPaywall.Fallback>
 *     <PlanPaywall.ErrorComponent>
 *       <div>There was an error checking member access</div>
 *    </PlanPaywall.ErrorComponent>
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
}

/**
 * Container for controlling access to the paywalled content.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PlanPaywall.Paywall loadingState={<div>Loading...</div>}>
 *   <PlanPaywall.RestrictedContent>
 *     <div>Paywalled content</div>
 *   </PlanPaywall.RestrictedContent>
 * </PlanPaywall.Paywall>
 *
 * // With asChild
 * <PlanPaywall.Paywall asChild>
 *   {React.forwardRef(({isLoading, error, hasAccess, isLoggedIn}, ref) => {
 *     if (isLoading) {
 *       return loadingState;
 *     }
 *
 *     if (error) {
 *       return <div>Error!</div>;
 *     }
 *
 *     if (!isLoggedIn) {
 *       return <div>Please log in to access this content</div>;
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
export const Paywall = ({ asChild, children, loadingState }: PaywallProps) => (
  <CorePaywall>
    {(paywallData) => (
      <AsChildSlot
        asChild={asChild}
        customElement={children}
        customElementProps={paywallData}
      >
        {paywallData.isLoading ? loadingState : (children as React.ReactNode)}
      </AsChildSlot>
    )}
  </CorePaywall>
);

interface RestrictedContentProps {
  children: React.ReactNode;
}

/**
 * Component that displays the restricted content if the member has one of the access plans.
 *
 * @component
 * @example
 * ```tsx
 * <PlanPaywall.RestrictedContent>
 *   <div>Paywalled content</div>
 * </PlanPaywall.RestrictedContent>
 * ```
 */
export const RestrictedContent = ({ children }: RestrictedContentProps) => (
  <CorePaywall>
    {({ hasAccess, isLoading, error }) => {
      if (isLoading || !!error || !hasAccess) {
        return null;
      }

      return children;
    }}
  </CorePaywall>
);

export type PlanPaywallFallbackData = Pick<
  PlanPaywallData,
  'accessPlanIds' | 'isLoggedIn'
>;

interface FallbackProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPaywallFallbackData> | React.ReactNode;
}

/**
 * Component that displays the fallback content if the member does not have any of the access plans.
 *
 * @component
 * @example
 * ```tsx
 * <PlanPaywall.Fallback>
 *   <div>Fallback content</div>
 * </PlanPaywall.Fallback>
 *
 * // With asChild with react component
 * <PlanPaywall.Fallback asChild>
 *   {React.forwardRef(({accessPlanIds, isLoggedIn}, ref) => {
 *     if (!isLoggedIn) {
 *       return <div ref={ref}>Please log in to access this content</div>;
 *     }
 *
 *     return <div ref={ref}>You need to buy one of the following plans to access this content: {accessPlanIds.join(', ')}</div>;
 *   })}
 * </PlanPaywall.Fallback>
 * ```
 */
export const Fallback = React.forwardRef<HTMLElement, FallbackProps>(
  ({ asChild, children }, ref) => (
    <CorePaywall>
      {({ hasAccess, error, isLoading, isLoggedIn, accessPlanIds }) => {
        if (isLoading || !!error || hasAccess) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={
              { accessPlanIds, isLoggedIn } satisfies PlanPaywallFallbackData
            }
          >
            {children}
          </AsChildSlot>
        );
      }}
    </CorePaywall>
  ),
);

export type PlanPaywallErrorData = Pick<PlanPaywallData, 'error'>;

interface ErrorComponentProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPaywallErrorData> | React.ReactNode;
  className?: string;
}

/**
 * Component that displays the error content if there is an error checking member access
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PlanPaywall.ErrorComponent />
 *
 * // asChild
 * <PlanPaywall.ErrorComponent asChild>
 *   <div>There was an error checking member access</div>
 * </PlanPaywall.ErrorComponent>
 *
 * // asChild with react component
 * <PlanPaywall.ErrorComponent asChild>
 *   {React.forwardRef(({error, ...props}, ref) => (
 *     <div ref={ref} {...props} className="text-red-600">
 *       Error: {error}
 *     </div>
 *   ))}
 * </PlanPaywall.ErrorComponent>
 * ```
 */
export const ErrorComponent = React.forwardRef<
  HTMLElement,
  ErrorComponentProps
>(({ asChild, children, className }, ref) => (
  <CorePaywall>
    {({ error }) => {
      if (!error) {
        return null;
      }

      return (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{ error } satisfies PlanPaywallErrorData}
          data-testid={PlanPaywallTestId.ErrorComponent}
          className={className}
        >
          <span>{error}</span>
        </AsChildSlot>
      );
    }}
  </CorePaywall>
));
