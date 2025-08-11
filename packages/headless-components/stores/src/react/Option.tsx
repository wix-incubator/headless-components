import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";

enum TestIds {
  optionRoot = "option-root",
  optionName = "option-name",
  optionChoices = "option-choices",
  choice = "choice",
  choiceText = "choice-text",
  choiceColor = "choice-color",
  choiceFreetext = "choice-freetext",
}

/**
 * Option data interface
 */
export interface Option {
  name: string;
}

/**
 * Props for Option Root component
 */
export interface OptionProps {
  option: Option;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  allowedTypes?: ("color" | "text" | "free-text")[]; // default - ['color', 'text', 'free-text'] - the types of the options to render
}

/**
 * Root props with asChild support
 */
export interface RootProps extends AsChildProps<OptionProps> {
  option: Option;
  onValueChange?: (value: string) => void;
  allowedTypes?: ("color" | "text" | "free-text")[];
}

/**
 * Root component that provides context for variant options.
 * Automatically detects and sets the option type based on the option name and available choices.
 *
 * @component
 *
  * **Data Attributes**
 * 
 * - `data-testid="option-root"` - Applied to option container (TestIds.optionRoot)
 * - `data-type` - The type of the option: 'color' | 'text' | 'free-text'
 * @example
 * ```tsx
 * // Color option (data-type="color")
 * <Option.Root
 *   option={{ name: "Color" }}
 *   onValueChange={(value) => console.log('Selected:', value)}
 * >
 *   <Option.Name />
 *   <Option.Choices>
 *     <Option.ChoiceRepeater>
 *       <Choice.Color />
 *     </Option.ChoiceRepeater>
 *   </Option.Choices>
 * </Option.Root>
 *
 * // Text option (data-type="text")
 * <Option.Root
 *   option={{ name: "Size" }}
 *   onValueChange={(value) => console.log('Selected:', value)}
 * >
 *   <Option.Name />
 *   <Option.Choices>
 *     <Option.ChoiceRepeater>
 *       <Choice.Text />
 *     </Option.ChoiceRepeater>
 *   </Option.Choices>
 * </Option.Root>
 *
 * // Free text option (data-type="free-text")
 * <Option.Root
 *   option={{ name: "Custom Text" }}
 *   onValueChange={(value) => console.log('Entered:', value)}
 * >
 *   <Option.Name />
 *   <Option.Choices>
 *     <Option.ChoiceRepeater>
 *       <Choice.FreeText />
 *     </Option.ChoiceRepeater>
 *   </Option.Choices>
 * </Option.Root>
 *
 * // With allowed types filter
 * <Option.Root
 *   option={{ name: "Size" }}
 *   allowedTypes={['text']}
 *   onValueChange={(value) => console.log('Selected size:', value)}
 * >
 *   <Option.Name />
 *   <Option.Choices>
 *     <Option.ChoiceRepeater>
 *       <Choice.Text />
 *     </Option.ChoiceRepeater>
 *   </Option.Choices>
 * </Option.Root>
 *
 * // asChild with react component
 * <Option.Root
 *   asChild
 *   option={{ name: "Color" }}
 *   onValueChange={(value) => console.log('Selected:', value)}
 * >
 *   {React.forwardRef(({option, onValueChange, allowedTypes, ...props}, ref) => (
 *     <section ref={ref} {...props} className="option-section">
 *       <h3>Option: {option.name}</h3>
 *       <p>Allowed types: {allowedTypes.join(', ')}</p>
 *       {props.children}
 *     </section>
 *   ))}
 * </Option.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const {
    asChild,
    children,
    option,
    onValueChange,
    allowedTypes = ["color", "text", "free-text"],
    ...otherProps
  } = props;

  return (
    <ProductVariantSelector.Option option={option}>
      {(optionData) => {
        // Determine the option type based on the option name and available choices
        const getOptionType = (): "color" | "text" | "free-text" => {
          const optionName = option.name.toLowerCase();
          const hasChoices =
            optionData.hasChoices && optionData.choices?.length > 0;

          if (!hasChoices) {
            return "free-text";
          }

          // Check if this is a color option by name or if choices have colorCode
          const isColorOption =
            optionName.includes("color") || optionName.includes("colour");
          const hasColorChoices = optionData.choices?.some(
            (choice: any) => choice.colorCode,
          );

          if (isColorOption || hasColorChoices) {
            return "color";
          }

          // Check if this is a free text option
          const isFreeTextOption =
            optionName.includes("text") || optionName.includes("custom");
          if (isFreeTextOption) {
            return "free-text";
          }

          // Default to text
          return "text";
        };

        const optionType = getOptionType();

        const contextValue = {
          ...optionData,
          type: "variant",
          optionType,
          onValueChange,
          allowedTypes,
        };

        const attributes = {
          "data-testid": TestIds.optionRoot,
          "data-type": optionType,
          ...otherProps,
        };

        const content = (
          <OptionContext.Provider value={contextValue}>
            {typeof children === "function"
              ? null
              : (children as React.ReactNode)}
          </OptionContext.Provider>
        );

        const optionProps: OptionProps = {
          option,
          children:
            typeof children === "function"
              ? null
              : (children as React.ReactNode),
          onValueChange,
          allowedTypes,
        };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: optionProps,
            ref,
            content,
            attributes,
          });
          if (rendered) return rendered;
        }

        return (
          <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
            {content}
          </div>
        );
      }}
    </ProductVariantSelector.Option>
  );
});

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
    "data-testid": TestIds.optionName,
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
export interface OptionChoicesProps {
  children: React.ReactNode;
}

/**
 * Props for Option Choices component with asChild support
 */
