# Plan List Interface

## Overview

A comprehensive plan list display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The PlanList component follows a compound component pattern where each part can be composed together to create flexible plan list displays.

## Components

### PlanList.Root

The root container that provides plan list context to all child components.

Accepts a `planListServiceConfig` prop with one of the following options:
- `planIds`: Array of plan IDs to load
- `plans`: Array of plans to add to context (if loaded externally)

Omitting these options will load all plans.


**Props**
```tsx
type PlanListServiceConfig = { planIds?: string[] } | { plans: PlanWithEnhancedData[] };

interface PlanListRootProps {
  planListServiceConfig: PlanListServiceConfig;
  children: React.ReactNode;
}
```

**Example**
```tsx
// Load specific plans
<PlanList.Root planListServiceConfig={{ planIds: ['planId1', 'planId2'] }}>
  <PlanList.Plans emptyState={<div>No plans found</div>} loadingState={<div>Loading...</div>}>
    <PlanList.PlanRepeater>
      <Plan.Name />
      <Plan.Price />
      <Plan.Action.BuyNow label="Select Plan" />
    </PlanList.PlanRepeater>
  </PlanList.Plans>
</PlanList.Root>

// Load all plans
<PlanList.Root planListServiceConfig={{}}>
  <PlanList.Plans>
    {/* Plan list components */}
  </PlanList.Plans>
</PlanList.Root>

// Load plans externally
const { plans } = await loadPlanListServiceConfig(['planId1', 'planId2']);

<PlanList.Root planListServiceConfig={{ plans: plans }}>
  <PlanList.Plans>
    {/* Plan list components */}
  </PlanList.Plans>
</PlanList.Root>
```

### PlanList.Plans

Container for the plan list with support for empty and loading states.

**Props**
```tsx
interface PlanListPlansProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  asChild?: boolean;
  children?: AsChildChildren<PlansData>;
}
```

**Example**
```tsx
<PlanList.Plans emptyState={<div>No plans found</div>} loadingState={<div>Loading...</div>} className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <PlanList.PlanRepeater>
    <Plan.Name />
    <Plan.Price />
    <Plan.Button />
  </PlanList.PlanRepeater>
</PlanList.Plans>
```

**Data Attributes**
- `data-testid="plan-list-plans"` - Applied to plans container
---

### PlanList.PlanRepeater

Repeats component that renders Plan.Root for each plan

```tsx
interface PlanListPlanRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<PlanList.PlanRepeater>
  <Plan.Name />
  <Plan.Price />
  <Plan.Button />
</PlanList.PlanRepeater>
```
---
