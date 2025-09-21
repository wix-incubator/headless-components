import { WixServices, useService } from '@wix/services-manager-react';
import React from 'react';
import { DataComponentTags } from '../data-component-tags.js';
import {
  SelectedOptionServiceDefinition,
  SelectedOptionService,
  type SelectedOption,
  isTextOption,
  isColorOption,
} from '../services/selected-option-service.js';
import { createServicesMap } from '@wix/services-manager';

import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  selectedOptionText = 'selected-option-text',
  selectedOptionColor = 'selected-option-color',
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
export const Root = (props: SelectedOptionRootProps): React.ReactNode => {
  const { children, option } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        SelectedOptionServiceDefinition,
        SelectedOptionService,
        {
          selectedOption: option,
        },
      )}
    >
      <AsChildSlot data-component-tag={DataComponentTags.selectedOptionRoot}>
        {children}
      </AsChildSlot>
    </WixServices>
  );
}

Root.displayName = 'SelectedOption.Root';

/**
 * Props for SelectedOption Text component
 */
export interface SelectedOptionTextProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string; value: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

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
export const Text = React.forwardRef<HTMLElement, SelectedOptionTextProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const selectedOptionService = useService(SelectedOptionServiceDefinition);

    const selectedOption = selectedOptionService.selectedOption.get();

    // Only render if this is a text option
    if (!isTextOption(selectedOption)) {
      return null;
    }

    const name = selectedOption.name;
    const value = selectedOption.value;
    const defaultContent = `${name}: ${value}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        data-testid={TestIds.selectedOptionText}
        customElement={children}
        customElementProps={{ name, value }}
        content={defaultContent}
        {...otherProps}
      >
        <span>{defaultContent}</span>
      </AsChildSlot>
    );
  },
);

Text.displayName = 'SelectedOption.Text';

/**
 * Props for SelectedOption Color component
 */
export interface SelectedOptionColorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    name: string;
    colorCode: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

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
export const Color = React.forwardRef<HTMLElement, SelectedOptionColorProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const selectedOptionService = useService(SelectedOptionServiceDefinition);

    const selectedOption = selectedOptionService.selectedOption.get();

    // Only render if this is a color option
    if (!isColorOption(selectedOption)) {
      return null;
    }

    const name = selectedOption.name;
    const colorName = selectedOption.value.name;
    const colorCode = selectedOption.value.code;
    const defaultContent = `${name}: ${colorName}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        data-testid={TestIds.selectedOptionColor}
        customElement={children}
        customElementProps={{ name, colorCode }}
        content={defaultContent}
        {...otherProps}
      >
        <span>{defaultContent}</span>
      </AsChildSlot>
    );
  },
);

Color.displayName = 'SelectedOption.Color';