export interface ChoicesProps extends AsChildProps<OptionChoicesProps> {}

/**
 * A container for rendering the available choices for a given option (e.g., the set of color swatches, text buttons, or free text input for a variant or modifier option).
 * It does not render any UI by itself, but is used to group the available choices for an option.
 *
 * It is used to render the choices for an option, and is used to render the choices for an option.
 *
 * @component
 *
  * **Data Attributes**
 * 
 * - `data-testid="option-choices"` - Applied to choices container (TestIds.optionChoices)
 * - `data-type` - The type of the option 'color' | 'text' | 'free-text'
 *
 * @example
 * ```tsx
 * // Default usage
 * <Option.Choices>
 *   <Option.ChoiceRepeater>
 *     <Choice.Text />
 *     <Choice.Color />
 *   </Option.ChoiceRepeater>
 * </Option.Choices>
 *
 * // asChild with primitive
 * <Option.Choices asChild>
 *   <div className="choices-grid">
 *     <Option.ChoiceRepeater>
 *       <Choice.Text />
 *     </Option.ChoiceRepeater>
 *   </div>
 * </Option.Choices>
 *
 * // asChild with react component
 * <Option.Choices asChild>
 *   {React.forwardRef(({children, ...props}, ref) => (
 *     <section ref={ref} {...props} className="choices-section">
 *       <h4>Available Options</h4>
 *       {children}
 *     </section>
 *   ))}
 * </Option.Choices>
 * ```
 */
export const Choices = React.forwardRef<HTMLElement, ChoicesProps>(
  (props, ref) => {
    const { asChild, children } = props;
    const optionData = React.useContext(OptionContext);

    if (!optionData) return null;

    const attributes = {
      "data-testid": TestIds.optionChoices,
      "data-type": optionData.optionType || "text",
    };

    const content = (
      <ChoicesContext.Provider value={optionData}>
        {typeof children === "function" ? null : (children as React.ReactNode)}
      </ChoicesContext.Provider>
    );

    const choicesProps: OptionChoicesProps = {
      children:
        typeof children === "function" ? null : (children as React.ReactNode),
    };

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: choicesProps,
        ref,
        content,
        attributes,
      });
      if (rendered) return rendered;
    }

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {content}
      </div>
    );
  },
);

// Create a context for choices
const ChoicesContext = React.createContext<any>(null);

/**
 * Props for Option ChoiceRepeater component
 */
export interface ChoiceRepeaterProps extends AsChildProps<any> {}

/**
 * Repeater component that renders children for each choice.
 * Automatically filters and renders the appropriate choice type.
 *
 * @component
 */
export const ChoiceRepeater = React.forwardRef<
  HTMLElement,
  ChoiceRepeaterProps
>((props, ref) => {
  const { asChild, children } = props;
  const choicesData = React.useContext(ChoicesContext);

  if (!choicesData || !choicesData.choices?.length) return null;

  const allowedTypes = choicesData.allowedTypes || [
    "color",
    "text",
    "free-text",
  ];

  return (
    <>
      {choicesData.choices.map((choice: any) => {
        // Check if this is a color option
        const isColorOption = String(choicesData.name)
          .toLowerCase()
          .includes("color");
        const hasColorCode = choice.colorCode;

        // Check if this is a free text option
        const isFreeTextOption =
          choice.type === "free-text" ||
          String(choicesData.name).toLowerCase().includes("text") ||
          String(choicesData.name).toLowerCase().includes("custom");

        // Determine the choice type
        const shouldRenderAsColor = isColorOption && hasColorCode;
        const shouldRenderAsFreeText = isFreeTextOption;
        const shouldRenderAsText =
          !shouldRenderAsColor && !shouldRenderAsFreeText;

        // Check if this choice type is allowed
        const choiceType = shouldRenderAsColor
          ? "color"
          : shouldRenderAsFreeText
            ? "free-text"
            : "text";

        if (!allowedTypes.includes(choiceType)) {
          return null; // Skip this choice if its type is not allowed
        }

        const attributes = {
          "data-testid": TestIds.choice,
          "data-type":
            choice.type ||
            (shouldRenderAsColor
              ? "color"
              : shouldRenderAsText
                ? "text"
                : "free-text"),
        };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: choice,
            ref,
            content: null,
            attributes,
          });
          if (rendered) {
            return (
              <ChoiceContext.Provider
                key={choice.name || choice.value || choice.id}
                value={{
                  choice,
                  optionData: choicesData,
                  shouldRenderAsColor,
                  shouldRenderAsText,
                  shouldRenderAsFreeText,
                }}
              >
                {rendered}
              </ChoiceContext.Provider>
            );
          }
        }

        return (
          <ChoiceContext.Provider
            key={choice.name || choice.value || choice.id}
            value={{
              choice,
              optionData: choicesData,
              shouldRenderAsColor,
              shouldRenderAsText,
              shouldRenderAsFreeText,
            }}
          >
            <div {...attributes}>
              {typeof children === "function"
                ? null
                : (children as React.ReactNode)}
            </div>
          </ChoiceContext.Provider>
        );
      })}
    </>
  );
});

