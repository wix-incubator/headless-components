import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-paragraph font-medium text-foreground transition-colors",
  {
    variants: {
      size: {
        md: "px-3 py-2 text-sm leading-none",
        sm: "px-2 py-1 text-xs leading-none",
      },
      variant: {
        primary: "border border-foreground/20",
        secondary: "border border-transparent bg-foreground/5",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
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
  ({ className, size, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        className={cn(chipVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";
