# Plan Interface Documentation

A comprehensive plan display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Plan component follows a compound component pattern where each part can be composed together to create flexible plan displays.

## Components

### Plan.Root

The root container that provides plan context to child components and handles loading/error states for plan loading.

Accepts a `planServiceConfig` prop with one of the following options:
- `planId`: Plan ID to load
- `plan`: Plan to add to context (if loaded externally)

**Props**
```tsx
type PlanServiceConfig = { plan: Plan } | { planId: string }

interface RootProps {
  planServiceConfig: PlanServiceConfig;
  children: React.ReactNode;
}
```

**Example**
```tsx
// Load specific plan
<Plan.Root planServiceConfig={{ planId: 'planId' }}>
  <Plan.Plan>
    <Plan.Image />
    <Plan.Name />
    <Plan.Price />
    <Plan.AdditionalFees />
    <Plan.Recurrence />
    <Plan.Duration />
    <Plan.FreeTrialDays />
    <Plan.Action.BuyNow label="Select Plan" />
  </Plan.Plan>
</Plan.Root>

// Load plan externally
const { plan } = await loadPlanServiceConfig('planId');

<Plan.Root planServiceConfig={{ plan: plan }}>
  <Plan.Plan>
    {/* Plan components */}
  </Plan.Plan>
</Plan.Root>
```
---

### Plan.Plan

Displays the plan data with support for loading state.

**Props**
```tsx
interface PlanProps {
  asChild?: boolean;
  children: AsChildChildren<PlanData> | React.ReactNode;
  className?: string;
  loadingState?: React.ReactNode;
}

type PlanData =
  | { isLoading: true; error: null; plan: null }
  | { isLoading: false; error: null; plan: plansV3.Plan }
  | { isLoading: false; error: Error; plan: null };
```

**Example**
```tsx
// Default usage with loading state
<Plan.Plan className="flex flex-col gap-4" loadingState={<div>Loading...</div>}>
  <Plan.Image />
  <Plan.Name />
  <Plan.Price />
</Plan.Plan>

// asChild with react component
<Plan.Plan asChild>
  {React.forwardRef(({isLoading, error, plan}, ref) => {
    if (isLoading) {
      return <div ref={ref}>Loading plan...</div>;
    }
    if (error) {
      return <div ref={ref}>Error loading plan: {error.message}</div>;
    }
    return (
      <div ref={ref} className="flex flex-col gap-4">
        <h2>Plan: {plan.name}</h2>
        <p>ID: {plan._id}</p>
      </div>
    );
  })}
</Plan.Plan>
```

**Data Attributes**
- `data-testid="plan-plan"` - Applied to plan element
- `data-is-loading="true|false"` - Indicates loading state
- `data-has-error="true|false"` - Indicates error state
---

### Plan.Image

Displays the plan image using WixMediaImage

**Props**
```tsx
type ImageProps = Omit<
  React.ComponentProps<typeof WixMediaImage>,
  'src' | 'media'
>;
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
interface NameProps {
  asChild?: boolean;
  children: AsChildChildren<PlanNameData>;
  className?: string;
}

interface PlanNameData {
  name: string;
};
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
interface DescriptionProps {
  asChild?: boolean;
  children: AsChildChildren<PlanDescriptionData>;
  className?: string;
}

interface PlanDescriptionData {
  description: string;
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

Displays plan price.

**Props**
```tsx
interface PriceProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPriceData>;
  className?: string;
}

