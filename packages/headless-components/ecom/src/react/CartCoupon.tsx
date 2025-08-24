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
 * Shows input/apply when no coupon is applied, shows coupon display when applied.
 *
 * @component
 * @example
 * ```tsx
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger>Apply</Cart.Coupon.Trigger>
 *   <Cart.Coupon.Clear />
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
 * Automatically hides when a coupon is already applied.
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
 *   <Cart.Coupon.Clear />
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

    return (
      <CoreCoupon>
        {(renderProps) => {
          const { appliedCoupon } = renderProps;

          // Hide input if coupon is already applied
          if (appliedCoupon) {
            return null;
          }

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
        }}
      </CoreCoupon>
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
 * Automatically hides when a coupon is already applied.
 *
 * @component
 * @example
 * ```tsx
 * // Must be used within Cart.Coupon.Root container
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger className="btn-primary px-4 py-2">Apply</Cart.Coupon.Trigger>
 *   <Cart.Coupon.Clear />
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
          const { apply, isLoading, appliedCoupon } = renderProps;

          // Hide trigger if coupon is already applied
          if (appliedCoupon) {
            return null;
          }

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
        HTMLDivElement,
        {
          onClick: () => Promise<void>;
          appliedCoupon: string | null;
          disabled: boolean;
          isLoading: boolean;
        }
      >;
}

/**
 * Display applied coupon with remove option.
 * Shows the applied coupon in a styled container with a remove button.
 *
 * @component
 * @example
 * ```tsx
 * // Must be used within Cart.Coupon.Root container
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Input placeholder="Enter coupon code" />
 *   <Cart.Coupon.Trigger>Apply</Cart.Coupon.Trigger>
 *   <Cart.Coupon.Clear />
 * </Cart.Coupon.Root>
 *
 * // Custom rendering with asChild
 * <Cart.Coupon.Root>
 *   <Cart.Coupon.Clear asChild>
 *     {React.forwardRef(({onClick, disabled, isLoading, appliedCoupon, ...props}, ref) => (
 *       <div ref={ref} {...props} className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
 *         <span className="text-green-600 font-medium text-sm">Coupon: {appliedCoupon}</span>
 *         <button
 *           onClick={onClick}
 *           disabled={disabled}
 *           className="text-orange-400 hover:text-orange-500 text-sm font-medium disabled:opacity-50"
 *         >
 *           {isLoading ? 'Removing...' : 'Remove'}
 *         </button>
 *       </div>
 *     ))}
 *   </Cart.Coupon.Clear>
 * </Cart.Coupon.Root>
 * ```
 */
export const Clear = React.forwardRef<HTMLDivElement, CouponClearProps>(
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
            appliedCoupon,
            disabled,
            isLoading,
          };

          // Only render if there's an applied coupon
          if (!appliedCoupon) {
            return null;
          }

          if (asChild && typeof children === 'function') {
            return children(clearProps, ref);
          }

          const Comp = asChild ? Slot : 'div';

          return (
            <Comp
              ref={ref}
              className={className}
              data-testid={TestIds.couponClear}
              {...props}
            >
              {!asChild && typeof children !== 'function' ? (
                <div className="flex items-center justify-between p-3 bg-status-success-light border border-status-success rounded-lg">
                  <span className="text-status-success text-sm font-medium">
                    Coupon: {appliedCoupon}
                  </span>
                  <button
                    onClick={remove}
                    disabled={isLoading}
                    className="text-status-error hover:text-status-error/80 text-sm disabled:opacity-50"
                  >
                    {isLoading ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ) : null}
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
