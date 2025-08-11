# Ecom Components V2 Migration Tasks

Technical implementation checklist for ecom V1 → V2 migration following [ECOM_INTERFACE.md](https://github.com/wix-incubator/kitchensink/blob/carmelc-04-08-2025-23-16/docs/api_v2/ECOM_INTERFACE.md)

## Foundation Setup

### Project Structure
- [x] Create `packages/headless-components/ecom/src/react/core/` folder
- [x] Move `CurrentCart.tsx` to `core/CurrentCart.tsx`
- [x] Move `Checkout.tsx` to `core/Checkout.tsx`
- [x] Update internal imports in moved files

### Dependencies & Utils
- [x] Add `@radix-ui/react-slot` to ecom package.json dependencies
- [x] ~~Create `src/react/utils/` folder with AsChildProps interface~~ (using existing renderAsChild utility)
- [x] ~~Create `src/react/constants.ts` with data-testid constants~~ (hardcoded in components per V2 pattern)

## Cart Components

### Cart.Root
- [ ] Create `src/react/Cart.tsx` file
- [ ] Implement `Cart.Root` with interface:
  ```tsx
  interface CartRootProps {
    cart: CartData;
    children: React.ReactNode;
    asChild?: boolean;
  }
  ```
- [ ] Add `data-testid="cart"` attribute

### Cart.LineItems
- [ ] Implement `Cart.LineItems` with interface:
  ```tsx
  interface CartLineItemsProps {
    children: React.ReactNode;
    emptyState?: React.ReactNode;
  }
  ```
- [ ] Add `data-testid="cart-line-items"` attribute

### Cart.LineItemRepeater
- [ ] Implement `Cart.LineItemRepeater` with interface:
  ```tsx
  interface CartLineItemRepeaterProps {
    children: React.ReactNode;
  }
  ```
- [ ] Add `data-testid="cart-line-item"` to each item

## LineItem Components

### LineItem.Title
- [ ] Create `src/react/LineItem.tsx` file
- [ ] Implement `LineItem.Title` with interface:
  ```tsx
  interface LineItemTitleProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLElement, { title: string }>;
  }
  ```
- [ ] Add `data-testid="line-item-title"` attribute

### LineItem.Image
- [ ] Implement `LineItem.Image` with interface:
  ```tsx
  interface LineItemImageProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLImageElement, { src: string; alt: string }>;
  }
  ```
- [ ] Add `data-testid="line-item-image"` attribute

### LineItem.SelectedOptions
- [ ] Implement `LineItem.SelectedOptions` with interface:
  ```tsx
  interface LineItemSelectedOptionsProps {
    children: React.ReactNode;
  }
  ```
- [ ] Add `data-testid="line-item-selected-options"` attribute

### LineItem.SelectedOptionRepeater
- [ ] Implement `LineItem.SelectedOptionRepeater` with interface:
  ```tsx
  interface LineItemSelectedOptionRepeaterProps {
    children: React.ReactNode;
  }
  ```
- [ ] Add `data-testid="selected-option"` to each item

## SelectedOption Components

### SelectedOption.Text
- [ ] Create `src/react/SelectedOption.tsx` file
- [ ] Implement `SelectedOption.Text` with interface:
  ```tsx
  interface SelectedOptionTextProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLElement, { name: string; value: string }>;
  }
  ```
- [ ] Add `data-testid="selected-option-text"` attribute

### SelectedOption.Color
- [ ] Implement `SelectedOption.Color` with interface:
  ```tsx
  interface SelectedOptionColorProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLElement, { name: string; colorCode: string }>;
  }
  ```
- [ ] Add `data-testid="selected-option-color"` attribute

## Quantity Components

### LineItem.Quantity
- [ ] Add `LineItem.Quantity` to `LineItem.tsx` with interface:
  ```tsx
  interface LineItemQuantityProps {
    children: React.ReactNode;
    steps?: number; // default: 1
  }
  ```
- [ ] Add `data-testid="line-item-quantity"` attribute

### Quantity.Decrement
- [ ] Create `src/react/Quantity.tsx` file
- [ ] Implement `Quantity.Decrement` with forwardRef and Slot pattern

### Quantity.Input
- [ ] Implement `Quantity.Input` with forwardRef and Slot pattern

### Quantity.Increment
- [ ] Implement `Quantity.Increment` with forwardRef and Slot pattern

### Quantity.Reset
- [ ] Implement `Quantity.Reset` with forwardRef and Slot pattern

## Cart Summary & Totals

### Cart.Summary
- [ ] Add `Cart.Summary` to `Cart.tsx` with interface:
  ```tsx
  interface CartSummaryProps {
    children: React.ReactNode;
    asChild?: boolean;
  }
  ```
- [ ] Add `data-testid="cart-summary"` attribute

### Cart.Totals.Price
- [ ] Create `src/react/CartTotals.tsx` file
- [ ] Implement `Cart.Totals.Price` with interface:
  ```tsx
  interface CartPriceProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLElement, { price: Money; formattedPrice: string }>;
    label?: string;
  }
  ```
- [ ] Add `data-testid="cart-price"` attribute

### Cart.Totals.Tax
- [ ] Implement `Cart.Totals.Tax` with same interface pattern
- [ ] Conditional rendering based on tax applicability

### Cart.Totals.Discount
- [ ] Implement `Cart.Totals.Discount` with same interface pattern
- [ ] Conditional rendering based on discount availability

## Additional Components

### Cart.Coupon.Input
- [ ] Create `src/react/CartCoupon.tsx` file
- [ ] Implement `Cart.Coupon.Input` with interface:
  ```tsx
  interface CartCouponInputProps {
    asChild?: boolean;
    placeholder?: string;
    children?: React.ForwardRefRenderFunction<HTMLInputElement, { value: string; onChange: (value: string) => void }>;
  }
  ```
- [ ] Add `data-testid="coupon-input"` attribute

### Cart.Coupon.Trigger
- [ ] Implement `Cart.Coupon.Trigger` with interface:
  ```tsx
  interface CartCouponTriggerProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLButtonElement, { disabled: boolean; isLoading: boolean; onClick: () => Promise<void> }>;
  }
  ```
- [ ] Add `data-testid="coupon-trigger"` and `data-loading` attributes

### Cart.Coupon.Clear
- [ ] Implement `Cart.Coupon.Clear` with interface:
  ```tsx
  interface CartCouponClearProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLButtonElement, { onClick: () => Promise<void> }>;
  }
  ```
- [ ] Add `data-testid="coupon-clear"` attribute

### Cart.Note.Input
- [ ] Add `Cart.Note.Input` to `Cart.tsx` with interface:
  ```tsx
  interface CartNoteInputProps {
    asChild?: boolean;
    placeholder?: string;
    maxLength?: number; // default: 500
    children?: React.ForwardRefRenderFunction<HTMLTextAreaElement, { value: string; onChange: (value: string) => void }>;
  }
  ```
- [ ] Add `data-testid="cart-note-input"` attribute

### Cart.Errors
- [ ] Add `Cart.Errors` to `Cart.tsx` with interface:
  ```tsx
  interface CartErrorsProps {
    asChild?: boolean;
    children?: React.ForwardRefRenderFunction<HTMLElement, { errors: string[] }>;
  }
  ```
- [ ] Add `data-testid="cart-errors"` attribute

## Commerce Actions

### Commerce.Actions.AddToCart
- [ ] Create `src/react/Commerce.tsx` file
- [ ] Implement `Commerce.Actions.AddToCart` with interface:
  ```tsx
  interface CartActionsProps {
    asChild?: boolean;
    label: string;
    children?: React.ForwardRefRenderFunction<HTMLButtonElement, { disabled: boolean; isLoading: boolean; onClick: () => Promise<void> }>;
    lineItems: Array<{ catalogReference: { catalogItemId: string; appId: string; options: any }; quantity: number }>;
  }
  ```
- [ ] Add `disabled` and `data-in-progress` attributes

### Commerce.Actions.BuyNow
- [ ] Implement `Commerce.Actions.BuyNow` with same interface as AddToCart
- [ ] Add `disabled` and `data-in-progress` attributes

### Commerce.Actions.Checkout
- [ ] Implement `Commerce.Actions.Checkout` with interface:
  ```tsx
  interface CartActionsCheckoutProps {
    asChild?: boolean;
    label: string;
    children?: React.ForwardRefRenderFunction<HTMLButtonElement, { disabled: boolean; isLoading: boolean; onClick: () => Promise<void> }>;
  }
  ```
- [ ] Add `disabled` and `data-in-progress` attributes

## Export Configuration

- [ ] Update `src/react/index.tsx` with export structure:
  ```tsx
  // V1 exports (existing, moved to core/)
  export * as CurrentCart from "./core/CurrentCart.js";
  export * as Checkout from "./core/Checkout.js";

  // V2 exports (new composite API)
  export * as Cart from "./Cart.js";
  export * as Commerce from "./Commerce.js";
  export * as LineItem from "./LineItem.js";
  export * as SelectedOption from "./SelectedOption.js";
  export * as Quantity from "./Quantity.js";
  ```


