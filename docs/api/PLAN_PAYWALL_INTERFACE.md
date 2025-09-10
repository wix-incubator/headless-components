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
  fallback?: React.ReactNode;
}
```

**Example**
```tsx
// Fallback component will receive `plan` as a prop
<PlanPaywall.RestrictedContent fallback={
  <Plan.Root plan={plan}>
    <Plan.Button label="Buy to unlock content" />
  </Plan.Root>
}>
  {/* Paywalled content */}
</PlanPaywall.RestrictedContent>
```

**Data Attributes**
- `data-testid="plan-paywall-restricted-content"` - Applied to content container
---
