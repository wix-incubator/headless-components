import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import { OptionContext } from "./Option.js";

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
const ChoiceContext = React.createContext<any>(null);

/**
 * Props for Choice Root component
 */
export interface ChoiceRootProps {
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      choice: Choice;
      onValueChange: (value: string) => void;
    }
  >;
}

export interface RootProps {
  choice?: Choice;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

/**
 * Root component that provides context for a single choice.
 * Supports both new render function API and legacy ReactNode API.
 *
 * @component
 * @example
 * ```tsx
 * // New API - render function (recommended)
 * <Choice.Root>
 *   {React.forwardRef(({choice, onValueChange, ...props}, ref) => (
 *     <div ref={ref} {...props} className="choice-wrapper">
 *       <span>{choice.name}</span>
 *       <button onClick={() => onValueChange(choice.name || '')}>
 *         Select
 *       </button>
 *     </div>
 *   ))}
 * </Choice.Root>
 *
 * // Legacy API - ReactNode (for Option.ChoiceRepeater compatibility)
 * <Choice.Root choice={choiceData} onValueChange={handleChange}>
 *   <Choice.Text />
 *   <Choice.Color />
 * </Choice.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, choice, onValueChange, ...otherProps } = props;

    // Get optionData from OptionContext (provided by Option.Root)
    const optionContext = React.useContext(OptionContext);
    const optionData = optionContext; // The entire context contains the optionData spread

    if (!optionData) {
      // Fallback when not used within Option context
      const getChoiceType = (): "color" | "text" | "free-text" => {
        if (choice?.colorCode) return "color";
        if (choice?.type === "free-text") return "free-text";
        return "text";
      };

      const choiceType = getChoiceType();
      const allowedTypes = ["color", "text", "free-text"];
      if (!allowedTypes.includes(choiceType)) {
        return null;
      }

      const contextValue = {
        choice,
        onValueChange,
        shouldRenderAsColor: choiceType === "color",
        shouldRenderAsText: choiceType === "text",
        shouldRenderAsFreeText: choiceType === "free-text",
        // Fallback values when not connected to ProductVariantSelector
        isSelected: false,
        isVisible: true,
        isInStock: true,
        isPreOrderEnabled: false,
        select: () => onValueChange?.(choice?.name || ""),
        value: choice?.name || "",
      };

      const attributes = {
        "data-testid": TestIds.choiceRoot,
        "data-type": choiceType,
        ...otherProps,
      };

      return (
        <ChoiceContext.Provider value={contextValue}>
          <div {...attributes} ref={ref}>
            {children}
          </div>
        </ChoiceContext.Provider>
      );
    }

    // When we have optionData, use ProductVariantSelector.Choice
    if (!choice) return null;

    return (
      <ProductVariantSelector.Choice option={optionData} choice={choice}>
        {(renderProps) => {
          const {
            value,
            isSelected,
            select,
            isVisible,
            isInStock,
            isPreOrderEnabled,
          } = renderProps;

          // Don't render if not visible
          if (!isVisible) return null;

          // Determine choice type
          const getChoiceType = (): "color" | "text" | "free-text" => {
            if (choice?.colorCode) return "color";
            if (choice?.type === "free-text") return "free-text";
            return "text";
          };

          const choiceType = getChoiceType();
          const allowedTypes = ["color", "text", "free-text"];
          if (!allowedTypes.includes(choiceType)) {
            return null;
          }

          // Create the context value with ProductVariantSelector render props
          const contextValue = {
            choice,
            onValueChange,
            shouldRenderAsColor: choiceType === "color",
            shouldRenderAsText: choiceType === "text",
            shouldRenderAsFreeText: choiceType === "free-text",
            // ProductVariantSelector render props
            isSelected,
            isVisible,
            isInStock,
            isPreOrderEnabled,
            select,
            value,
            optionData,
          };

          const attributes = {
            "data-testid": TestIds.choiceRoot,
            "data-type": choiceType,
            ...otherProps,
          };

          return (
            <ChoiceContext.Provider value={contextValue}>
              <div {...attributes} ref={ref}>
                {children}
              </div>
            </ChoiceContext.Provider>
          );
        }}
      </ProductVariantSelector.Choice>
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
 * ```
 *
 * Data Attributes:
 * - `data-testid="choice-text"` - Applied to choice buttons
 * - `data-selected` - Is Choice selected
 * - `disabled` - Is Choice disabled (not in stock)
 */
export const Text = React.forwardRef<HTMLButtonElement, TextProps>(
  (props, ref) => {
    const { asChild, children, className, ...buttonProps } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      // Fallback when not used within Option context
      const attributes = {
        "data-testid": TestIds.choiceText,
        "data-selected": "false",
        ...buttonProps,
      };

      if (asChild) {
        const rendered = renderAsChild({
          children,
          props: { id: "choice-id", value: "choice-value" },
          ref,
          content: "Choice Value",
          attributes,
        });
        if (rendered) return rendered;
      }

      return (
        <button
          className={className}
          {...attributes}
          ref={ref as React.Ref<HTMLButtonElement>}
        >
          Choice Value
        </button>
      );
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

    const choiceId = choice?.choiceId || choice?.key || choice?.name || "";

    const attributes = {
      "data-testid": TestIds.choiceText,
      "data-selected": isSelected ? "true" : "false",
      disabled: !isInStock && !isPreOrderEnabled,
      onClick: select,
      className: `px-4 py-2 border rounded-lg transition-all duration-200 ${
        isSelected ? "product-option-active" : "product-option-inactive"
      } ${className || ""}`,
      ...buttonProps,
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
      <div className="relative">
        <button {...attributes} ref={ref as React.Ref<HTMLButtonElement>}>
          {value}
        </button>
        {!isInStock && !isPreOrderEnabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              className="w-6 h-6 text-status-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);

Text.displayName = "Choice.Text";

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
 * ```
 *
 * Data Attributes:
 * - `data-testid="choice-color"` - Applied to color swatches
 * - `data-selected` - Is Choice selected
 * - `disabled` - Is Choice disabled (not in stock)
 */
export const Color = React.forwardRef<HTMLButtonElement, ColorProps>(
  (props, ref) => {
    const { asChild, children, className, ...buttonProps } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      // Fallback when not used within Option context
      const colorCode = "#ccc";
      const attributes = {
        "data-testid": TestIds.choiceColor,
        "data-selected": "false",
        style: { backgroundColor: colorCode },
        title: "Color Choice",
        ...buttonProps,
      };

      if (asChild) {
        const rendered = renderAsChild({
          children,
          props: {
            colorCode,
            name: "Color Choice",
            id: "choice-id",
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
          ref={ref as React.Ref<HTMLButtonElement>}
        />
      );
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

    const colorCode = choice?.colorCode || "#ccc";
    const choiceId = choice?.choiceId || choice?.key || choice?.name || "";

    const attributes = {
      "data-testid": TestIds.choiceColor,
      "data-selected": isSelected ? "true" : "false",
      disabled: !isInStock && !isPreOrderEnabled,
      onClick: select,
      style: { backgroundColor: colorCode },
      title: value,
      className: `w-10 h-10 rounded-full border-4 transition-all duration-200 ${
        isSelected
          ? "border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30"
          : "border-color-swatch hover:border-color-swatch-hover hover:scale-105"
      } ${!isInStock && !isPreOrderEnabled ? "grayscale" : ""} ${className || ""}`,
      ...buttonProps,
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
      <div className="relative">
        <button {...attributes} ref={ref as React.Ref<HTMLButtonElement>} />
        {!isInStock && !isPreOrderEnabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              className="w-6 h-6 text-status-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);

Color.displayName = "Choice.Color";

/**
 * Props for Choice FreeText component
 */
export interface FreeTextProps
  extends AsChildProps<{
      minCharCount?: number;
      maxCharCount?: number;
      defaultAddedPrice?: string | null;
      title?: string;
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
 * ```
 *
 * Data Attributes:
 * - `data-testid="choice-free-text"` - Applied to free text input
 * - `data-selected` - Is Choice selected
 * - `disabled` - Is Choice disabled (not in stock)
 */
export const FreeText = React.forwardRef<HTMLTextAreaElement, FreeTextProps>(
  (props, ref) => {
    const { asChild, children, className, ...textareaProps } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) {
      // Fallback when not used within Option context
      const attributes = {
        "data-testid": TestIds.choiceFreetext,
        "data-selected": "false",
        ...textareaProps,
      };

      if (asChild) {
        const rendered = renderAsChild({
          children,
          props: {
            minCharCount: 0,
            maxCharCount: 1000,
            defaultAddedPrice: null,
            title: "Free Text Input",
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
          placeholder="Enter custom text..."
          {...attributes}
        />
      );
    }

    const {
      choice,
      shouldRenderAsFreeText,
      onValueChange,
      optionData,
      isVisible,
    } = choiceContext;

    // Only render if this should be rendered as free text
    if (!shouldRenderAsFreeText) return null;

    // Don't render if not visible (handled by ProductVariantSelector in Root)
    if (!isVisible) return null;

    // For free text, we need to handle the input state
    const [value, setValue] = React.useState("");
    const optionName = optionData?.name || choice?.name || "text";

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
      value,
      onChange: handleChange,
      placeholder: `Enter custom ${optionName.toLowerCase()}...`,
      ...textareaProps,
    };

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: {
          minCharCount: choice?.minCharCount || 0,
          maxCharCount: choice?.maxCharCount || 1000,
          defaultAddedPrice: choice?.addedPrice || null,
          title: choice?.name || optionName,
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

FreeText.displayName = "Choice.FreeText";
// Note: ChoiceContext is imported from Option.tsx and re-exported there