// Create a context for individual choices
const ChoiceContext = React.createContext<any>(null);

// Export the context so it can be used by other components
export { ChoiceContext };

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
    const { asChild, children, className, ...buttonProps } = props;
    const choiceContext = React.useContext(ChoiceContext);

    if (!choiceContext) return null;

    const { choice, optionData, shouldRenderAsText } = choiceContext;

    // Only render if this should be rendered as text
    if (!shouldRenderAsText) return null;

    // Handle variant choices only
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

          const handleClick = () => {
            select();
            if (optionData.onValueChange) {
              optionData.onValueChange(value);
            }
          };

          const attributes = {
            "data-testid": TestIds.choiceText,
            "data-selected": isSelected ? "true" : "false",
            onClick: handleClick,
            ...buttonProps,
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
      const { asChild, children, className, ...buttonProps } = props;
      const choiceContext = React.useContext(ChoiceContext);

      if (!choiceContext) return null;

      const { choice, optionData, shouldRenderAsColor } = choiceContext;

      // Only render if this should be rendered as color
      if (!shouldRenderAsColor) return null;

      // Handle variant choices only
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

            const handleClick = () => {
              select();
              if (optionData.onValueChange) {
                optionData.onValueChange(value);
              }
            };

            const colorCode = choice.colorCode || "#ccc";
            const attributes = {
              "data-testid": TestIds.choiceColor,
              "data-selected": isSelected ? "true" : "false",
              onClick: handleClick,
              style: { backgroundColor: colorCode },
              title: value,
              className: `${className} ${!isInStock && !isPreOrderEnabled ? "grayscale" : ""}`,
              ...buttonProps,
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

  /**
   * Props for Choice FreeText component
   */
  export interface FreeTextProps
    extends AsChildProps<{ value: string; onChange: (value: string) => void }> {
    /** Custom placeholder text */
    placeholder?: string;
  }

  /**
   * Free text input choice component for variant options.
   * This component handles free text input for product variants.
   *
   * @component
   * @example
   * ```tsx
   * // Default usage
   * <Choice.FreeText placeholder="Enter custom text..." />
   *
   * // asChild with primitive
   * <Choice.FreeText asChild placeholder="Custom input">
   *   <input type="text" className="custom-input" />
   * </Choice.FreeText>
   *
   * // asChild with react component
   * <Choice.FreeText asChild>
   *   {React.forwardRef(({value, onChange, ...props}, ref) => (
   *     <div className="custom-wrapper">
   *       <input
   *         ref={ref}
   *         {...props}
   *         value={value}
   *         onChange={(e) => onChange(e.target.value)}
   *         className="custom-input"
   *       />
   *     </div>
   *   ))}
   * </Choice.FreeText>
   * ```
   */
  export const FreeText = React.forwardRef<HTMLElement, FreeTextProps>(
    (props, ref) => {
      const { asChild, children, placeholder } = props;
      const choiceContext = React.useContext(ChoiceContext);

      if (!choiceContext) return null;

      const { optionData } = choiceContext;

      // For variant options, we don't have a direct free text choice
      // This would typically be handled by ProductModifiers for free text
      // But we'll provide a basic implementation for consistency
      const [value, setValue] = React.useState("");
      const optionName = optionData.name || "";

      const handleChange = (newValue: string) => {
        setValue(newValue);
        if (optionData.onValueChange) {
          optionData.onValueChange(newValue);
        }
        // In a real implementation, this would update the variant service
        // For now, we'll just handle the local state
      };

      const attributes = {
        "data-testid": TestIds.choiceFreetext,
        placeholder:
          placeholder || `Enter custom ${optionName.toLowerCase()}...`,
      };

      if (asChild) {
        const rendered = renderAsChild({
          children,
          props: { value, onChange: handleChange },
          ref,
          content: null,
          attributes,
        });
        if (rendered) return rendered;
      }

      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          {...attributes}
        />
      );
    },
  );
}
