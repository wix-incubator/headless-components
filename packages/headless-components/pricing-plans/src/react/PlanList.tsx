import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { PlanListServiceConfig } from '../services/index.js';
import {
  PlansData as CorePlansData,
  Root as CoreRoot,
  Plans as CorePlans,
  PlanRepeater as CorePlanRepeater,
} from './core/PlanList.js';
import { Root as PlanRoot } from './Plan.js';

enum PlanListTestId {
  Plans = 'plan-list-plans',
}

interface RootProps {
  children: React.ReactNode;
  planListServiceConfig: PlanListServiceConfig;
}

/**
 * The root container that provides plan list context to all child components.
 *
 * @component
 * @example
 * ```tsx
 * <PlanList.Root planListServiceConfig={planListServiceConfig}>
 *   <PlanList.Plans emptyState={<div>No plans found</div>} loadingState={<div>Loading...</div>}>
 *     <PlanList.PlanRepeater>
 *       <Plan.Name />
 *       <Plan.Price />
 *       <Plan.Action.BuyNow label="Select Plan" />
 *     </PlanList.PlanRepeater>
 *   </PlanList.Plans>
 * </PlanList.Root>
 * ```
 */
export function Root({ children, planListServiceConfig }: RootProps) {
  return (
    <CoreRoot planListServiceConfig={planListServiceConfig}>
      {children}
    </CoreRoot>
  );
}

export type PlansData = CorePlansData;

interface PlansProps {
  loadingState?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
  asChild?: boolean;
  children: AsChildChildren<PlansData>;
}

/**
 * Container for the plan list with support for empty and loading states.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PlanList.Plans emptyState={<div>No plans found</div>} loadingState={<div>Loading...</div>} className="grid grid-cols-1 md:grid-cols-3 gap-4">
 *   <PlanList.PlanRepeater>
 *     <Plan.Name />
 *     <Plan.Price />
 *     <Plan.Action.BuyNow label="Select Plan" />
 *   </PlanList.PlanRepeater>
 * </PlanList.Plans>
 *
 * // With asChild
 * <PlanList.Plans asChild>
 *   {React.forwardRef(({plans}, ref) => (
 *     <div ref={ref}>
 *       {plans.map((plan) => (
 *         <ul key={plan._id}>
 *           <li>{plan.name}</li>
 *           <li>{plan.price.formattedPrice}</li>
 *           <li>{plan.description}</li>
 *         </ul>
 *       ))}
 *     </div>
 *   ))}
 * </PlanList.Plans>
 * ```
 */
export const Plans = React.forwardRef<HTMLElement, PlansProps>(
  ({ children, asChild, loadingState, emptyState, className }, ref) => (
    <CorePlans>
      {(plansData) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={PlanListTestId.Plans}
          data-is-loading={plansData.isLoading}
          data-has-error={plansData.error !== null}
          customElement={children}
          customElementProps={plansData}
        >
          <div>
            {plansData.isLoading
              ? loadingState
              : plansData.plans?.length === 0
                ? emptyState
                : (children as React.ReactNode)}
          </div>
        </AsChildSlot>
      )}
    </CorePlans>
  ),
);

interface PlanRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Plan.Root for each plan
 *
 * @component
 * @example
 * ```tsx
 * <PlanList.PlanRepeater>
 *   <Plan.Name />
 *   <Plan.Price />
 *   <Plan.Action.BuyNow label="Select Plan" />
 * </PlanList.PlanRepeater>
 * ```
 */
export const PlanRepeater = ({ children }: PlanRepeaterProps) => (
  <CorePlanRepeater>
    {(planRepeaterData) =>
      planRepeaterData.plans.map((plan) => (
        <PlanRoot key={plan._id} planServiceConfig={{ plan }}>
          {children}
        </PlanRoot>
      ))
    }
  </CorePlanRepeater>
);
