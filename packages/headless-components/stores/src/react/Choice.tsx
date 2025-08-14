import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import { FreeText as FreeTextPrimitive } from "./core/ProductModifiers.js";

enum TestIds {
  choiceRoot = "choice-root",
  choiceText = "choice-text",
  choiceColor = "choice-color",
  choiceFreetext = "choice-freetext",
}

/**
 * Choice data interface
 */
export interface Choice {
  colorCode?: string;
  choiceId?: string | null;
  linkedMedia?: any[]; // ProductMedia[] - will be updated when ProductMedia is available
  type?: "color" | "text" | "free-text";
  key?: string;
  name?: string | null;
  addedPrice?: string | null;
  minCharCount?: number;
  maxCharCount?: number;
}

/**
 * Context value interface for individual choice data and behavior
 */
export interface ChoiceContextValue {
  /** The choice data object */
  choice: Choice;
  /** Whether this choice should render as text */
  shouldRenderAsText: boolean;
  /** Whether this choice should render as color swatch */
  shouldRenderAsColor: boolean;
  /** Whether this choice should render as free text input */
  shouldRenderAsFreeText: boolean;
  /** Display value for the choice */
  value: string;
  /** Whether this choice is currently selected */
  isSelected: boolean;
  /** Whether this choice is visible based on current selections */
  isVisible: boolean;
  /** Whether this choice is in stock */
  isInStock: boolean;
  /** Whether this choice is available for pre-order */
  isPreOrderEnabled: boolean;
  /** Function to select this choice */
  select: () => void;
  /** Callback for free text value changes */
  onValueChange?: (value: string) => void;
}

// Create a context for individual choices
export const ChoiceContext = React.createContext<ChoiceContextValue | null>(
  null,
);

/**
 * Hook to access ChoiceContext with proper error handling
 * @throws {Error} When used outside of a Choice context provider
 * @returns {ChoiceContextValue} The choice context value
 */
export function useChoiceContext(): ChoiceContextValue {
  const context = React.useContext(ChoiceContext);
  if (!context) {
    throw new Error(
      "useChoiceContext must be used within a Choice context provider (Option.ChoiceRepeater)",
    );
  }
  return context;
}

export interface RootProps {
  children?: React.ReactNode;
}

/**
 * Root component that consumes ChoiceContext provided by Option.ChoiceRepeater.
 *
 * @component
 * @example
 * ```tsx
 * <Choice.Root>
 *   <Choice.Text />
 *   <Choice.Color />
 * </Choice.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      return null; // Should be used within Option.ChoiceRepeater
    }

    const { choice } = choiceContext;

    // Determine choice type for data-type attribute
    const getChoiceType = (): "color" | "text" | "free-text" => {
      if (choice?.colorCode) return "color";
      if (choice?.type === "free-text") return "free-text";
      return "text";
    };

    const choiceType = getChoiceType();

    const attributes = {
      "data-testid": TestIds.choiceRoot,
      "data-type": choiceType,
    };

    return (
      <div {...attributes} ref={ref}>
        {children}
      </div>
    );
  },
);
/**
 * Props for Choice Text component
 */
export interface TextProps
  extends AsChildProps<{ id: string; value: string }> {}

/**
 * Text-based choice button.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Choice.Text className="px-4 py-2 border rounded-lg" />
 *
 * // asChild with primitive
 * <Choice.Text asChild>
 *   <button className="px-4 py-2 border rounded-lg" />
 * </Choice.Text>
 *
 * // asChild with react component
 * <Choice.Text asChild>
 *   {React.forwardRef(({id, value, ...props}, ref) => (
 *     <button ref={ref} {...props} className="px-4 py-2 border rounded-lg">
 *       {value}
 *     </button>
 *   ))}
 * </Choice.Text>
 * ```
 *
 * Data Attributes:
 * - `data-testid="choice-text"` - Applied to choice buttons
 * - `data-selected` - Is Choice selected
 * - `disabled` - Is Choice disabled (not in stock)
 */
export const Text = React.forwardRef<HTMLButtonElement, TextProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      return null; // Should be used within Option.ChoiceRepeater
    }

    const {
      choice,
      shouldRenderAsText,
      value,
      isSelected,
      select,
      isVisible,
      isInStock,
      isPreOrderEnabled,
    } = choiceContext;

    // Only render if this should be rendered as text
    if (!shouldRenderAsText) return null;

    // Don't render if not visible (handled by ProductVariantSelector in Root)
    if (!isVisible) return null;

    const choiceId = choice?.choiceId || "";

    const attributes = {
      "data-testid": TestIds.choiceText,
      "data-selected": isSelected ? "true" : "false",
      disabled: !isInStock && !isPreOrderEnabled,
      onClick: select,
    };

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: { id: choiceId, value },
        ref,
        content: value,
        attributes,
      });
      if (rendered) return rendered;
    }

    return (
      <button className={className} {...attributes} ref={ref}>
        {value}
      </button>
    );
  },
);

