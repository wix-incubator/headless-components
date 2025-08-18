import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface AsChildProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Hook for determining the correct component to render based on asChild prop
 *
 * @param asChild - Whether to use Slot for composition
 * @param defaultElement - The default HTML element to render (e.g., "button", "div")
 * @returns The component to render (either Slot or the default element)
 *
 * @example
 * ```tsx
 * function Button({ asChild, className, children, ...props }) {
 *   const Comp = useAsChild(asChild, "button");
 *   return <Comp className={className} {...props}>{children}</Comp>;
 * }
 *
 * // Usage without asChild - renders as button
 * <Button onClick={handleClick}>Click me</Button>
 *
 * // Usage with asChild - renders as link with button behavior
 * <Button asChild>
 *   <a href="/contact">Contact</a>
 * </Button>
 * ```
 */
export function useAsChild(asChild?: boolean, defaultElement = 'div') {
  return asChild ? Slot : defaultElement;
}
