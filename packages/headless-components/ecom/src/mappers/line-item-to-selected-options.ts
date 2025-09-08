import { type DescriptionLine } from '../services/common-types.js';
import { type SelectedOption } from '../services/selected-option-service.js';

/**
 * Extracts selected options from line item description lines.
 * Maps Wix SDK description line format to our discriminated union SelectedOption type.
 *
 * @param descriptionLines - Array of description lines from a line item
 * @returns Array of properly typed selected options
 *
 * @example
 * ```tsx
 * const lineItem = getLineItem();
 * const selectedOptions = extractSelectedOptions(lineItem.descriptionLines || []);
 * ```
 */
export function extractSelectedOptions(
  descriptionLines: DescriptionLine[],
): SelectedOption[] {
  return descriptionLines.reduce<SelectedOption[]>((selectedOptions, line) => {
    if (line.name?.original) {
      const optionName = line.name.original;

      // Handle color options (discriminated union with type: "color")
      if (line.colorInfo) {
        selectedOptions.push({
          name: optionName,
          type: 'color',
          value: {
            name: line.colorInfo.original || '',
            code: line.colorInfo.code || '',
          },
        });
      }
      // Handle text options (discriminated union with type: "text")
      else if (line.plainText) {
        selectedOptions.push({
          name: optionName,
          type: 'text',
          value: line.plainText.original || '',
        });
      }
    }
    return selectedOptions;
  }, []);
}
