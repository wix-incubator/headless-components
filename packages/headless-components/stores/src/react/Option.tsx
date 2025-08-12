import React from "react";
import { renderAsChild, type AsChildProps } from "../utils/index.js";
import * as ProductVariantSelector from "./core/ProductVariantSelector.js";
import * as Choice from "./Choice.js";

enum TestIds {
  optionRoot = "option-root",
  optionName = "option-name",
  optionChoices = "option-choices",
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
 * Props for Option Choices component
 */
export interface ChoicesProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode; // ✅ Always include emptyState support
}

/**
 * Container for the list items with empty state support.
 * Follows List Container Level pattern (inspired by Product.VariantOptions).
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
 * // Default usage with empty state
 * <Option.Choices emptyState={<div>No choices available</div>}>
 *   <Option.ChoiceRepeater>
 *     <Choice.Text />
 *     <Choice.Color />
 *   </Option.ChoiceRepeater>
 * </Option.Choices>
 *
 * // Simple container usage
 * <Option.Choices emptyState={<div>No choices</div>}>
 *   <div className="choices-grid">
 *     <Option.ChoiceRepeater>
 *       <Choice.Text />
 *     </Option.ChoiceRepeater>
 *   </div>
 * </Option.Choices>
 * ```
 */
export const Choices = React.forwardRef<HTMLElement, ChoicesProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const optionData = React.useContext(OptionContext);

    if (!optionData) return null;

    // Check if we have choices to render (List Container Level pattern)
    const hasChoices = optionData.choices && optionData.choices.length > 0;

    if (!hasChoices) {
      return emptyState || null; // ✅ Handle empty state like VariantOptions
    }

    const attributes = {
      "data-testid": TestIds.optionChoices,
      "data-type": optionData.optionType || "text",
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
      </div>
    );
  },
);

/**
 * Props for Option ChoiceRepeater component
 */
export interface ChoiceRepeaterProps {
  children:
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          choice: any; // Will be defined in Choice.tsx
          onValueChange: (value: string) => void;
        }
      >
    | React.ReactNode; // For backward compatibility
}

/**
 * Repeater component that renders Choice.Root for each choice.
 * Inspired by Product.VariantOptionRepeater pattern.
 *
 * @component
 *
 * @example
 * ```tsx
 * // New API: Render function with choice data
 * <Option.ChoiceRepeater>
 *   {React.forwardRef(({ choice, onValueChange }, ref) => (
 *     <button
 *       ref={ref}
 *       onClick={() => onValueChange(choice.name || '')}
 *       className="choice-button"
 *     >
 *       {choice.name}
 *     </button>
 *   ))}
 * </Option.ChoiceRepeater>
 *
 * // Backward compatibility: Regular children (import from Choice.tsx)
 * import { Text, Color, FreeText } from './Choice.js';
 * <Option.ChoiceRepeater>
 *   <Text />
 *   <Color />
 *   <FreeText />
 * </Option.ChoiceRepeater>
 *
 * // asChild usage with render function
 * <Option.ChoiceRepeater asChild>
 *   {React.forwardRef(({ choice, onValueChange }, ref) => (
 *     <div ref={ref} className="custom-choice-wrapper">
 *       <span>{choice.name}</span>
 *       <button onClick={() => onValueChange(choice.name || '')}>
 *         Select
 *       </button>
 *     </div>
 *   ))}
 * </Option.ChoiceRepeater>
 * ```
 */
export const ChoiceRepeater = React.forwardRef<
  HTMLElement,
  ChoiceRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const optionData = React.useContext(OptionContext);

  if (!optionData || !optionData.choices?.length) return null;

  const onValueChange = optionData.onValueChange || (() => {});

  return (
    <>
      {optionData.choices.map((choice: any) => {
        const choiceKey = choice.key || choice.name || choice.id;

        // Handle both function children (new API) and regular children (backward compatibility)
        if (typeof children === "function") {
          // New API: render function with choice data - let the function handle the logic
          return children(
            {
              choice,
              onValueChange,
            },
            _ref,
          );
        }

        // Backward compatibility: render Choice.Root for each choice (like VariantOptionRepeater)
        // Let Choice.Root handle all the choice logic (type detection, filtering, etc.)
        return (
          <Choice.Root
            key={choiceKey}
            rawChoice={choice}
            optionData={optionData}
            onValueChange={onValueChange}
          >
            {children as React.ReactElement}
          </Choice.Root>
        );
      })}
    </>
  );
});
