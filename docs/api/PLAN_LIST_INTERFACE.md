# Plan List Interface

<!-- TODO: "Load more" button, pagination should be added -->

## Overview

A comprehensive plan list display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The PlanList component follows a compound component pattern where each part can be composed together to create flexible plan list displays.

## Components

<!-- IMPLEMENT SIMPLE APPROACH, THERE WILL BE A GENERIC COMPONENT FOR LISTS -->
### PlanList.Root

The root container that provides plan list context to all child components.

**Props**
```tsx
interface PlanListRootProps {
  planListServiceConfig?: PlanListServiceConfig;
  children: React.ReactNode;
}
```

**Example**
```tsx
<PlanList.Root planListServiceConfig={planListServiceConfig}>
  {/* All plan list components */}
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
  errorState?: React.ReactNode;
}
```

**Example**
```tsx
<PlanList.Plans emptyState={<div>No plans found</div>} loadingState={<div>Loading...</div>} errorState={<div>Error</div>} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

**Data Attributes**
- `data-testid="plan-list-plan-repeater"` - Applied to repeater container
---
