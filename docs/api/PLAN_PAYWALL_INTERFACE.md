# Plan Paywall Interface

Component that restricts access to its content until if member does not have access to the required plans.

## Architecture

The PlanPaywall component follows a compound component pattern where each part can be composed together to create flexible plan paywall displays.

## Components

### PlanPaywall.Root

The root container that provides plan paywall context to all child components.

**Props**
```tsx
type PlanPaywallServiceConfig = { requiredPlanIds: string[] } | { memberOrders: orders.Order[] };

interface RootProps {
  children: React.ReactNode;
  planPaywallServiceConfig: PlanPaywallServiceConfig;
}
```

**Example**
```tsx
// Restrict by specific plan ids
<PlanPaywall.Root planPaywallServiceConfig={{ requiredPlanIds: ['planId'] }}>
  {/* All plan paywall components */}
</PlanPaywall.Root>

// Load member orders externally
const { memberOrders } = await loadPlanPaywallServiceConfig(['planId']);

<PlanPaywall.Root planPaywallServiceConfig={{ memberOrders: memberOrders }}>
  {/* All plan paywall components */}
</PlanPaywall.Root>
```

### PlanPaywall.Paywall

Container for the paywalled content.
If member has access to the required plans, the content (children) will be displayed. Otherwise, the fallback will be displayed.

**Props**
```tsx
interface PaywallProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPaywallData> | React.ReactNode;
  loadingState?: React.ReactNode;
  fallback?: React.ReactNode;
}
```

**Example**
```tsx
// Default usage
<PlanPaywall.Paywall loadingState={<div>Loading...</div>} fallback={<div>You need to buy a plan to access this content</div>}>
  <div>Paywalled content</div>
</PlanPaywall.Paywall>

// With asChild
<PlanPaywall.Paywall asChild>
  {React.forwardRef(({isLoading, error, hasAccess}, ref) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (hasAccess) {
      return <div>Paywalled content</div>;
    }

    return <div>You need to buy a plan to access this content</div>;
  })}
</PlanPaywall.Paywall>
```

**Data Attributes**
- `data-testid="plan-paywall-paywall"` - Applied to paywall element
- `data-is-loading="true|false"` - Indicates loading state
- `data-has-error="true|false"` - Indicates error state
- `data-has-access="true|false"` - Indicates if member has access to the required plans
---