/**
 * Props for Choice Color component
 */
export interface ColorProps
  extends AsChildProps<{ colorCode: string; name: string; id: string }> {}

/**
 * Color swatch choice.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Choice.Color className="w-10 h-10 rounded-full border-4" />
 *
 * // asChild with primitive
 * <Choice.Color asChild>
 *   <button className="w-10 h-10 rounded-full border-4" />
 * </Choice.Color>
 *
 * // asChild with react component
 * <Choice.Color asChild>
 *   {React.forwardRef(({colorCode, name, id, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       className="w-10 h-10 rounded-full border-4"
 *       style={{ backgroundColor: colorCode }}
 *       title={name}
 *     />
 *   ))}
 * </Choice.Color>
 * ```
 *
 * Data Attributes:
 * - `data-testid="choice-color"` - Applied to color swatches
 * - `data-selected` - Is Choice selected
 * - `disabled` - Is Choice disabled (not in stock)
 */
export const Color = React.forwardRef<HTMLButtonElement, ColorProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      return null; // Should be used within Option.ChoiceRepeater
    }

    const {
      choice,
      shouldRenderAsColor,
      value,
      isSelected,
      select,
      isVisible,
      isInStock,
      isPreOrderEnabled,
    } = choiceContext;

    // Only render if this should be rendered as color
    if (!shouldRenderAsColor) return null;

    // Don't render if not visible (handled by ProductVariantSelector in Root)
    if (!isVisible) return null;

    const { colorCode, choiceId } = choice;

    const attributes = {
      "data-testid": TestIds.choiceColor,
      "data-selected": isSelected ? "true" : "false",
      disabled: !isInStock && !isPreOrderEnabled,
      onClick: select,
    };

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: {
          colorCode: colorCode || "",
          name: value,
          id: choiceId || "",
        },
        ref,
        content: null,
        attributes,
      });
      if (rendered) return rendered;
    }

    return (
      <button
        className={className}
        {...attributes}
        ref={ref}
        style={{ backgroundColor: colorCode }}
        title={value}
      />
    );
  },
);

/**
 * Props for Choice FreeText component
 */
export interface FreeTextProps
  extends AsChildProps<{
      minCharCount?: number;
      maxCharCount?: number;
      defaultAddedPrice?: string | null;
      title?: string;
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }>,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> {}

/**
 * Provides a free text input for variant selection.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Choice.FreeText className="p-3 border rounded-lg" />
 *
 * // asChild with primitive
 * <Choice.FreeText asChild>
 *   <textarea className="p-3 border rounded-lg" />
 * </Choice.FreeText>
 *
 * // asChild with react component
 * <Choice.FreeText asChild>
 *   {React.forwardRef(({value, onChange, title, ...props}, ref) => (
 *     <textarea
 *       ref={ref}
 *       {...props}
 *       className="p-3 border rounded-lg"
 *       value={value}
 *       onChange={onChange}
 *       placeholder={`Enter custom ${title}...`}
 *     />
 *   ))}
 * </Choice.FreeText>
 * ```
 *
 * Data Attributes:
 * - `data-testid="choice-free-text"` - Applied to free text input
 * - `data-selected` - Is Choice selected
 */
export const FreeText = React.forwardRef<HTMLTextAreaElement, FreeTextProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      return null; // Should be used within Option.ChoiceRepeater
    }

    const {
      choice,
      shouldRenderAsFreeText,
      onValueChange,
      isVisible,
      isSelected,
    } = choiceContext;

    // Only render if this should be rendered as free text
    if (!shouldRenderAsFreeText) return null;

    // Don't render if not visible (handled by ProductVariantSelector in Root)
    if (!isVisible) return null;

    const attributes = {
      "data-testid": TestIds.choiceFreetext,
      "data-selected": isSelected ? "true" : "false",
    };

    console.log("choice", choice);

    return (
      <FreeTextPrimitive modifier={choice}>
        {({ value, setText, placeholder, maxChars }) => {
          const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(e.target.value);
            if (onValueChange) {
              onValueChange(e.target.value);
            }
          };

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: {
                minCharCount: choice?.minCharCount,
                maxCharCount: choice?.maxCharCount,
                defaultAddedPrice: choice?.addedPrice || undefined,
                title: choice?.name || undefined,
                onChange: handleChange,
              },
              ref,
              content: null,
              attributes,
            });
            if (rendered) return rendered;
          }

          return (
            <textarea
              ref={ref}
              className={className}
              placeholder={placeholder}
              rows={3}
              value={value}
              maxLength={maxChars}
              {...attributes}
              onChange={handleChange}
            />
          );
        }}
      </FreeTextPrimitive>
    );
  },
);
