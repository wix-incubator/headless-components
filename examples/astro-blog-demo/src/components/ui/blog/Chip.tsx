import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const chipVariants = cva(
  "inline-flex items-center rounded-full border border-foreground/20 px-3 py-1 text-sm font-medium text-foreground transition-colors",
  {
    variants: {
      size: {
        default: "text-sm leading-relaxed",
        sm: "px-2 text-xs leading-tight",
      },
    },
    defaultVariants: {
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
 * <Chip size="sm">Tag</Chip>
 * <Chip asChild>
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
  ({ className, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        className={cn(chipVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";
