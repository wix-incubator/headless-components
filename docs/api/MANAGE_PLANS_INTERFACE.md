# Manage Plans Interface

Component that displays a list of purchased plans that the user can manage.

## Architecture

The ManagePlans component follows a compound component pattern where each part can be composed together to create flexible manage plans displays.

## Components

### ManagePlans.Root

The root container that provides manage plans context to all child components.

**Props**
```tsx
interface ManagePlansRootProps {
  managePlansServiceConfig: ManagePlansServiceConfig;
  children: React.ReactNode;
}
```

**Example**
```tsx
<ManagePlans.Root managePlansServiceConfig={managePlansServiceConfig}>
  {/* All manage plans components */}
</ManagePlans.Root>
```

### ManagePlans.Plans

Container for the plans list.

**Props**
```tsx
interface ManagePlansPlansProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<ManagePlans.Plans>
  {/* All manage plans components */}
</ManagePlans.Plans>
```

### ManagePlans.PlanRepeater

Repeats for each plan in the list.

**Props**
```tsx
interface ManagePlansPlanRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<ManagePlans.PlanRepeater>
  <ManagePlans.Plan />
    <ManagePlans.PlanName />
    <ManagePlans.StartDate />
    <ManagePlans.EndDate />
    <ManagePlans.PlanPrice />
    <ManagePlans.LastPaymentAmount >
    <ManagePlans.LastPaymentDate />
    <ManagePlans.NextPaymentDate />
    <ManagePlans.NextPaymentAmount />
    <ManagePlans.PlanDuration />
    <ManagePlans.PlanRecurrence />
    <ManagePlans.CancelButton />
    <ManagePlans.UpdatePaymentMethodButton />
  </ManagePlans.Plan>
</ManagePlans.PlanRepeater>
```
