# Headless Components Guidelines

This document outlines the patterns and best practices for creating headless components in the Wix ecosystem, based on the service-oriented architecture using `@wix/services-manager`.

## Architecture Overview

Headless components in our ecosystem follow a service + React component pattern:

1. **Service Layer**: Handles business logic, state management, and API calls
   - Each service consists of these parts:
     - **a. Service Definition** (the interface) - Defines what the service exposes
     - **b. Service Implementation** (the factory that creates the service) - The actual business logic
     - **c. Initial Data Loader** - Function that loads initial state/configuration for the service
     - **d. Service Binding** - Helper that ties (c) together with (a) and (b) for easier forwarding to the service manager instantiation

2. **React Component Layer**: Provides render props interface for consuming the service

## Service Structure Breakdown

### a. Service Definition (Interface)

The service definition declares what your service exposes - actions, signals, and data.

```typescript
export const BuyNowServiceDefinition = defineService<{
  // Async actions
  redirectToCheckout: () => Promise<void>;

  // State signals (always end with "Signal")
  loadingSignal: Signal<boolean>;
  errorSignal: Signal<string | null>;
}>("BuyNow");
```

**Key Rules:**
- Always include `loadingSignal` and `errorSignal` for async operations
- Signals must end with "Signal" suffix
- Use descriptive action names

### b. Service Implementation (Factory)

The implementation contains the actual business logic and state management.

```typescript
export const BuyNowServiceImplementation = implementService.withConfig<{
  productId: string;
  variantId?: string;
  productName: string;
  price: string;
  currency: string;
}>()(BuyNowServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // Initialize signals
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null);

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        const checkoutUrl = await getCheckoutUrlForProduct(
          config.productId,
          config.variantId
        );
        window.location.href = checkoutUrl;
      } catch (error) {
        errorSignal.set(error as string);
        loadingSignal.set(false);
      }
    },
    loadingSignal,
    errorSignal,
    // Expose config data as service properties
    productName: config.productName,
    price: config.price,
    currency: config.currency,
  };
});
```

**Key Rules:**
- Set `loadingSignal.set(true)` before async operations
- Always handle errors with try/catch
- Clear loading state in catch block for failed operations
- Expose config data as service properties when needed

### c. Initial Data Loader

Loads and transforms data from APIs into the service configuration format.

```typescript
export const loadBuyNowServiceInitialData = async (
  productSlug: string,
  variantId?: string
) => {
  // Fetch data from Wix APIs
  const res = await productsV3.getProductBySlug(productSlug, {
    fields: ["CURRENCY"],
  });
  const product = res.product!;

  const selectedVariantId = variantId ?? product.variantsInfo?.variants?.[0]?._id;
  const price = product.variantsInfo?.variants?.find((v) => v._id === selectedVariantId)
    ?.price?.actualPrice?.amount ?? product.actualPriceRange?.minValue?.amount;

  // Return config object keyed by service definition
  return {
    [BuyNowServiceDefinition]: {
      productId: product._id!,
      productName: product.name!,
      price: price!,
      currency: product.currency!,
      ...(typeof selectedVariantId !== "undefined" ? { variantId: selectedVariantId } : {}),
    },
  };
};
```

**Key Rules:**
- Function name: `load[ServiceName]ServiceInitialData`
- Return object with service definition as key
- Handle optional parameters with fallbacks
- Transform API responses to match service config type

### d. Service Binding

Helper function that bundles everything together for the service manager.

```typescript
export const buyNowServiceBinding = <
  T extends {
    [key: string]: Awaited<ReturnType<typeof loadBuyNowServiceInitialData>>[typeof BuyNowServiceDefinition];
  }
>(servicesConfigs: T) => {
  return [
    BuyNowServiceDefinition,
    BuyNowServiceImplementation,
    servicesConfigs[BuyNowServiceDefinition] as ServiceFactoryConfig<typeof BuyNowServiceImplementation>,
  ] as const;
};
```

**Key Rules:**
- Function name: `[serviceName]ServiceBinding`
- Returns tuple of [Definition, Implementation, Config]
- Use generic type constraints for type safety

## React Component Pattern (Headless + Render Props)

**REQUIREMENT:** All React components MUST be headless components using the render props pattern.

### What is a Headless Component?

A headless component provides functionality and state management without prescribing any specific UI. It separates the "what" (logic) from the "how" (presentation), giving consumers complete control over the visual presentation.

### Component Structure

Every headless component must include:

1. **Render Props Type** - Defines what gets passed to the render function
2. **Component Props Type** - Defines the component's props (always includes `children` as function)
3. **Component Implementation** - The actual component logic
4. **Comprehensive JSDoc** - With description, parameters, and complete example

### 1. Render Props Type

```typescript
/**
 * Props passed to the render function of the BuyNow component
 */
export type BuyNowRenderProps = {
  /** Whether the buy now operation is currently loading */
  isLoading: boolean;
  /** The name of the product being purchased */
  productName: string;
  /** Function to redirect the user to the checkout page */
  redirectToCheckout: () => void;
  /** The error message if the buy now operation fails */
  error: string | null;
  /** The price of the product being purchased */
  price: string;
  /** The currency of the product being purchased */
  currency: string;
};
```

