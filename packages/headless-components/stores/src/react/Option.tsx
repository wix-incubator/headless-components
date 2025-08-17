import {
  type ConnectedModifierChoice,
  type ConnectedOptionChoice,
} from '@wix/auto_sdk_stores_products-v-3';
import React from 'react';
import { renderAsChild, type AsChildProps } from '../utils/index.js';
import * as Choice from './Choice.js';
import * as ProductModifiersPrimitive from './core/ProductModifiers.js';
import * as ProductVariantSelectorPrimitive from './core/ProductVariantSelector.js';

enum TestIds {
  optionRoot = 'option-root',
  optionName = 'option-name',
  optionMandatoryIndicator = 'option-mandatory-indicator',
  optionChoices = 'option-choices',
}

export interface Option {
  name: string;
  choices?: any[];
  hasChoices?: boolean;
  type?: string;
  mandatory?: boolean;
}

/**
 * Root props with asChild support
 */
export interface RootProps
  extends AsChildProps<{
    option: Option;
    onValueChange?: (value: string) => void;
    allowedTypes?: ('color' | 'text' | 'free-text')[];
  }> {
  option: Option;
  onValueChange?: (value: string) => void;
  allowedTypes?: ('color' | 'text' | 'free-text')[];
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
  const { asChild, children, option, onValueChange, allowedTypes } = props;

  // Determine the option type based on the option name and available choices
  const getOptionType = (): 'color' | 'text' | 'free-text' => {
    if (option.type === 'FREE_TEXT') {
      return 'free-text';
    }

    if (
      option.hasChoices &&
      option.choices?.some(
        (choice: ConnectedOptionChoice | ConnectedModifierChoice) =>
          choice.colorCode,
      )
    ) {
      return 'color';
    }

    return 'text';
  };

  const optionType = getOptionType();

  const contextValue = {
    ...option,
    optionType,
    onValueChange,
    allowedTypes,
    mandatory: option?.mandatory || false,
  };

  const attributes = {
    'data-testid': TestIds.optionRoot,
    'data-type': optionType,
  };

  const content = (
    <OptionContext.Provider value={contextValue}>
      {typeof children === 'function' ? null : (children as React.ReactNode)}
    </OptionContext.Provider>
  );

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { option, onValueChange, allowedTypes },
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
});

// Create a context to pass option data down
export const OptionContext = React.createContext<any>(null);

/**
 * Props for Option Name component
 */
export interface NameProps extends AsChildProps<{ name: string }> {}

/**
 * Displays the option name.
 * Follows true Radix pattern - use separate components for each styleable element.
 *
 * @component
 * @example
 * ```tsx
 * // True Radix pattern - separate components
 * <div className="flex items-center gap-1">
 *   <Option.Name className="text-lg font-medium" />
 *   <Option.MandatoryIndicator className="text-red-500" />
 * </div>
 *
 * // Custom rendering
 * <Option.Name asChild>
 *   {React.forwardRef<HTMLElement, { name: string }>(({ name, ...props }, ref) => (
 *     <h4 ref={ref} {...props} className="text-lg font-medium text-content-primary">
 *       {name}
 *     </h4>
 *   ))}
 * </Option.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className } = props;
  const optionData = React.useContext(OptionContext);

  if (!optionData) return null;

  const name = optionData.name || '';

  const attributes = {
    'data-testid': TestIds.optionName,
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
 * Props for Option MandatoryIndicator component
 */
export interface MandatoryIndicatorProps
  extends AsChildProps<{ mandatory: boolean }> {}

/**
 * Displays the mandatory indicator (asterisk) when the option is required.
 * Follows true Radix pattern - separate component for each styleable element.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage - only renders if mandatory
 * <Option.MandatoryIndicator className="text-red-500 ml-1" />
 *
 * // Custom rendering
 * <Option.MandatoryIndicator asChild>
 *   {React.forwardRef<HTMLElement, { mandatory: boolean }>(({ mandatory, ...props }, ref) => (
 *     mandatory ? <span ref={ref} {...props} className="text-red-500">*</span> : null
 *   ))}
 * </Option.MandatoryIndicator>
 * ```
 */
export const MandatoryIndicator = React.forwardRef<
  HTMLElement,
  MandatoryIndicatorProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const optionData = React.useContext(OptionContext);

  if (!optionData) return null;

  const mandatory = optionData.mandatory || false;

  // Don't render anything if not mandatory
  if (!mandatory) return null;

  const attributes = {
    'data-testid': TestIds.optionMandatoryIndicator,
  };

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { mandatory },
      ref,
      content: '*',
      attributes,
    });
    if (rendered) return rendered;
  }

  return (
    <span
      className={className}
      {...attributes}
      ref={ref as React.Ref<HTMLSpanElement>}
    >
      *
    </span>
  );
});

