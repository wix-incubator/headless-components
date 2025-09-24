# Plan Paywall Interface

Component that restricts access to its content unless the member has one of the access plans.

## Architecture

The PlanPaywall component follows a compound component pattern where each part can be composed together to create flexible plan paywall displays.

## Components

### PlanPaywall.Root

The root container that provides plan paywall context to all child components.

**Props**
```tsx
interface PlanPaywallServiceConfig {
  accessPlanIds: string[];
  memberOrders?: orders.Order[];
}

interface RootProps {
  children: React.ReactNode;
  planPaywallServiceConfig: PlanPaywallServiceConfig;
}
```

**Example**
```tsx
// Restrict by specific plan ids
<PlanPaywall.Root planPaywallServiceConfig={{ accessPlanIds: ['planId'] }}>
  <PlanPaywall.Paywall>
    <PlanPaywall.RestrictedContent>
      <div>Paywalled content</div>
    </PlanPaywall.RestrictedContent>
    <PlanPaywall.Fallback>
      <div>You need to buy a plan to access this content</div>
    </PlanPaywall.Fallback>
    <PlanPaywall.ErrorComponent>
      <div>There was an error checking member access</div>
    </PlanPaywall.ErrorComponent>
  </PlanPaywall.Paywall>
</PlanPaywall.Root>

// Load member orders externally
const { memberOrders } = await loadPlanPaywallServiceConfig(['planId']);

<PlanPaywall.Root planPaywallServiceConfig={{ memberOrders: memberOrders, accessPlanIds: ['planId'] }}>
  {/* Plan paywall components */}
</PlanPaywall.Root>
```

### PlanPaywall.Paywall

Container for controlling access to the paywalled content.

**Props**
```tsx
interface PaywallProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPaywallData> | React.ReactNode;
  loadingState?: React.ReactNode;
}

interface PlanPaywallData {
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
  isLoggedIn: boolean;
}
```

**Example**
```tsx
// Default usage
<PlanPaywall.Paywall loadingState={<div>Loading...</div>}>
  {/* Plan paywall components */}
</PlanPaywall.Paywall>

// With asChild
<PlanPaywall.Paywall asChild>
  {React.forwardRef(({isLoading, error, hasAccess, isLoggedIn}, ref) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (!isLoggedIn) {
      return <div>Please log in to access this content</div>;
    }

    if (hasAccess) {
      return <div>Paywalled content</div>;
    }

    return <div>You need to buy a plan to access this content</div>;
  })}
</PlanPaywall.Paywall>
```
---

### PlanPaywall.RestrictedContent

Component that displays the restricted content if the member has one of the access plans.

**Props**
```tsx
interface RestrictedContentProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<PlanPaywall.RestrictedContent>
  <div>Paywalled content</div>
</PlanPaywall.RestrictedContent>
```
---

### PlanPaywall.Fallback

Component that displays the fallback content if the member does not have any of the access plans.

**Props**
```tsx
interface FallbackProps {
  asChild?: boolean;
  children:
    | AsChildChildren<{ accessPlanIds: string[]; isLoggedIn: boolean }>
    | React.ReactNode;
}
```

**Example**
```tsx
// Default usage
<PlanPaywall.Fallback>
  <div>Fallback content</div>
</PlanPaywall.Fallback>

// With asChild with react component
<PlanPaywall.Fallback asChild>
  {React.forwardRef(({accessPlanIds, isLoggedIn}, ref) => {
    if (!isLoggedIn) {
      return <div ref={ref}>Please log in to access this content</div>;
    }

    return <div ref={ref}>You need to buy one of the following plans to access this content: {accessPlanIds.join(', ')}</div>;
  })}
</PlanPaywall.Fallback>
```
---

### PlanPaywall.ErrorComponent

Component that displays the error content if there is an error checking member access

**Props**
```tsx
interface ErrorComponentProps {
  asChild?: boolean;
  children: AsChildChildren<{ error: string }> | React.ReactNode;
}
```

**Example**
```tsx
// Default usage
<PlanPaywall.ErrorComponent />

// With asChild
<PlanPaywall.ErrorComponent asChild>
  <div>There was an error checking member access</div>
</PlanPaywall.ErrorComponent>

// With asChild with react component
<PlanPaywall.ErrorComponent asChild>
  {React.forwardRef(({error, ...props}, ref) => (
    <div ref={ref} {...props} className="text-red-600">
      Error: {error}
    </div>
  ))}
</PlanPaywall.ErrorComponent>
```

**Data Attributes**
- `data-testid="plan-paywall-error-component"` - Applied to error component
---
