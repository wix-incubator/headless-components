# Plan Paywall Interface

Component that restricts access to its content until the user buys a plan.

## Architecture

The PlanPaywall component follows a compound component pattern where each part can be composed together to create flexible plan paywall displays.

## Components

### PlanPaywall.Root

The root container that provides plan paywall context to all child components.

**Props**
```tsx
interface PlanPaywallServiceConfig {
  requiredPlanIds: string[];
}

interface PlanPaywallRootProps {
  planPaywallServiceConfig: PlanPaywallServiceConfig;
  children: React.ReactNode;
}
```

**Example**
```tsx
<PlanPaywall.Root planPaywallServiceConfig={planPaywallServiceConfig}>
  {/* All plan paywall components */}
</PlanPaywall.Root>
```

### PlanPaywall.RestrictedContent

Container for the paywalled content.

**Props**
```tsx
interface PlanPaywallRestrictedContentProps {
  children: React.ReactNode;
  // TODO: Make this its own headless component PlanPaywall.Action.BuyPlan
  // fallback?: React.ReactNode;
}
```

**Example**
```tsx
// Fallback component will receive `plan` as a prop
<PlanPaywall.RestrictedContent requiredPlanIds={['planId']} fallback={
  <Plan.Root planId={planId}>
    <Plan.Button label="Buy to unlock content" />
  </Plan.Root>
}>

  {/* Paywalled content */}

</PlanPaywall.RestrictedContent>


<PlanPaywall.RestrictedContent requiredPlanIds={['planid1', 'planid2']} fallback={
  // Somehow display the plans or redirect
}>

  {/* Paywalled content */}

</PlanPaywall.RestrictedContent>
```

<!-- TODO: Define data-attributes for states in all components -->
**Data Attributes**
- `data-testid="plan-paywall-restricted-content"` - Applied to content container
---
