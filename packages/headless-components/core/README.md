# @wix/headless-core

Core utilities for Wix Headless Components that provide common functionality across all headless packages.

## Installation

```bash
npm install @wix/headless-core
# or
yarn add @wix/headless-core
```

## Utilities

### `hydratedEffect`

A utility function that wraps signals effects to handle hydration properly in SSR (Server-Side Rendering) environments like Astro, Next.js, and other frameworks.

#### Problem it Solves

When using headless components with SSR, data is often loaded server-side and passed to client components. Without proper hydration handling, effects would run immediately on the client, causing:

1. **Duplicate requests** - Client makes the same API calls that were already made on the server
2. **Unnecessary loading states** - UI flickers between loading and loaded states
3. **Performance issues** - Extra network requests and processing

#### How it Works

The `hydratedEffect` utility:

1. Only runs effects on the client-side (checks for `window` object)
2. Ensures signals are read to establish dependencies on first run
3. Allows the effect function to handle firstRun logic internally
4. Executes the effect normally on subsequent reactive updates

#### API

```typescript
function hydratedEffect(
  signalsService: { effect: (fn: () => void | Promise<void>) => void },
  effectFn: () => void | Promise<void>,
  getFirstRun: () => boolean,
  setFirstRun: (value: boolean) => void,
): void;
```

**Parameters:**

- `signalsService` - The signals service instance for creating effects
- `effectFn` - The effect function that reads signals and contains the effect logic
- `getFirstRun` - Function that returns the current firstRun state
- `setFirstRun` - Function to update the firstRun state

#### Usage Example

```typescript
import { hydratedEffect } from "@wix/headless-core/utils";

export const MyService = implementService.withConfig()(
  MyServiceDefinition,
  ({ getService, config }) => {
    let firstRun = true;
    const signalsService = getService(SignalsServiceDefinition);

    const dataSignal = signalsService.signal(config.initialData);
    const searchOptionsSignal = signalsService.signal(config.searchOptions);
    const isLoadingSignal = signalsService.signal(false);

    hydratedEffect(
      signalsService,
      async (isFirstRun) => {
        // Read signals to establish dependencies
        const searchOptions = searchOptionsSignal.get();

        // Skip side effects on first run (data already loaded from SSR)
        if (isFirstRun) return;

        // Clean effect logic - no boilerplate!
        try {
          isLoadingSignal.set(true);
          const result = await fetchData(searchOptions);
          dataSignal.set(result);
        } finally {
          isLoadingSignal.set(false);
        }
      },
      () => firstRun,
      (value) => firstRun = value
    );

    return {
      data: dataSignal,
      searchOptions: searchOptionsSignal,
      isLoading: isLoadingSignal,
      setSearchOptions: (options) => searchOptionsSignal.set(options),
    };
  },
);
```

#### Key Pattern

The critical pattern is:

1. **Read signals FIRST** - This establishes dependencies even on first run
2. **Check firstRun AFTER** - This prevents duplicate execution while maintaining reactivity
3. **Return early if firstRun** - Skip the effect logic but keep the dependencies

```typescript
hydratedEffect(
  signalsService,
  async () => {
    // STEP 1: Read signals to establish dependencies
    const searchOptions = searchOptionsSignal.get();
    const filters = filtersSignal.get();

    // STEP 2: Check firstRun after reading signals
    if (firstRun) {
      firstRun = false;
      return; // Exit early but dependencies are established
    }

    // STEP 3: Execute effect logic on subsequent runs
    try {
      isLoadingSignal.set(true);
      const result = await fetchData(searchOptions, filters);
      dataSignal.set(result);
    } finally {
      isLoadingSignal.set(false);
    }
  },
  () => firstRun,
  (value) => (firstRun = value),
);
```

#### Before vs After

**Before (with manual boilerplate):**

```typescript
if (typeof window !== "undefined") {
  signalsService.effect(async () => {
    // CRITICAL: Read signals first
    const searchOptions = searchOptionsSignal.get();

    if (firstRun) {
      firstRun = false;
      return;
    }

    // Effect logic here...
  });
}

firstRun = false;
```

**After (with hydratedEffect):**

```typescript
hydratedEffect(
  signalsService,
  async () => {
    // CRITICAL: Read signals first
    const searchOptions = searchOptionsSignal.get();

    if (firstRun) {
      firstRun = false;
      return;
    }

    // Effect logic here...
  },
  () => firstRun,
  (value) => (firstRun = value),
);
```

#### Used By

This utility is used internally by:

- `@wix/headless-stores` - Product list, filters, pagination, and sort services
- `@wix/headless-ecom` - Cart and checkout services
- Other headless packages that need hydration-aware effects

## Testing

Run tests with:

```bash
yarn test
```

The tests cover:

- Client-side behavior (with window)
- Server-side behavior (without window)
- FirstRun state management
- Signal dependency establishment
- Error handling
- Edge cases

## Contributing

When adding new utilities to this package:

1. Place utility functions in `src/utils/`
2. Export them from `src/utils/index.ts`
3. Add comprehensive documentation with examples
4. Include TypeScript types for all parameters
5. Add comprehensive tests in `*.test.ts` files
6. Test with both SSR and client-side rendering scenarios
