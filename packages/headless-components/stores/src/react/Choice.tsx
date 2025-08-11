import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import { ChoiceContext } from "./Option.js";

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
        "data-testid": "choice-text",
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

    const { choice, optionData, shouldRenderAsText } = choiceContext;

    // Only render if this should be rendered as text
    if (!shouldRenderAsText) return null;

    // Handle variant choices using the existing ProductVariantSelector
    return (
      <ProductVariantSelector.Choice option={optionData} choice={choice}>
        {({
          value,
          isSelected,
          select,
          isVisible,
          isInStock,
          isPreOrderEnabled,
        }) => {
          if (!isVisible) return null;

          const attributes = {
            "data-testid": "choice-text",
            "data-selected": isSelected ? "true" : "false",
            disabled: !isInStock && !isPreOrderEnabled,
            onClick: select,
            ...buttonProps,
          };

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { id: choice.id || choice.name || "", value },
              ref,
              content: value,
              attributes,
            });
            if (rendered) return rendered;
          }

          return (
            <>
              <button
                className={className}
                {...attributes}
                ref={ref as React.Ref<HTMLButtonElement>}
              >
                {value}
              </button>
              {/* Out of stock overlay */}
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
            </>
          );
        }}
      </ProductVariantSelector.Choice>
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
        "data-testid": "choice-color",
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

    const { choice, optionData, shouldRenderAsColor } = choiceContext;

    // Only render if this should be rendered as color
    if (!shouldRenderAsColor) return null;

    // Handle variant choices using the existing ProductVariantSelector
    return (
      <ProductVariantSelector.Choice option={optionData} choice={choice}>
        {({
          value,
          isSelected,
          select,
          isVisible,
          isInStock,
          isPreOrderEnabled,
        }) => {
          if (!isVisible) return null;

          const colorCode = choice.colorCode || "#ccc";
          const attributes = {
            "data-testid": "choice-color",
            "data-selected": isSelected ? "true" : "false",
            disabled: !isInStock && !isPreOrderEnabled,
            onClick: select,
            style: { backgroundColor: colorCode },
            title: value,
            className: `${className} ${!isInStock && !isPreOrderEnabled ? "grayscale" : ""}`,
            ...buttonProps,
          };

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: {
                colorCode,
                name: value,
                id: choice.id || choice.name || "",
              },
              ref,
              content: null,
              attributes,
            });
            if (rendered) return rendered;
          }

          return (
            <>
              <button
                {...attributes}
                ref={ref as React.Ref<HTMLButtonElement>}
              />
              {/* Out of stock overlay */}
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
            </>
          );
        }}
      </ProductVariantSelector.Choice>
    );
  },
);

Color.displayName = "Choice.Color";

// Note: ChoiceContext is imported from Option.tsx and re-exported there
