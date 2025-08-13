import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";

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
}

// Create a context for individual choices
export const ChoiceContext = React.createContext<any>(null);

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

    const choiceId = choice?.choiceId;

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
          colorCode,
          name: value,
          id: choiceId,
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

    const { choice, shouldRenderAsFreeText, onValueChange, isVisible } =
      choiceContext;

    // Only render if this should be rendered as free text
    if (!shouldRenderAsFreeText) return null;

    // Don't render if not visible (handled by ProductVariantSelector in Root)
    if (!isVisible) return null;

    // For free text, we need to handle the input state
    const [value, setValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // Call the onValueChange callback to notify parent components
      if (onValueChange) {
        onValueChange(e.target.value);
      }
    };

    const isSelected = Boolean(value.trim());

    const attributes = {
      "data-testid": TestIds.choiceFreetext,
      "data-selected": isSelected ? "true" : "false",
      onChange: handleChange,
    };

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: {
          minCharCount: choice?.minCharCount,
          maxCharCount: choice?.maxCharCount,
          defaultAddedPrice: choice?.addedPrice,
          title: choice?.name,
          onChange: handleChange,
        },
        ref,
        content: null,
        attributes,
      });
      if (rendered) return rendered;
    }

    return <textarea ref={ref} className={className} {...attributes} />;
  },
);
