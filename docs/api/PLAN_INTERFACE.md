# Plan Interface Documentation

A comprehensive plan display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Plan component follows a compound component pattern where each part can be composed together to create flexible plan displays.

## Components

### Plan.Root

The root container that provides plan context to all child components.

**Props**
```tsx
interface PlanRootProps {
  plan: Plan;
  children: React.ReactNode;
}
```

**Example**
```tsx
<Plan.Root plan={plan}>
  {/* All plan components */}
</Plan.Root>
```

**Data Attributes**
- `data-testid="plan"` - Applied to root container
---

### Plan.Image

Displays the plan image using WixMediaImage

<!-- TODO: Maybe extend the WixMediaImageProps? -->
<!-- TODO: Check if we have alt text -->
<!-- TODO: Double check child children props -->
**Props**
```tsx
interface PlanImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
  children?: AsChildChildren<{ image: string; }>;
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
  {React.forwardRef(({image, ...props}, ref) => (
    <img ref={ref} {...props} src={image} className="w-full h-full object-cover" />
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
  children?: AsChildChildren<{ name: string; }>;
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
  children?: AsChildChildren<{ description: string; }>;
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

<!-- TODO: Likely to use generic price formatting component that will be provided by the platform -->
<!-- TODO: Should this include formatting options? -->
Displays formatted price and currency

**Props**
```tsx
interface PlanPriceProps {
  asChild?: boolean;
  children?: AsChildChildren<{ amount: string; currency: string; }>;
}
```

**Example**
```tsx
<Plan.Price className="text-2xl font-bold" />

// asChild with primitive
<Plan.Price asChild>
  <span className="text-2xl font-bold" />
</Plan.Price>

// asChild with react component
<Plan.Price asChild>
  {React.forwardRef(({amount, currency, ...props}, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold">
      {amount} {currency}
    </span>
  ))}
</Plan.Price>
```

**Data Attributes**
- `data-testid="plan-price"` - Applied to price element
---

### Plan.AdditionalFees

Displays the plan additional fees.

**Props**
```tsx
interface PlanAdditionalFeesProps {
  asChild?: boolean;
  children?: AsChildChildren<{ additionalFees: string; }>;
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
- `data-testid="plan-additional-fees-repeater"` - Applied to repeater container
---

### Plan.AdditionalFeeName

Displays the additional fee name.

**Props**
```tsx
interface PlanAdditionalFeeNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string; }>;
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
  children?: AsChildChildren<{ amount: string; }>;
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

### Plan.Duration

<!-- TODO: How to handle unlimited duration? -->

Displays the plan duration.

**Props**
```tsx
interface PlanDuration {
  count: number;
  period: 'month' | 'year' | 'day' | 'week';
}

interface PlanDurationProps {
  asChild?: boolean;
  children?: AsChildChildren<{ duration: PlanDuration; }>;
}
```

**Example**
```tsx
<Plan.Duration className="text-sm" />

// asChild with react component
<Plan.Duration asChild>
  {React.forwardRef(({duration, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      Valid for {duration.count} {duration.period}(s)
    </span>
  ))}
</Plan.Duration>
```

**Data Attributes**
- `data-testid="plan-duration"` - Applied to duration element
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
  asChild?: boolean;
  children?: AsChildChildren<{ recurrence: PlanRecurrence }>;
}
```

**Example**
```tsx
// Default usage
<Plan.Recurrence className="text-sm" />

// asChild with react component
<Plan.Recurrence asChild>
  {React.forwardRef(({recurrence, ...props}, ref) => (
    <span ref={ref} {...props} className="text-content-secondary">
      Renews every {recurrence.count} {recurrence.period}(s)
    </span>
  ))}
</Plan.Recurrence>
```

**Data Attributes**
- `data-testid="plan-recurrence"` - Applied to recurrence element
---

### Plan.Button

Displays the plan selection button with support for loading state.

**Props**
```tsx
interface PlanButtonProps {
  asChild?: boolean;
  children?: AsChildChildren<{ plan: Plan; isLoading: boolean; }>;
  label?: string;
  loadingState?: React.ReactNode;
}
```

**Example**
```tsx
// Default usage
<Plan.Button className="text-sm" label="Select" loadingState="Setting up your plan..." />

// asChild with primitive
<Plan.Button asChild>
  <button className="text-sm">
    Select
  </button>
</Plan.Button>

// asChild with react component
<Plan.Button asChild>
  {React.forwardRef(({plan, isLoading, ...props}, ref) => (
    <button ref={ref} {...props} className="text-sm">
      {isLoading ? 'Setting up your plan...' : `Buy ${plan.name} now`}
    </button>
  ))}
</Plan.Button>
```

**Data Attributes**
- `data-testid="plan-button"` - Applied to button element
---

### Plan.Perks

Displays the plan perks.

**Props**
```tsx
interface PlanPerksProps {
  children?: React.ReactNode;
}
```

**Example**
```tsx
<Plan.Perks className="text-sm">
  <Plan.PerksRepeater>
    <Plan.PerkLabel />
  </Plan.PerksRepeater>
</Plan.Perks>
```

**Data Attributes**
- `data-testid="plan-perks"` - Applied to perks element
---

### Plan.PerksRepeater

Repeats for each perk in the list

**Props**
```tsx
interface PlanPerksRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<Plan.PerksRepeater>
  <Plan.PerkLabel />
</Plan.PerksRepeater>
```

**Data Attributes**
- `data-testid="plan-perks-repeater"` - Applied to repeater container
---

### Plan.PerkLabel

Displays the perk label.

**Props**
```tsx
interface PlanPerkLabelProps {
  asChild?: boolean;
  children?: AsChildChildren<{ label: string; }>;
}
```

**Example**
```tsx
// Default usage
<Plan.PerkLabel className="text-sm" />

// asChild with primitive
<Plan.PerkLabel asChild>
  <span className="text-sm" />
</Plan.PerkLabel>

// asChild with react component
<Plan.PerkLabel asChild>
  {React.forwardRef(({label, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {label}
    </span>
  ))}
</Plan.PerkLabel>
```

**Data Attributes**
- `data-testid="plan-perk-label"` - Applied to label element
---