**Key Rules:**
- Transform signal names: `loadingSignal` → `isLoading`, `errorSignal` → `error`
- Document each property with JSDoc comments
- Include all service actions and data
- Use clear, user-friendly property names

### 2. Component Props Type

```typescript
/**
 * Props for the BuyNow component
 */
export type BuyNowProps = {
  /** Render function that receives buy now state and actions */
  children: (props: BuyNowRenderProps) => React.ReactNode;
};
```

**Key Rules:**
- MUST use `children` as the render prop function
- `children` function receives the render props type
- Returns `React.ReactNode`

### 3. Component Implementation

```typescript
/**
 * A headless component that provides buy now functionality using the render props pattern.
 *
 * This component manages the state and actions for a "buy now" flow, allowing consumers
 * to render their own UI while accessing the underlying buy now functionality.
 *
 * @param props - The component props
 * @returns The rendered children with buy now state and actions
 *
 * @example
 * ```tsx
 * <BuyNow>
 *   {({ isLoading, productName, redirectToCheckout, error, price, currency }) => (
 *     <div>
 *       <h2>{productName}</h2>
 *       <p>{price} {currency}</p>
 *       {error && <div className="error">{error}</div>}
 *       <button
 *         onClick={redirectToCheckout}
 *         disabled={isLoading}
 *       >
 *         {isLoading ? 'Processing...' : 'Buy Now'}
 *       </button>
 *     </div>
 *   )}
 * </BuyNow>
 * ```
 */
export function BuyNow(props: BuyNowProps) {
  const {
    redirectToCheckout,
    loadingSignal,
    productName,
    errorSignal,
    price,
    currency,
  } = useService(BuyNowServiceDefinition);

  return props.children({
    isLoading: loadingSignal.get(),
    error: errorSignal.get(),
    productName: productName,
    redirectToCheckout,
    price,
    currency,
  });
}
```

### JSDoc Documentation Requirements

**MANDATORY:** Every headless component must include:

1. **Component Description**:
   - Start with "A headless component that provides [functionality] using the render props pattern"
   - Explain what the component manages
   - Emphasize that consumers control the UI

2. **@param and @returns**: Standard JSDoc parameters

3. **Complete @example**:
   - Show full component usage with realistic JSX
   - Demonstrate error handling (`error && <div>...`)
   - Show loading states (`disabled={isLoading}`, conditional text)
   - Include all important render props
   - Use semantic HTML structure

### Component Implementation Rules

1. **Service Integration**:
   - Use `useService(ServiceDefinition)` to access the service
   - Destructure all needed properties from the service

2. **Signal Transformation**:
   - Call `.get()` on all signals before passing to render props
   - Transform names: `loadingSignal` → `isLoading`, `errorSignal` → `error`

3. **Data Passing**:
   - Pass service actions directly without modification
   - Pass service data properties as-is
   - Transform signal values appropriately

4. **Return Pattern**:
   - Always return `props.children()` with the render props object
   - Never render any UI elements directly in the component

### Why This Pattern?

1. **Flexibility**: Consumers have complete control over styling and structure
2. **Reusability**: Same logic can power different UI implementations
3. **Testability**: Logic and presentation can be tested separately
4. **Consistency**: Standardized approach across all headless components
5. **Accessibility**: Consumers can implement proper accessibility patterns for their specific use case

### Example Usage Patterns

```tsx
// Simple usage
<BuyNow>
  {({ isLoading, redirectToCheckout }) => (
    <button onClick={redirectToCheckout} disabled={isLoading}>
      Buy Now
    </button>
  )}
</BuyNow>

// Complex usage with full state management
<BuyNow>
  {({ isLoading, productName, redirectToCheckout, error, price, currency }) => (
    <div className="product-purchase">
      <h2>{productName}</h2>
      <div className="price">{price} {currency}</div>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <button
        onClick={redirectToCheckout}
        disabled={isLoading}
        className={isLoading ? 'loading' : ''}
      >
        {isLoading ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  )}
</BuyNow>
```

## Naming Conventions

- **Service Definition**: `[Name]ServiceDefinition`
- **Service Implementation**: `[Name]ServiceImplementation`
- **Initial Data Loader**: `load[Name]ServiceInitialData`
- **Service Binding**: `[name]ServiceBinding` (camelCase)
- **Signals**: Always end with `Signal` suffix
- **Render Props**: Transform `loadingSignal` → `isLoading`, `errorSignal` → `error`

## Common Patterns

1. **Loading State**: Always set to `true` before async ops, `false` after completion/error
2. **Error Handling**: Clear previous errors, handle both Error objects and strings
3. **Optional Config**: Use conditional spread for optional configuration properties
4. **API Integration**: Transform API responses to match service configuration needs


