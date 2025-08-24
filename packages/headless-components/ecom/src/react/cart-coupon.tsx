/**
 * @fileoverview Cart Coupon Components
 *
 * This module provides coupon-related components for cart functionality.
 * These components manage local coupon input state separately from applied coupons.
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { Coupon as CoreCoupon } from './core/CurrentCart.js';

// Components that render actual DOM elements get test IDs on their rendered elements
enum TestIds {
  couponInput = 'coupon-input',
  couponTrigger = 'coupon-trigger',
  couponClear = 'coupon-clear',
}

/**
 * Context for managing local coupon input state
 */
interface CouponContextValue {
  /** Current input value (what user is typing) */
  contextInputValue: string;
  /** Function to update the input value */
  setContextInputValue: (value: string) => void;
}

const CouponContext = React.createContext<CouponContextValue | null>(null);

/**
 * Hook to access coupon context
 */
function useCouponContext(): CouponContextValue {
  const context = React.useContext(CouponContext);
  if (!context) {
    throw new Error(
      'useCouponContext must be used within a Cart.Coupon.Root component',
    );
  }
  return context;
}

/**
 * Props for Coupon Root component
 */
export interface CouponRootProps {
  /** Child components that will have access to coupon context */
  children: React.ReactNode;
  /** Initial input value */
  defaultValue?: string;
}

/**
 * Root component that provides coupon context to its children.
 * Manages local input state separately from the applied coupon in the cart.
 *
 * @component
 * @example
 * ```tsx
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger>Apply</Cart.Coupon.Trigger>
 *   <Cart.Coupon.Clear>Remove</Cart.Coupon.Clear>
 * </Cart.Coupon.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, CouponRootProps>(
  ({ children, defaultValue = '' }, ref) => {
    const [contextInputValue, setContextInputValue] =
      React.useState(defaultValue);

    const contextValue: CouponContextValue = {
      contextInputValue,
      setContextInputValue,
    };

    return (
      <CouponContext.Provider value={contextValue}>
        <div ref={ref}>{children}</div>
      </CouponContext.Provider>
    );
  },
);

/**
 * Props for Coupon.Input component
 */
export interface CouponInputProps {
  asChild?: boolean;
  placeholder?: string;
  className?: string;
  children?: React.ForwardRefRenderFunction<
    HTMLInputElement,
    {
      value: string;
      onChange: (value: string) => void;
    }
  >;
}

/**
 * Coupon code input field.
 *
 * @component
 * @example
 * ```tsx
 * // Must be used within Cart.Coupon.Root container
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input
 *     placeholder="Enter coupon code"
 *     className="px-3 py-2 border rounded-lg"
 *   />
 *   <Cart.Coupon.Trigger>Apply</Cart.Coupon.Trigger>
 * </Cart.Coupon.Root>
 *
 * // Custom rendering with asChild
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input asChild>
 *     {React.forwardRef(({value, onChange, ...props}, ref) => (
 *       <input
 *         ref={ref}
 *         {...props}
 *         type="text"
 *         value={value}
 *         onChange={(e) => onChange(e.target.value)}
 *         className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
 *       />
 *     ))}
 *   </Cart.Coupon.Input>
 * </Cart.Coupon.Root>
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, CouponInputProps>(
  (
    {
      asChild,
      children,
      placeholder = 'Enter coupon code',
      className,
      ...props
    },
    ref,
  ) => {
    const { contextInputValue, setContextInputValue } = useCouponContext();

    const inputProps = {
      value: contextInputValue,
      onChange: setContextInputValue,
    };

    if (asChild && children) {
      return children(inputProps, ref);
    }

    const Comp = asChild ? Slot : 'input';

    return (
      <Comp
        ref={ref}
        type="text"
        value={contextInputValue}
        onChange={(e) => setContextInputValue(e.target.value)}
        placeholder={placeholder}
        className={className}
        data-testid={TestIds.couponInput}
        {...props}
      />
    );
  },
);

/**
 * Props for Coupon.Trigger component
 */
export interface CouponTriggerProps {
  asChild?: boolean;
  className?: string;
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          disabled: boolean;
          isLoading: boolean;
          appliedCoupon: string | null;
          onClick: () => Promise<void>;
          apply: (value: string) => Promise<void>;
        }
      >;
}

/**
 * Apply coupon button.
 *
 * @component
 * @example
 * ```tsx
 * // Must be used within Cart.Coupon.Root container
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger className="btn-primary px-4 py-2">Apply</Cart.Coupon.Trigger>
 * </Cart.Coupon.Root>
 *
 * // Custom rendering with asChild
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger asChild>
 *     {React.forwardRef(({apply, disabled, isLoading, onClick, ...props}, ref) => (
 *       <button
 *         ref={ref}
 *         {...props}
 *         disabled={disabled}
 *         onClick={onClick}
 *         className="btn-primary px-4 py-2 disabled:opacity-50"
 *       >
 *         {isLoading ? 'Applying...' : 'Apply'}
 *       </button>
 *     ))}
 *   </Cart.Coupon.Trigger>
 * </Cart.Coupon.Root>
 * ```
 */
