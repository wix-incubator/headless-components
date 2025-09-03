import { forms } from '@wix/forms';
import {
  INPUT_FIELD_TYPES,
  InputFieldType,
} from './types/input-field-types.js';
import { FormField } from './types/formatted-fields.js';

export function formatField(field: forms.Field): FormField {
  const { inputOptions, identifier } = field;

  const type = identifier! as InputFieldType;
  const name = inputOptions?.target ?? '';
  const required = inputOptions?.required ?? false;
  const readOnly = inputOptions?.readOnly ?? false;

  // console.log('---- field ----', label, identifier, field);
  // console.log('inputOptions', inputOptions);

  switch (type) {
    case INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE: {
      const options = inputOptions?.stringOptions?.dateInputOptions ?? {};

      const showPlaceholder = options?.showPlaceholder ?? true;
      const label = options?.label ?? '';
      const showLabel = options?.showLabel ?? true;
      const description = options?.description ?? undefined;

      console.log('---- field ----', label, identifier, field);
      console.log('inputOptions', inputOptions);

      return {
        type,
        name,
        label,
        required,
        readOnly,
        description,
        showLabel,
        showPlaceholder,
      };
    }
    // case INPUT_FIELD_TYPES.CONTACTS_FIRST_NAME:
    // case INPUT_FIELD_TYPES.CONTACTS_LAST_NAME:
    // case INPUT_FIELD_TYPES.CONTACTS_EMAIL: {
    default: {
      const options = inputOptions?.stringOptions?.textInputOptions ?? {};

      const label = options?.label ?? '';
      const placeholder = options?.placeholder ?? undefined;
      const description = options?.description ?? undefined;
      const showLabel = options?.showLabel ?? true;

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
}
