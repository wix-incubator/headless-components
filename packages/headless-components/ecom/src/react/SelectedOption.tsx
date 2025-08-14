import { WixServices, useService } from "@wix/services-manager-react";
import React from "react";
import {
  SelectedOptionServiceDefinition,
  SelectedOptionService,
  type SelectedOptionServiceConfig,
  type SelectedOption,
  isTextOption,
  isColorOption,
} from "../services/selected-option-service.js";
import { createServicesMap } from "@wix/services-manager";
import { useAsChild, type AsChildProps } from "../utils/asChild.js";

enum TestIds {
  selectedOptionText = "selected-option-text",
  selectedOptionColor = "selected-option-color",
}

export interface SelectedOptionRootProps {
  children: React.ReactNode;
  option: SelectedOption;
}

/**
 * Root component for a selected option that provides the SelectedOption service context to its children
 *
 * @example
 * ```tsx
 * <SelectedOption.Root option={selectedOption}>
 *   <SelectedOption.Text />
 *   <SelectedOption.Color />
 * </SelectedOption.Root>
 * ```
 */
export function Root(props: SelectedOptionRootProps): React.ReactNode {
  const { children, option } = props;

  const selectedOptionServiceConfig: SelectedOptionServiceConfig = {
    selectedOption: option,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        SelectedOptionServiceDefinition,
        SelectedOptionService,
        selectedOptionServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

Root.displayName = "SelectedOption.Root";

/**
 * Props for SelectedOption Text component
 */
export interface SelectedOptionTextProps extends AsChildProps {}

/**
 * Displays text-based selected option.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <SelectedOption.Text className="text-sm text-content-secondary" />
 *
 * // Custom rendering with forwardRef
 * <SelectedOption.Text asChild>
 *   {React.forwardRef(({name, value, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm text-content-secondary">
 *       {name}: {value}
 *     </span>
 *   ))}
 * </SelectedOption.Text>
 * ```
 */
export const Text = React.forwardRef<HTMLElement, SelectedOptionTextProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const selectedOptionService = useService(SelectedOptionServiceDefinition);
  const Comp = useAsChild(asChild, "span");

  const selectedOption = selectedOptionService.selectedOption.get();

  // Only render if this is a text option
  if (!isTextOption(selectedOption)) {
    return null;
  }

  const name = selectedOption.name;
  const value = selectedOption.value;

  const attributes = {
    "data-testid": TestIds.selectedOptionText,
    ...otherProps,
  };

  return (
    <Comp ref={ref} {...attributes}>
      {asChild ? children : `${name}: ${value}`}
    </Comp>
  );
});

Text.displayName = "SelectedOption.Text";

/**
 * Props for SelectedOption Color component
 */
export interface SelectedOptionColorProps extends AsChildProps {}

/**
 * Displays color-based selected option.
 *
 * @component
  * @example
 * ```tsx
 * // Default usage - renders "OptionName: ColorName"
 * <SelectedOption.Color className="text-sm text-content-secondary" />
 *
 * // Custom rendering with forwardRef - provides name and colorCode for custom display
 * <SelectedOption.Color asChild>
 *   {React.forwardRef(({name, colorCode, ...props}, ref) => (
 *     <div ref={ref} {...props} className="flex items-center gap-2 text-sm text-content-secondary">
 *       <div
 *         className="w-4 h-4 rounded-full border"
 *         style={{ backgroundColor: colorCode }}
 *       />
 *       <span>{name}</span>
 *     </div>
 *   ))}
 * </SelectedOption.Color>
 * ```
 */
export const Color = React.forwardRef<HTMLElement, SelectedOptionColorProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const selectedOptionService = useService(SelectedOptionServiceDefinition);
  const Comp = useAsChild(asChild, "div");

  const selectedOption = selectedOptionService.selectedOption.get();

  // Only render if this is a color option
  if (!isColorOption(selectedOption)) {
    return null;
  }

    const name = selectedOption.name;
  const colorName = selectedOption.value.name;

  const attributes = {
    "data-testid": TestIds.selectedOptionColor,
    ...otherProps,
  };

  return (
    <Comp ref={ref} {...attributes}>
      {asChild ? children : `${name}: ${colorName}`}
    </Comp>
  );
});

Color.displayName = "SelectedOption.Color";
