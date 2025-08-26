import React from 'react';
import { renderChildren } from '../utils/asChild.js';

enum TestIds {
  quantityRoot = 'quantity-root',
  quantityIncrement = 'quantity-increment',
  quantityDecrement = 'quantity-decrement',
  quantityInput = 'quantity-input',
  quantityReset = 'quantity-reset',
}

// Quantity Context
interface QuantityContextValue {
  value: number;
  steps: number;
  onValueChange: (value: number) => void;
  reset?: () => void;
}

const QuantityContext = React.createContext<QuantityContextValue | null>(null);

function useQuantityContext(): QuantityContextValue {
  const context = React.useContext(QuantityContext);
  if (!context) {
    throw new Error(
      'useQuantityContext must be used within a Quantity.Root component',
    );
  }
  return context;
}

/**
 * Props for Quantity Root component
 */
export interface QuantityRootProps {
  /** Child components that will have access to the quantity context */
  children: React.ReactNode;
  /** How much to increment/decrement (default: 1) */
  steps?: number;
  /** Callback when quantity value changes */
  onValueChange: (value: number) => void;
  /** Initial value for the quantity */
  initialValue?: number;
  /** Reset function */
  reset?: () => void;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Minimum value for the quantity */
  min?: number;
  /** Maximum value for the quantity */
  max?: number;
}

/**
 * Root component that provides quantity context to its children.
 * Manages the quantity state and provides increment/decrement functionality.
 *
 * @component
 * @example
 * ```tsx
 * <Quantity.Root steps={1} onValueChange={(value) => updateQuantity(value)}>
 *   <Quantity.Decrement />
 *   <Quantity.Input />
 *   <Quantity.Increment />
 *   <Quantity.Reset />
 * </Quantity.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, QuantityRootProps>(
  (props, ref) => {
    const {
      children,
      steps = 1,
      onValueChange,
      initialValue = 1,
      min = 1,
      max = Infinity,
      reset,
      className,
      ...otherProps
    } = props;

    const contextValue: QuantityContextValue = {
      value: initialValue,
      steps,
      onValueChange,
      reset,
    };

    return (
      <QuantityContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-testid={TestIds.quantityRoot}
          className={className}
          {...otherProps}
        >
          {children}
        </div>
      </QuantityContext.Provider>
    );
  },
);

Root.displayName = 'Quantity.Root';

/**
 * Props for Quantity Increment component
 */
export interface QuantityIncrementProps {
  asChild?: boolean;
  className?: string;
  children?:
    | string
    | React.ReactNode
    | React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}

/**
 * Button to increment the quantity value.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Quantity.Increment className="px-3 py-2 border rounded hover:bg-surface-primary" />
 *
 * // Custom rendering with forwardRef
 * <Quantity.Increment asChild>
 *   {React.forwardRef((props, ref) => (
 *     <button ref={ref} {...props} className="custom-increment-button">
 *       <Plus className="h-4 w-4" />
 *     </button>
 *   ))}
 * </Quantity.Increment>
 * ```
 */
export const Increment = React.forwardRef<
  HTMLButtonElement,
  QuantityIncrementProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const { onValueChange, value, steps } = useQuantityContext();

  if (asChild && children) {
    return renderChildren({ children, props: {}, ref });
  }

  return (
    <button
      ref={ref}
      onClick={() => onValueChange(value + steps)}
      data-testid={TestIds.quantityIncrement}
      className={className}
      {...otherProps}
    >
      {typeof children === 'string' ? children : '+'}
    </button>
  );
});

Increment.displayName = 'Quantity.Increment';

/**
 * Props for Quantity Decrement component
 */
export interface QuantityDecrementProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?:
    | string
    | React.ReactNode
    | React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Button to decrement the quantity value.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Quantity.Decrement className="px-3 py-2 border rounded hover:bg-surface-primary" />
 *
 * // Custom rendering with forwardRef
 * <Quantity.Decrement asChild>
 *   {React.forwardRef((props, ref) => (
 *     <button ref={ref} {...props} className="custom-decrement-button">
 *       <Minus className="h-4 w-4" />
 *     </button>
 *   ))}
 * </Quantity.Decrement>
 * ```
 */
export const Decrement = React.forwardRef<
  HTMLButtonElement,
  QuantityDecrementProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const { onValueChange, value, steps } = useQuantityContext();

  if (asChild && children) {
    return renderChildren({ children, props: {}, ref });
  }

  return (
    <button
      ref={ref}
      onClick={() => onValueChange(value - steps)}
      data-testid={TestIds.quantityDecrement}
      className={className}
      {...otherProps}
    >
      {typeof children === 'string' ? children : '-'}
    </button>
  );
});

Decrement.displayName = 'Quantity.Decrement';

/**
 * Props for Quantity Input component
 */
export interface QuantityInputProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Custom render function when using asChild */
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLInputElement,
        {
          value: number;
          onChange: (value: number) => void;
        }
      >;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Input field for directly editing the quantity value.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Quantity.Input className="px-4 py-2 border text-center min-w-16 focus:ring-2" />
 *
 * // Custom rendering with forwardRef
 * <Quantity.Input asChild>
 *   {React.forwardRef(({value, onChange, ...props}, ref) => (
 *     <input
 *       ref={ref}
 *       {...props}
 *       type="number"
 *       value={value}
 *       onChange={(e) => onChange(parseInt(e.target.value) || 1)}
 *       className="custom-input-style"
 *       min="1"
 *     />
 *   ))}
 * </Quantity.Input>
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, QuantityInputProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      disabled = false,
      className,
      ...otherProps
    } = props;
    const { value, onValueChange } = useQuantityContext();

    const handleChange = (newValue: number) => {
      if (!isNaN(newValue) && newValue > 0) {
        onValueChange(newValue);
      }
    };

    const renderProps = {
      value,
      onChange: handleChange,
    };

    if (asChild && children) {
      return renderChildren({ children, props: renderProps, ref });
    }

    return (
      <input
        ref={ref}
        type="number"
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
        disabled={disabled}
        data-testid={TestIds.quantityInput}
        className={className}
        min="1"
        {...otherProps}
      />
    );
  },
);

Input.displayName = 'Quantity.Input';

/**
 * Props for Quantity Reset component
 */
export interface QuantityResetProps {
  /** children to render */
  children?:
    | string
    | React.ReactNode
    | React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Button to reset the quantity to its initial value.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Quantity.Reset className="px-3 py-2 text-sm text-red-600 hover:bg-red-50">
 *   Reset
 * </Quantity.Reset>
 *
 * // Custom rendering with forwardRef
 * <Quantity.Reset asChild>
 *   {React.forwardRef((props, ref) => (
 *     <button ref={ref} {...props} className="custom-reset-button">
 *       <RotateCcw className="h-4 w-4" />
 *     </button>
 *   ))}
 * </Quantity.Reset>
 * ```
 */
export const Reset = React.forwardRef<HTMLButtonElement, QuantityResetProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const { reset } = useQuantityContext();

    if (asChild && children) {
      return renderChildren({ children, props: {}, ref });
    }

    return (
      <button
        ref={ref}
        onClick={reset}
        data-testid={TestIds.quantityReset}
        className={className}
        {...otherProps}
      >
        {typeof children === 'string' ? children : 'Reset'}
      </button>
    );
  },
);

Reset.displayName = 'Quantity.Reset';
