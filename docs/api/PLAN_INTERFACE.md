# Plan Interface Documentation

A comprehensive plan display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Plan component follows a compound component pattern where each part can be composed together to create flexible plan displays.

## Components

### Plan.Root

The root container that provides plan context to child components and handles loading/error states for plan loading.

**Props**
```tsx
type PlanServiceConfig = { plan: Plan } | { planId: string }

// TODO: Should add `WithAsChild` type here, so it's known exactly what is the data that is being passed to the component?
type RootProps = WithAsChild<
  {
    planServiceConfig: PlanServiceConfig;
    loadingState?: React.ReactNode;
    errorState?: React.ReactNode;
    className?: string;
  },
  PlanRootData
>;
```

**Example**
```tsx
  // Default usage
  <Plan.Root planServiceConfig={planServiceConfig} loadingState={<div>Loading...</div>} errorState={<div>Error</div>}>
    <Plan.Image />
    <Plan.Name />
    <Plan.Description />
    <Plan.Price />
    <Plan.AdditionalFees />
    <Plan.Recurrence />
    <Plan.Duration />
    <Plan.Action.BuyNow label="Select Plan" />
  </Plan.Root>

  // With asChild
  <Plan.Root planServiceConfig={planServiceConfig} asChild>
    {React.forwardRef(({ isLoading, error, plan }, ref) => (
      <div ref={ref}>
        {isLoading ? 'Loading...' : error ? 'Error!' : `Plan ${plan.name} loaded`}
      </div>
    ))}
  </Plan.Root>
```

**Data Attributes**
- `data-testid="plan-root"` - Applied to root container
- `data-is-loading` - Applied to container when loading
- `data-has-error` - Applied to container when error occurs
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
type NameProps = WithAsChild<{ className?: string }, PlanNameData>;
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
type DescriptionProps = WithAsChild<
  { className?: string },
  PlanDescriptionData
>;
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
type PriceProps = WithAsChild<{ className?: string }, PlanPriceData>;
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
type AdditionalFeesProps = WithAsChild<
  { className?: string },
  PlanAdditionalFeesData
>;
```

**Example**
```tsx
// Default usage
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
---

### Plan.AdditionalFeeName

Displays the additional fee name. Must be used within an AdditionalFeesRepeater.

**Props**
```tsx
type AdditionalFeeNameProps = WithAsChild<
  { className?: string },
  PlanAdditionalFeeNameData
>;
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
type AdditionalFeeAmountProps = WithAsChild<
  { className?: string },
  PlanAdditionalFeeAmountData
>;
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
```

**Example**
```tsx
<Plan.Recurrence>
  {React.forwardRef(({ recurrence }, ref) => {
    if (!recurrence) return null;

    return <span ref={ref} className="text-content-secondary" data-testid="plan-recurrence">
      Renews every {recurrence.count} {recurrence.period}(s)
    </span>
  })}
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
```

**Example**
```tsx
<Plan.Duration>
  {React.forwardRef(({ duration }, ref) => {
    if (!duration) return <span>Valid until canceled</span>;

    return <span ref={ref} className="text-sm" data-testid="plan-duration">
      Valid for {duration.count} {duration.period}(s)
    </span>
  })}
</Plan.Duration>
```
---

### Plan.Perks

Container for plan perks.

**Props**
```tsx
type PerksProps = WithAsChild<{ className?: string }, PlanPerksData>;
```

**Example**
```tsx
// Default usage
<Plan.Perks className="flex flex-col gap-2">
  <Plan.PerksRepeater>
    <Plan.PerkDescription className="text-sm" />
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

Repeater component that renders children for each perk with the perk description context

**Props**
```tsx
interface PlanPerksRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<Plan.PerksRepeater>
  <Plan.PerkDescription className="text-sm" />
</Plan.PerksRepeater>
```
---

### Plan.PerkDescription

Displays the perk description. Must be used within a PerksRepeater.

**Props**
```tsx
type PerkDescriptionProps = WithAsChild<
  { className?: string },
  PlanPerkDescriptionData
>;
```

**Example**
```tsx
// Default usage
<Plan.PerkDescription className="text-sm" />

// asChild with primitive
<Plan.PerkDescription asChild>
  <span className="text-sm" />
</Plan.PerkDescription>

// asChild with react component
<Plan.PerkDescription asChild>
  {React.forwardRef(({perkDescription, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {perkDescription}
    </span>
  ))}
</Plan.PerkDescription>
```

**Data Attributes**
- `data-testid="plan-perk-description"` - Applied to perk description element
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
  {React.forwardRef(({disabled, isLoading, onClick, ...props}, ref) => (
    <button ref={ref} {...props} disabled={disabled} onClick={onClick} className="btn-primary">
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  ))}
</Plan.Action.BuyNow>
```

**Data Attributes**
- `data-testid="plan-action-buy-now"` - Applied to buy now button
---
