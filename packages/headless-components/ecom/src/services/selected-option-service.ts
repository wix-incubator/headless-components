import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export interface SelectedOptionText {
  name: string;
  type: 'text';
  value: string;
}

export interface SelectedOptionColor {
  name: string;
  type: 'color';
  value: {
    name: string;
    code: string;
  };
}

export type SelectedOption = SelectedOptionText | SelectedOptionColor;

export interface SelectedOptionServiceAPI {
  selectedOption: Signal<SelectedOption>;
}

export const SelectedOptionServiceDefinition =
  defineService<SelectedOptionServiceAPI>('selectedOption');

export interface SelectedOptionServiceConfig {
  selectedOption: SelectedOption;
}

export const SelectedOptionService =
  implementService.withConfig<SelectedOptionServiceConfig>()(
    SelectedOptionServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const selectedOption: Signal<SelectedOption> = signalsService.signal(
        config.selectedOption,
      );

      return {
        selectedOption,
      };
    },
  );

/**
 * Type guard to check if a selected option is a text option
 *
 * @param option - The selected option to check
 * @returns true if the option is a text option
 *
 * @example
 * ```tsx
 * if (isTextOption(selectedOption)) {
 *   // TypeScript knows this is SelectedOptionText
 *   console.log(selectedOption.value); // string
 * }
 * ```
 */
export function isTextOption(
  option: SelectedOption,
): option is SelectedOptionText {
  return option.type === 'text';
}

/**
 * Type guard to check if a selected option is a color option
 *
 * @param option - The selected option to check
 * @returns true if the option is a color option
 *
 * @example
 * ```tsx
 * if (isColorOption(selectedOption)) {
 *   // TypeScript knows this is SelectedOptionColor
 *   console.log(selectedOption.value.name); // string
 *   console.log(selectedOption.value.code); // string
 * }
 * ```
 */
export function isColorOption(
  option: SelectedOption,
): option is SelectedOptionColor {
  return option.type === 'color';
}
