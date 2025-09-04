import { forms } from '@wix/forms';
import {
  INPUT_FIELD_TYPES,
  InputFieldType,
} from './types/input-field-types.js';
import {
  FormField,
  ContactsBirthdateField,
  ContactsSubscribeField,
  DefaultField,
  TextAreaField,
  TextInputField,
  NumberInputField,
  CheckboxField,
  BaseField,
} from './types/formatted-fields.js';

function formatTextFieldOptions(options: forms.TextInput) {
  return {
    label: options?.label ?? '',
    placeholder: options?.placeholder ?? undefined,
    description: options?.description ?? undefined,
    showLabel: options?.showLabel ?? true,
  };
}

function formatCheckboxOptions(options: forms.Checkbox) {
  return {
    label: options?.label ?? '',
    defaultValue: options?.checked ?? false,
  };
}

export function formatField(field: forms.Field): FormField {
  const { inputOptions, identifier } = field;

  const type = identifier! as InputFieldType;
  const name = inputOptions?.target ?? '';
  const required = inputOptions?.required ?? false;
  const readOnly = inputOptions?.readOnly ?? false;

  const baseField: BaseField = {
    name,
    required,
    readOnly,
  };

  switch (type) {
    case INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE: {
      const options = inputOptions?.stringOptions?.dateInputOptions ?? {};

      const showPlaceholder = options?.showPlaceholder ?? true;
      const label = options?.label ?? '';
      const showLabel = options?.showLabel ?? true;
      const description = options?.description ?? undefined;

      const contactsBirthdateField: ContactsBirthdateField = {
        ...baseField,
        type,
        label,
        description,
        showLabel,
        showPlaceholder,
      };

      return contactsBirthdateField;
    }
    case INPUT_FIELD_TYPES.TEXT_AREA: {
      const formattedOptions = formatTextFieldOptions(
        inputOptions?.stringOptions?.textInputOptions ?? {},
      );

      const textAreaField: TextAreaField = {
        ...baseField,
        ...formattedOptions,
        type,
      };

      return textAreaField;
    }
    case INPUT_FIELD_TYPES.TEXT_INPUT: {
      const formattedOptions = formatTextFieldOptions(
        inputOptions?.stringOptions?.textInputOptions ?? {},
      );

      const textInputField: TextInputField = {
        ...baseField,
        ...formattedOptions,
        type,
      };

      return textInputField;
    }
    case INPUT_FIELD_TYPES.NUMBER_INPUT: {
      const formattedOptions = formatTextFieldOptions(
        inputOptions?.stringOptions?.textInputOptions ?? {},
      );

      const numberInputField: NumberInputField = {
        ...baseField,
        ...formattedOptions,
        type,
      };

      return numberInputField;
    }
    case INPUT_FIELD_TYPES.CHECKBOX: {
      const formattedOptions = formatCheckboxOptions(
        inputOptions?.booleanOptions?.checkboxOptions ?? {},
      );

      const checkboxField: CheckboxField = {
        ...baseField,
        ...formattedOptions,
        type,
      };

      return checkboxField;
    }
    case INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE: {
      const formattedOptions = formatCheckboxOptions(
        inputOptions?.booleanOptions?.checkboxOptions ?? {},
      );

      const contactsSubscribeField: ContactsSubscribeField = {
        ...baseField,
        ...formattedOptions,
        type,
      };

      return contactsSubscribeField;
    }
    // TODO: remove default case once all fields are handled
    default: {
      const options = inputOptions?.stringOptions?.textInputOptions ?? {};

      const label = options?.label ?? '';
      const placeholder = options?.placeholder ?? undefined;
      const description = options?.description ?? undefined;
      const showLabel = options?.showLabel ?? true;

      const defaultField: DefaultField = {
        ...baseField,
        type,
        label,
        placeholder,
        description,
        showLabel,
      };

      return defaultField;
    }
  }
}
