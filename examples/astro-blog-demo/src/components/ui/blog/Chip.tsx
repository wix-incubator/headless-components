import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const chipVariants = cva(
  "focus-visible:ring-ring inline-flex items-center rounded-full border text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-surface-subtle text-foreground px-3 py-1 leading-relaxed",
        secondary:
          "border-surface-strong text-foreground px-3 py-1 leading-tight",
      },
      size: {
        default: "text-sm",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * A flexible chip component for displaying tags, categories, or labels.
 * Supports different variants and sizes with optional composition using Radix Slot.
 *
 * @example
 * ```tsx
 * <Chip variant="default" size="sm">Tag</Chip>
 * <Chip variant="secondary" asChild>
 *   <a href="/category/tech">Technology</a>
 * </Chip>
 * ```
 */
export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  /** When true, renders the chip as a child component using Radix Slot */
  asChild?: boolean;
}

/**
 * Chip component for displaying tags, categories, or labels with customizable styling.
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        className={cn(chipVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";