/**
 * Props for Option Choices component
 */
export interface ChoicesProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
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
    const hasChoicesOrFreeText =
      (optionData.choices && optionData.choices.length > 0) ||
      optionData.optionType === 'free-text';

    if (!hasChoicesOrFreeText) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.optionChoices,
      'data-type': optionData.optionType || 'text',
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
  children: React.ReactNode;
}

/**
 * Repeater component that renders Choice.Root for each choice.
 * Inspired by Product.VariantOptionRepeater pattern.
 *
 * Now handles ProductVariantSelector.Choice logic and provides ChoiceContext.
 *
 * @component
 *
 * @example
 * ```tsx
 * <Option.ChoiceRepeater>
 *   <Choice.Text />
 *   <Choice.Color />
 *   <Choice.FreeText />
 * </Option.ChoiceRepeater>
 * ```
 */
export const ChoiceRepeater = React.forwardRef<
  HTMLElement,
  ChoiceRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const optionData = React.useContext(OptionContext);

  if (
    !optionData ||
    (!optionData.choices?.length && optionData.optionType !== 'free-text')
  )
    return null;

  const onValueChange = optionData.onValueChange || (() => {});
  const isModifier = optionData.type;
  const allowedTypes = optionData.allowedTypes || [
    'color',
    'text',
    'free-text',
  ];

  if (optionData.optionType === 'free-text') {
    // Check if free-text is allowed
    if (!allowedTypes.includes('free-text')) {
      return null;
    }

    const choice = {
      ...optionData,
      type: 'free-text',
    };

    return (
      <ProductModifiersPrimitive.Choice modifier={optionData} choice={choice}>
        {(renderProps) => {
          const { value, isSelected, select } = renderProps;

          const contextValue = {
            choice,
            onValueChange,
            isSelected,
            isVisible: true,
            isInStock: true,
            isPreOrderEnabled: true,
            shouldRenderAsColor: false,
            shouldRenderAsText: false,
            shouldRenderAsFreeText: true,
            select,
            value,
          };

          return (
            <Choice.ChoiceContext.Provider value={contextValue}>
              <Choice.Root>{children}</Choice.Root>
            </Choice.ChoiceContext.Provider>
          );
        }}
      </ProductModifiersPrimitive.Choice>
    );
  }

  return (
    <>
      {optionData.choices.map(
        (choice: ConnectedOptionChoice | ConnectedModifierChoice) => {
          const choiceKey = choice.choiceId;

          const getChoiceType = (): 'color' | 'text' | 'free-text' => {
            if (choice?.choiceType === 'ONE_COLOR') return 'color';
            if (choice?.choiceType === 'CHOICE_TEXT') return 'text';

            return 'text';
          };

          const choiceType = getChoiceType();
          if (!allowedTypes.includes(choiceType)) {
            return null;
          }

          const choiceData = {
            ...choice,
            type: choiceType,
          };

          if (isModifier) {
            return (
              <ProductModifiersPrimitive.Choice
                key={choiceKey}
                modifier={optionData}
                choice={choiceData}
              >
                {(renderProps) => {
                  const { value, isSelected, select } = renderProps;

                  const contextValue = {
                    choice: choiceData,
                    onValueChange,
                    shouldRenderAsColor: choiceType === 'color',
                    shouldRenderAsText: choiceType === 'text',
                    shouldRenderAsFreeText: choiceType === 'free-text',
                    isSelected,
                    isVisible: true, // ProductModifiers doesn't provide visibility
                    isInStock: true, // ProductModifiers doesn't provide stock info
                    isPreOrderEnabled: true, // ProductModifiers doesn't provide pre-order info
                    select,
                    value,
                  };

                  return (
                    <Choice.ChoiceContext.Provider value={contextValue}>
                      <Choice.Root>{children}</Choice.Root>
                    </Choice.ChoiceContext.Provider>
                  );
                }}
              </ProductModifiersPrimitive.Choice>
            );
          } else {
            return (
              <ProductVariantSelectorPrimitive.Choice
                key={choiceKey}
                option={optionData}
                choice={choiceData}
              >
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

                  const contextValue = {
                    choice: choiceData,
                    onValueChange,
                    shouldRenderAsColor: choiceType === 'color',
                    shouldRenderAsText: choiceType === 'text',
                    shouldRenderAsFreeText: choiceType === 'free-text',
                    isSelected,
                    isVisible,
                    isInStock,
                    isPreOrderEnabled,
                    select,
                    value,
                  };

                  return (
                    <Choice.ChoiceContext.Provider value={contextValue}>
                      <Choice.Root>{children}</Choice.Root>
                    </Choice.ChoiceContext.Provider>
                  );
                }}
              </ProductVariantSelectorPrimitive.Choice>
            );
          }
        },
      )}
    </>
  );
});
