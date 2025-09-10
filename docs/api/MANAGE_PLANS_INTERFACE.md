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
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  errorState?: React.ReactNode;
}
```

**Example**
```tsx
<ManagePlans.Plans emptyState={<div>No purchased plans found</div>} loadingState={<div>Loading...</div>} errorState={<div>Error</div>}>
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
    <ManagePlans.PlanPrice />
    <ManagePlans.PlanDuration />
    <ManagePlans.PlanRecurrence />
    <ManagePlans.PlanStartDate />
    <ManagePlans.PlanEndDate />
    <ManagePlans.PlanLastPayment />
    <ManagePlans.PlanNextPayment />
    <ManagePlans.PlanCancelButton />
    <ManagePlans.PlanUpdatePaymentMethodButton />
  </ManagePlans.Plan>
</ManagePlans.PlanRepeater>
```

**Data Attributes**
- `data-testid="manage-plans-plan-repeater"` - Applied to repeater container
---

### ManagePlans.Plan

Container for a purchased plan details.

**Props**
```tsx
interface ManagePlansPlanProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<ManagePlans.Plan>
  {/* All manage plans components */}
</ManagePlans.Plan>
```

**Data Attributes**
- `data-testid="manage-plans-plan"` - Applied to plan container
---

### ManagePlans.PlanName

Displays the plan name.

**Props**
```tsx
interface ManagePlansPlanNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string; }>;
}
```

**Example**
```tsx
// Default usage
<ManagePlans.PlanName className="text-2xl font-bold" />

// asChild with primitive
<ManagePlans.PlanName asChild>
  <h1 className="text-2xl font-bold" />
</ManagePlans.PlanName>

// asChild with react component
<ManagePlans.PlanName asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h1 ref={ref} {...props} className="text-2xl font-bold">
      {name}
    </h1>
  ))}
</ManagePlans.PlanName>
```

**Data Attributes**
- `data-testid="manage-plans-plan-name"` - Applied to name element
---

### ManagePlans.PlanStartDate

Displays the plan start date.

**Props**
```tsx
interface ManagePlansStartDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{ startDate: string; }>;
}
```

**Example**
```tsx
// Default usage
<ManagePlans.PlanStartDate className="text-sm" />

// asChild with primitive
<ManagePlans.PlanStartDate asChild>
  <span className="text-sm" />
</ManagePlans.PlanStartDate>

// asChild with react component
<ManagePlans.PlanStartDate asChild>
  {React.forwardRef(({startDate, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {startDate}
    </span>
  ))}
</ManagePlans.PlanStartDate>
```

**Data Attributes**
- `data-testid="manage-plans-start-date"` - Applied to start date element
---

### ManagePlans.PlanEndDate

Displays the plan end date.

**Props**
```tsx
interface ManagePlansEndDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{ endDate: string; }>;
}
```

**Example**
```tsx
// Default usage
<ManagePlans.PlanEndDate className="text-sm" />

// asChild with primitive
<ManagePlans.PlanEndDate asChild>
  <span className="text-sm" />
</ManagePlans.PlanEndDate>

// asChild with react component
<ManagePlans.PlanEndDate asChild>
  {React.forwardRef(({endDate, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {endDate}
    </span>
  ))}
</ManagePlans.PlanEndDate>
```

**Data Attributes**
- `data-testid="manage-plans-end-date"` - Applied to end date element
---

### ManagePlans.PlanPrice

Displays the plan price.

**Props**
```tsx
interface ManagePlansPlanPriceProps {
  asChild?: boolean;
  children?: AsChildChildren<{ amount: string; currency: string; }>;
}
```

**Example**
```tsx
// Default usage
<ManagePlans.PlanPrice className="text-2xl font-bold" />

// asChild with primitive
<ManagePlans.PlanPrice asChild>
  <span className="text-2xl font-bold" />
</ManagePlans.PlanPrice>

// asChild with react component
<ManagePlans.PlanPrice asChild>
  {React.forwardRef(({amount, currency, ...props}, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold">
      {amount} {currency}
    </span>
  ))}
</ManagePlans.PlanPrice>
```

**Data Attributes**
- `data-testid="manage-plans-plan-price"` - Applied to price element
---

### ManagePlans.PlanLastPayment

Displays the last payment.

**Props**
```tsx
interface PaymentData {
  amount: string;
  currency: string;
  date: string;
}

interface ManagePlansLastPaymentProps {
  asChild?: boolean;
  children?: AsChildChildren<{ lastPayment: PaymentData; }>;
}
```

**Example**
```tsx
// Default usage
<ManagePlans.PlanLastPayment className="text-sm" />

// asChild with primitive
<ManagePlans.PlanLastPayment asChild>
  <span className="text-sm" />
</ManagePlans.PlanLastPayment>

// asChild with react component
<ManagePlans.PlanLastPayment asChild>
  {React.forwardRef(({lastPayment, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      Last payment: {lastPayment.amount} {lastPayment.currency} on {lastPayment.date}
    </span>
  ))}
</ManagePlans.PlanLastPayment>
```

**Data Attributes**
- `data-testid="manage-plans-last-payment"` - Applied to last payment element
---

### ManagePlans.PlanNextPayment

Displays the next payment.

**Props**
```tsx
interface ManagePlansNextPaymentProps {
  asChild?: boolean;
  children?: AsChildChildren<{ nextPayment: PaymentData; }>;
}
```

**Example**
```tsx

// Default usage
<ManagePlans.PlanNextPayment className="text-sm" />

// asChild with primitive
<ManagePlans.PlanNextPayment asChild>
  <span className="text-sm" />
</ManagePlans.PlanNextPayment>

// asChild with react component
<ManagePlans.PlanNextPayment asChild>
  {React.forwardRef(({nextPayment, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      Next payment: {nextPayment.amount} {nextPayment.currency} on {nextPayment.date}
    </span>
  ))}
</ManagePlans.PlanNextPayment>
```

**Data Attributes**
- `data-testid="manage-plans-next-payment"` - Applied to next payment element
---
