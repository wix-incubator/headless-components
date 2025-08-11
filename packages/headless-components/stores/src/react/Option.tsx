import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";

/**
 * Props for Option Root component
 */
export interface RootProps {
  children: React.ReactNode;
  option?: any;
}

/**
 * Root component that provides context for variant options.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  if (props.option) {
    return (
      <ProductVariantSelector.Option option={props.option}>
        {(optionData) => (
          <OptionContext.Provider value={{ ...optionData, type: "variant" }}>
            {props.children}
          </OptionContext.Provider>
        )}
      </ProductVariantSelector.Option>
    );
  }

  return props.children;
}

// Create a context to pass option data down
const OptionContext = React.createContext<any>(null);

/**
 * Props for Option Name component
 */
export interface NameProps extends AsChildProps<{ name: string }> {}

/**
 * Displays the option name.
 *
 * @component
 * @example
 * ```tsx
 * <Option.Name className="text-lg font-medium mb-3" />
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className } = props;
  const optionData = React.useContext(OptionContext);

  if (!optionData) return null;

  const name = optionData.name || "";
  const attributes = {
    "data-testid": "option-name",
  };

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { name },
      ref,
      content: name,
      attributes,
    });
    if (rendered) return rendered;
  }

  return (
    <div
      className={className}
      {...attributes}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {name}
    </div>
  );
});

/**
 * Props for Option Choices component
 */
export interface ChoicesProps {
  children: React.ReactNode;
}

/**
 * Container for option choices.
 *
 * @component
 */
export function Choices(props: ChoicesProps): React.ReactNode {
  const optionData = React.useContext(OptionContext);

  if (!optionData || !optionData.hasChoices) return null;

  return (
    <ChoicesContext.Provider value={optionData}>
      {props.children}
    </ChoicesContext.Provider>
  );
}

// Create a context for choices
const ChoicesContext = React.createContext<any>(null);

/**
 * Props for Option ChoiceRepeater component
 */
export interface ChoiceRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each choice.
 *
 * @component
 */
export function ChoiceRepeater(props: ChoiceRepeaterProps): React.ReactNode {
  const choicesData = React.useContext(ChoicesContext);

  if (!choicesData || !choicesData.choices?.length) return null;

  return (
    <>
      {choicesData.choices.map((choice: any) => (
        <ChoiceContext.Provider
          key={choice.name || choice.value || choice.id}
          value={{ choice, optionData: choicesData }}
        >
          {props.children}
        </ChoiceContext.Provider>
      ))}
    </>
  );
}

// Create a context for individual choices
const ChoiceContext = React.createContext<any>(null);

/**
 * Choice namespace for choice-specific components
 */
export namespace Choice {
  /**
   * Props for Choice Text component
   */
  export interface TextProps
    extends AsChildProps<{ value: string; isSelected: boolean }> {}

  /**
   * Text-based choice component.
   *
   * @component
   */
  export const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
    const { asChild, children, className } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) return null;

    const { choice, optionData } = choiceContext;

    // Handle variant choices only
    return (
      <ProductVariantSelector.Choice option={optionData} choice={choice}>
        {({ value, isSelected, select, isVisible }) => {
          if (!isVisible) return null;

          const attributes = {
            "data-testid": "choice-text",
            "data-selected": isSelected,
            onClick: select,
          };

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { value, isSelected },
              ref,
              content: value,
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
              {value}
            </button>
          );
        }}
      </ProductVariantSelector.Choice>
    );
  });

  /**
   * Props for Choice Color component
   */
  export interface ColorProps
    extends AsChildProps<{ colorCode: string; isSelected: boolean }> {}

  /**
   * Color swatch choice component.
   *
   * @component
   */
  export const Color = React.forwardRef<HTMLElement, ColorProps>(
    (props, ref) => {
      const { asChild, children, className } = props;
      const choiceContext = React.useContext(ChoiceContext);

      if (!choiceContext) return null;

      const { choice, optionData } = choiceContext;

      // Handle variant choices only
      return (
        <ProductVariantSelector.Choice option={optionData} choice={choice}>
          {({ value, isSelected, select, isVisible }) => {
            if (!isVisible) return null;

            const colorCode = choice.colorCode || "#ccc";
            const attributes = {
              "data-testid": "choice-color",
              "data-selected": isSelected,
              onClick: select,
              style: { backgroundColor: colorCode },
              title: value,
            };

            if (asChild) {
              const rendered = renderAsChild({
                children,
                props: { colorCode, isSelected },
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
          }}
        </ProductVariantSelector.Choice>
      );
    },
  );
}
