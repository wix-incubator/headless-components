# Plan Interface Documentation

A comprehensive plan display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Plan component follows a compound component pattern where each part can be composed together to create flexible plan displays.

## Components

### Plan.Root

The root container that provides plan context to child components and handles loading/error states plan loading.

**Props**
```tsx
type PlanServiceConfig = { plan: Plan } | { planId: string }

interface PlanRootProps {
  planServiceConfig: PlanServiceConfig;
  asChild?: boolean;
  children?: AsChildChildren<
    | { isLoading: true; error: null; plan: null }
    | { isLoading: false; error: null; plan: Plan }
    | { isLoading: false; error: Error; plan: null }
  > | React.ReactNode;
  className?: string;
  loadingState?: React.ReactNode;
  errorState?: React.ReactNode;
}
```

**Example**
```tsx
<Plan.Root
  planServiceConfig={planServiceConfig}
  loadingState={<div>Loading...</div>}
  errorState={<div>Error</div>}
>
  {/* All plan components */}
</Plan.Root>

// With asChild
<Plan.Root planServiceConfig={planServiceConfig} asChild>
  {({ isLoading, error, plan }) => (
    <div className="plan-container">
      {isLoading ? 'Loading...' : error ? 'Error!' : `Plan ${plan.name} loaded`}
    </div>
  )}
</Plan.Root>
```

**Data Attributes**
- `data-testid="plan-container"` - Applied to root container
- `data-is-loading` - Applied to container when loading
- `data-has-error` - Applied to container when error occurs
---

### Plan.Image

Displays the plan image using WixMediaImage

**Props**
```tsx
interface PlanImageProps extends Omit<React.ComponentProps<typeof WixMediaImage>, 'src' | 'media'> {
  // Inherits all WixMediaImage props except 'src' and 'media' which are provided by the plan data
}
```

**Example**
```tsx
// Default usage
<Plan.Image className="w-full h-full object-cover" />

// asChild with primitive
<Plan.Image asChild>
  <img className="w-full h-full object-cover" />
</Plan.Image>

// asChild with react component
<Plan.Image asChild>
  {React.forwardRef(({src, ...props}, ref) => (
    <img ref={ref} {...props} src={src} className="w-full h-full object-cover" />
  ))}
</Plan.Image>
```

**Data Attributes**
- `data-testid="plan-image"` - Applied to image element
---

### Plan.Name

Displays the plan name.

**Props**
```tsx
interface PlanNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string; }> | React.ReactNode;
  className?: string;
}
```

**Example**
```tsx
// Default usage
<Plan.Name className="text-2xl font-bold" />

// asChild with primitive
<Plan.Name asChild>
  <h1 className="text-2xl font-bold" />
</Plan.Name>

// asChild with react component
<Plan.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h1 ref={ref} {...props} className="text-2xl font-bold">
      {name}
    </h1>
  ))}
</Plan.Name>
```

**Data Attributes**
- `data-testid="plan-name"` - Applied to name element
---

### Plan.Description

Displays the plan description.

**Props**
```tsx
interface PlanDescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string; }> | React.ReactNode;
  className?: string;
}
```

**Example**
```tsx
// Default usage
<Plan.Description className="text-sm" />

// asChild with primitive
<Plan.Description asChild>
  <p className="text-sm" />
</Plan.Description>

// asChild with react component
<Plan.Description asChild>
  {React.forwardRef(({description, ...props}, ref) => (
    <p ref={ref} {...props} className="text-sm">
      {description}
    </p>
  ))}
</Plan.Description>
```

**Data Attributes**
- `data-testid="plan-description"` - Applied to description element
---

### Plan.Price

Displays formatted price and currency

**Props**
```tsx
interface PlanPriceProps {
  asChild?: boolean;
  // TODO: Adjust
  children?: AsChildChildren<{ price: { amount: number; currency: string; formattedPrice: string; } }> | React.ReactNode;
  className?: string;
}
```

**Example**
```tsx
// Default usage
<Plan.Price className="text-2xl font-bold" />

// asChild with primitive
<Plan.Price asChild>
  <span className="text-2xl font-bold" />
</Plan.Price>

// asChild with react component
<Plan.Price asChild>
  {React.forwardRef(({price, ...props}, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold">
      {price.formattedPrice}
    </span>
  ))}
</Plan.Price>
```

**Data Attributes**
- `data-testid="plan-price"` - Applied to price element
---

### Plan.AdditionalFees

Container for plan additional fees.

**Props**
```tsx
interface PlanAdditionalFeesProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    additionalFees: {
      name: string;
      amount: number;
      currency: string;
      formattedPrice: string;
    }[];
  }> | React.ReactNode;
  className?: string;
}
```

