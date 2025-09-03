import { forms } from '@wix/forms';
import { INPUT_FIELD_TYPES, InputFieldType } from './input-field-types.js';

/**
 * Represents a form field configuration with its properties and constraints.
 */
export type FormField = {
  type: InputFieldType;
  name: string;
  label: string;
  required: boolean;
  readOnly: boolean;
  placeholder?: string;
  description?: forms.RichContent;
  showLabel: boolean;
  showPlaceholder?: boolean;
};

export function formatField(field: forms.Field): FormField {
  const { inputOptions, identifier } = field;

  const type = identifier! as InputFieldType;
  const name = inputOptions?.target ?? '';
  const label =
    inputOptions?.stringOptions?.textInputOptions?.label ?? '';
  const required = inputOptions?.required ?? false;
  const readOnly = inputOptions?.readOnly ?? false;
  const placeholder =
    inputOptions?.stringOptions?.textInputOptions?.placeholder ??
    undefined;
  const description =
    inputOptions?.stringOptions?.textInputOptions?.description ??
    undefined;
  const showLabel =
    inputOptions?.stringOptions?.textInputOptions?.showLabel ?? true;

  console.log('---- field ----', label, identifier, field);
  console.log('inputOptions', inputOptions);

  switch (type) {
    case INPUT_FIELD_TYPES.CONTACTS_FIRST_NAME:
    case INPUT_FIELD_TYPES.CONTACTS_LAST_NAME:
    case INPUT_FIELD_TYPES.CONTACTS_EMAIL:
      return {
        type,
        name,
        label,
        required,
        readOnly,
        placeholder,
        description,
        showLabel,
      };
    case INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE: {
      const showPlaceholder =
        inputOptions?.stringOptions?.dateInputOptions?.showPlaceholder ??
        true;

      return {
        type,
        name,
        label,
        required,
        readOnly,
        placeholder,
        description,
        showLabel,
        showPlaceholder,
      };
    }
    default:
      return {
        type,
        name,
        label,
        required,
        readOnly,
        placeholder,
        description,
        showLabel,
      };
  }
}
