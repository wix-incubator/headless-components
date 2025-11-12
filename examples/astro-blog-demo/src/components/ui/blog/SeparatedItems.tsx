import { cn } from "@/lib/utils";
import React from "react";

export interface SeparatedItemsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The child elements to be displayed with separators */
  children: React.ReactNode;
}

/**
 * A layout component that displays child elements with bullet separators between them.
 *
 * @example
 * ```tsx
 * <SeparatedItems>
 *   <span>Published</span>
 *   <span>5 min read</span>
 *   <span>Technology</span>
 * </SeparatedItems>
 * ```
 */
export const SeparatedItems = React.forwardRef<
  HTMLDivElement,
  SeparatedItemsProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex items-center gap-x-1 sm:gap-x-2 [&>*:not(:first-child)]:before:me-1 [&>*:not(:first-child)]:before:content-["•"] sm:[&>*:not(:first-child)]:before:me-2',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

SeparatedItems.displayName = "SeparatedItems";