export const Trigger = React.forwardRef<HTMLButtonElement, CouponTriggerProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const { contextInputValue } = useCouponContext();

    return (
      <CoreCoupon>
        {(renderProps) => {
          const { apply, isLoading } = renderProps;
          const disabled = isLoading || !contextInputValue.trim();

          const triggerProps = {
            disabled,
            isLoading,
            apply,
            appliedCoupon: null, // Not needed for trigger
            onClick: async () => {
              if (contextInputValue.trim()) {
                await apply(contextInputValue.trim());
              }
            },
          };

          if (asChild && typeof children === 'function') {
            return children(triggerProps, ref);
          }

          const Comp = asChild ? Slot : 'button';

          return (
            <Comp
              ref={ref}
              onClick={triggerProps.onClick}
              disabled={disabled}
              className={className}
              data-testid={TestIds.couponTrigger}
              data-loading={isLoading}
              {...props}
            >
              {!asChild && typeof children !== 'function'
                ? children || (isLoading ? 'Applying...' : 'Apply')
                : null}
            </Comp>
          );
        }}
      </CoreCoupon>
    );
  },
);

/**
 * Props for Coupon.Clear component
 */
export interface CouponClearProps {
  asChild?: boolean;
  className?: string;
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        {
          onClick: () => Promise<void>;
        }
      >;
}

/**
 * Remove applied coupon button.
 *
 * @component
 * @example
 * ```tsx
 * // Must be used within Cart.Coupon.Root container
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger>Apply</Cart.Coupon.Trigger>
 *   <Cart.Coupon.Clear className="text-sm text-content-muted hover:text-content-primary">Remove</Cart.Coupon.Clear>
 * </Cart.Coupon.Root>
 *
 * // Custom rendering with asChild
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Clear asChild>
 *     {React.forwardRef(({onClick, disabled, isLoading, ...props}, ref) => (
 *       <button
 *         ref={ref}
 *         {...props}
 *         onClick={onClick}
 *         disabled={disabled}
 *         className="text-sm text-content-muted hover:text-content-primary underline"
 *       >
 *         {isLoading ? 'Removing...' : 'Remove coupon'}
 *       </button>
 *     ))}
 *   </Cart.Coupon.Clear>
 * </Cart.Coupon.Root>
 * ```
 */
export const Clear = React.forwardRef<HTMLButtonElement, CouponClearProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const { setContextInputValue } = useCouponContext();

    return (
      <CoreCoupon>
        {(renderProps) => {
          const { remove, appliedCoupon, isLoading } = renderProps;
          const disabled = !appliedCoupon || isLoading;

          const clearProps = {
            onClick: async () => {
              await remove();
              setContextInputValue(''); // Clear the input when removing coupon
            },
          };

          // Only render if there's an applied coupon
          if (!appliedCoupon) {
            return null;
          }

          if (asChild && typeof children === 'function') {
            return children(clearProps, ref);
          }

          const Comp = asChild ? Slot : 'button';

          return (
            <Comp
              ref={ref}
              onClick={clearProps.onClick}
              disabled={disabled}
              className={className}
              data-testid={TestIds.couponClear}
              {...props}
            >
              {!asChild && typeof children !== 'function'
                ? children || (isLoading ? 'Removing...' : 'Remove')
                : null}
            </Comp>
          );
        }}
      </CoreCoupon>
    );
  },
);

/**
 * Props for Coupon.Raw component
 */
export interface CouponRawProps {
  /** Whether to render the raw component as a child */
  asChild?: boolean;
  /** Render prop function that receives all coupon data and actions */
  children: (props: {
    /** Applied coupon code if any */
    appliedCoupon: string | null;
    /** Function to apply a coupon code */
    apply: (code: string) => Promise<void>;
    /** Function to remove the applied coupon */
    remove: () => Promise<void>;
    /** Whether coupon operations are loading */
    isLoading: boolean;
    /** Error message if coupon operation failed */
    error: string | null;
  }) => React.ReactNode;
}

/**
 * Raw component that exposes all coupon render props without any UI wrapper.
 * Provides direct access to all coupon functionality and state.
 *
 * @component
 * @example
 * ```tsx
 * <Cart.Coupon.Raw>
 *   {({ appliedCoupon, apply, remove, isLoading, error }) => (
 *     <div>
 *       {appliedCoupon ? (
 *         <div>
 *           <span>Applied: {appliedCoupon}</span>
 *           <button onClick={remove} disabled={isLoading}>
 *             {isLoading ? 'Removing...' : 'Remove'}
 *           </button>
 *         </div>
 *       ) : (
 *         <div>
 *           <input
 *             type="text"
 *             onKeyDown={(e) => {
 *               if (e.key === 'Enter') {
 *                 apply(e.currentTarget.value);
 *               }
 *             }}
 *           />
 *           <button
 *             onClick={() => apply('DISCOUNT10')}
 *             disabled={isLoading}
 *           >
 *             {isLoading ? 'Applying...' : 'Apply Sample'}
 *           </button>
 *         </div>
 *       )}
 *       {error && <div className="error">{error}</div>}
 *     </div>
 *   )}
 * </Cart.Coupon.Raw>
 * ```
 */
export const Raw: React.FC<CouponRawProps> = ({ children }) => {
  return <CoreCoupon>{children}</CoreCoupon>;
};