interface PlanPriceData {
  price: { amount: number; currency: string; formattedPrice: string };
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
      <br />
      <br />
      {price.amount} {price.currency}
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
interface AdditionalFeesProps {
  asChild?: boolean;
  children: AsChildChildren<PlanAdditionalFeesData>;
  className?: string;
}

interface PlanAdditionalFeesData {
  additionalFees: {
    name: string;
    amount: number;
    currency: string;
    formattedFee: string;
  }[];
}
```

**Example**
```tsx
// Default usage
<Plan.AdditionalFees className="flex flex-col gap-2">
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
---

### Plan.AdditionalFeeName

Displays the additional fee name. Must be used within an AdditionalFeesRepeater.

**Props**
```tsx
interface AdditionalFeeNameProps {
  asChild?: boolean;
  children: AsChildChildren<PlanAdditionalFeeNameData>;
  className?: string;
}

interface PlanAdditionalFeeNameData {
  name: string;
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

Displays the additional fee amount. Must be used within an AdditionalFeesRepeater.

**Props**
```tsx
interface AdditionalFeeAmountProps {
  asChild?: boolean;
  children: AsChildChildren<PlanAdditionalFeeAmountData>;
  className?: string;
}

interface PlanAdditionalFeeAmountData {
  amount: number;
  currency: string;
  formattedFee: string;
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
  {React.forwardRef(({amount, currency, formattedFee, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {amount} {currency}
      <br />
      <br />
      {formattedFee}
    </span>
  ))}
</Plan.AdditionalFeeAmount>
```

**Data Attributes**
- `data-testid="plan-additional-fee-amount"` - Applied to amount element
---


### Plan.Recurrence

Provides the child component with the recurrence data. It will be null for one-time plans.

**Props**
```tsx
interface RecurrenceProps {
  children: React.ForwardRefRenderFunction<HTMLElement, PlanRecurrenceData>;
}

interface PlanRecurrenceData {
  recurrence: {
    count: number;
    period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  } | null;
}
```

**Example**
```tsx
<Plan.Recurrence>
  {({ recurrence }, ref) => {
    if (!recurrence) return null;

    return <span ref={ref} className="text-content-secondary" data-testid="plan-recurrence">
      Renews every {recurrence.count} {recurrence.period}(s)
    </span>
  }}
</Plan.Recurrence>
```
---


### Plan.Duration

Provides the child component with the duration data. It will be `null` for unlimited plans.

**Props**
```tsx
interface DurationProps {
  children: React.ForwardRefRenderFunction<HTMLElement, PlanDurationData>;
}

interface PlanDurationData {
  duration: {
    count: number;
    period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  } | null;
}
```

**Example**
```tsx
<Plan.Duration>
  {({ duration }, ref) => {
    if (!duration) return <span>Valid until canceled</span>;

    return <span ref={ref} className="text-sm" data-testid="plan-duration">
      Valid for {duration.count} {duration.period}(s)
    </span>
  }}
</Plan.Duration>
```
---

### Plan.FreeTrialDays

Displays the free trial days.

**Props**
```tsx
interface FreeTrialDaysProps {
  children: React.ForwardRefExoticComponent<PlanFreeTrialDaysData>;
}

interface PlanFreeTrialDaysData {
  freeTrialDays: number;
}
```

**Example**

```tsx
<Plan.FreeTrialDays>
  {React.forwardRef(({freeTrialDays, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {freeTrialDays}
    </span>
  ))}
</Plan.FreeTrialDays>
```
---

### Plan.Perks

Container for plan perks.

**Props**
```tsx
interface PerksProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPerksData>;
  className?: string;
}

interface PlanPerksData {
  perks: string[];
}
```

**Example**
```tsx
// Default usage
<Plan.Perks className="flex flex-col gap-2">
  <Plan.PerksRepeater>
    <Plan.PerkItem className="text-sm" />
  </Plan.PerksRepeater>
</Plan.Perks>

// asChild with react component
<Plan.Perks asChild>
  {React.forwardRef(({perks, ...props}, ref) => (
    <div ref={ref} {...props} className="flex flex-col gap-2">
      {perks.map((perk) => <span key={perk}> 🎉 {perk}</span>)}
    </div>
  ))}
</Plan.Perks>
```

**Data Attributes**
- `data-testid="plan-perks"` - Applied to perks element
---

### Plan.PerksRepeater

Repeater component that renders children for each perk with the perk item context

**Props**
```tsx
interface PlanPerksRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<Plan.PerksRepeater>
  <Plan.PerkItem className="text-sm" />
</Plan.PerksRepeater>
```
---

### Plan.PerkItem

Displays the perk item. Must be used within a PerksRepeater.

**Props**
```tsx
interface PerkItemProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPerkItemData>;
  className?: string;
}

interface PlanPerkItemData {
  perk: string;
}
```

**Example**
```tsx
// Default usage
<Plan.PerkItem className="text-sm" />

// asChild with primitive
<Plan.PerkItem asChild>
  <span className="text-sm" />
</Plan.PerkItem>

// asChild with react component
<Plan.PerkItem asChild>
  {React.forwardRef(({perk, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {perk}
    </span>
  ))}
</Plan.PerkItem>
```

**Data Attributes**
- `data-testid="plan-perk-item"` - Applied to perk item element
---

### Plan.Action.BuyNow

Initiates the plan purchase flow.

**Props**
```tsx
type ActionBuyNowProps = Omit<Commerce.ActionAddToCartProps, 'lineItems'>;
```

**Example**
```tsx
// Default usage
<Plan.Action.BuyNow className="btn-primary" label="Buy Now" loadingState="Processing..." />

// With custom button
<Plan.Action.BuyNow className="btn-primary" label="Buy Now" loadingState="Processing..." asChild>
  <button>Buy Now</button>
</Plan.Action.BuyNow>

// With custom button with forwardRef
<Plan.Action.BuyNow className="btn-primary" label="Buy Now" loadingState="Processing..." asChild>
  {({disabled, isLoading, onClick, ...props}, ref) => (
    <button ref={ref} {...props} disabled={disabled} onClick={onClick} className="btn-primary">
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  )}
</Plan.Action.BuyNow>
```

**Data Attributes**
- `data-testid="plan-action-buy-now"` - Applied to buy now button
---