**Example**
```tsx
<Plan.AdditionalFees>
  <Plan.AdditionalFeesRepeater>
    <Plan.AdditionalFeeName />
    <Plan.AdditionalFeeAmount />
  </Plan.AdditionalFeesRepeater>
</Plan.AdditionalFees>

// asChild with react component
<Plan.AdditionalFees asChild>
  {React.forwardRef(({additionalFees, ...props}, ref) => (
    <div ref={ref} {...props} className="fees-container">
      {additionalFees.length > 0 && 'Additional fees apply'}
    </div>
  ))}
</Plan.AdditionalFees>
```

**Data Attributes**
- `data-testid="plan-additional-fees"` - Applied to additional fees element
---

### Plan.AdditionalFeesRepeater

Repeats for each additional fee in the list

**Props**
```tsx
interface PlanAdditionalFeesRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<Plan.AdditionalFeesRepeater>
  <Plan.AdditionalFeeName />
  <Plan.AdditionalFeeAmount />
</Plan.AdditionalFeesRepeater>
```

**Data Attributes**
- No data attributes (renders as React fragment)
---

### Plan.AdditionalFeeName

Displays the additional fee name.

**Props**
```tsx
interface PlanAdditionalFeeNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string; }> | React.ReactNode;
  className?: string;
}
```

**Example**
```tsx
// Default usage
<Plan.AdditionalFeeName className="text-sm" />

// asChild with primitive
<Plan.AdditionalFeeName asChild>
  <span className="text-sm" />
</Plan.AdditionalFeeName>

// asChild with react component
<Plan.AdditionalFeeName asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {name}
    </span>
  ))}
</Plan.AdditionalFeeName>
```

**Data Attributes**
- `data-testid="plan-additional-fee-name"` - Applied to name element
---

### Plan.AdditionalFeeAmount

Displays the additional fee amount.

**Props**
```tsx
interface PlanAdditionalFeeAmountProps {
  asChild?: boolean;
  children?: AsChildChildren<{ amount: string; }> | React.ReactNode;
  className?: string;
}
```

**Example**
```tsx
// Default usage
<Plan.AdditionalFeeAmount className="text-sm" />

// asChild with primitive
<Plan.AdditionalFeeAmount asChild>
  <span className="text-sm" />
</Plan.AdditionalFeeAmount>

// asChild with react component
<Plan.AdditionalFeeAmount asChild>
  {React.forwardRef(({amount, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {amount}
    </span>
  ))}
</Plan.AdditionalFeeAmount>
```

**Data Attributes**
- `data-testid="plan-additional-fee-amount"` - Applied to amount element
---


### Plan.Recurrence

Displays the plan recurrence. Not rendered for one-time plans.

**Props**
```tsx
interface PlanRecurrence {
  count: number;
  period: 'day' | 'week' | 'month' | 'year';
}
interface PlanRecurrenceProps {
  children: React.ForwardRefRenderFunction<HTMLElement, { recurrence: PlanRecurrence | null }>;
}
```

**Example**
```tsx
<Plan.Recurrence>
  {React.forwardRef(({ recurrence }, ref) => {
    if (!recurrence) return null;
    return (
      <span ref={ref} className="text-content-secondary" data-testid="plan-recurrence">
        Renews every {recurrence.count} {recurrence.period}(s)
      </span>
    );
  })}
</Plan.Recurrence>
```

**Data Attributes**
- `data-testid="plan-recurrence"` - Applied to recurrence element
---


### Plan.Duration

Displays the plan duration.

**Props**
```tsx
interface PlanDuration {
  count: number;
  period: 'month' | 'year' | 'day' | 'week';
}

interface PlanDurationProps {
  children: React.ForwardRefRenderFunction<HTMLElement, { duration: PlanDuration | null }>;
}
```

**Example**
```tsx
<Plan.Duration>
  {React.forwardRef(({ duration }, ref) => {
    if (!duration) return <span>Valid until canceled</span>;
    return (
      <span ref={ref} className="text-sm" data-testid="plan-duration">
        Valid for {duration.count} {duration.period}(s)
      </span>
    );
  })}
</Plan.Duration>
```

**Data Attributes**
- `data-testid="plan-duration"` - Applied to duration element
---

### Plan.Action.BuyNow

Wraps the Commerce.Actions.BuyNow component for plan purchases.

**Props**
```tsx
interface PlanActionBuyNowProps extends Omit<Commerce.ActionAddToCartProps, 'lineItems'> {
  // Inherits all Commerce.Actions.BuyNow props except 'lineItems' which is automatically provided from plan data
}
```

**Example**
```tsx
// Default usage
<Plan.Action.BuyNow className="btn-primary">
  Buy Now
</Plan.Action.BuyNow>

// With custom loading state
<Plan.Action.BuyNow
  className="btn-primary"
  loadingState={<span>Processing...</span>}
>
  Purchase Plan
</Plan.Action.BuyNow>
```

**Data Attributes**
- Inherits data attributes from Commerce.Actions.BuyNow component
---
