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
} from './types/formatted-fields.js';

export function formatField(field: forms.Field): FormField {
  const { inputOptions, identifier } = field;

  const type = identifier! as InputFieldType;
  const name = inputOptions?.target ?? '';
  const required = inputOptions?.required ?? false;
  const readOnly = inputOptions?.readOnly ?? false;

  switch (type) {
    case INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE: {
      const options = inputOptions?.stringOptions?.dateInputOptions ?? {};

      const showPlaceholder = options?.showPlaceholder ?? true;
      const label = options?.label ?? '';
      const showLabel = options?.showLabel ?? true;
      const description = options?.description ?? undefined;

      const contactsBirthdateField: ContactsBirthdateField = {
        type,
        name,
        label,
        required,
        readOnly,
        description,
        showLabel,
        showPlaceholder,
      };

      return contactsBirthdateField;
    }
    case INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE: {
      const options = inputOptions?.booleanOptions?.checkboxOptions ?? {};

      const contactsSubscribeField: ContactsSubscribeField = {
        type,
        name,
        label: options?.label!,
        required,
        readOnly,
        defaultValue: options?.checked ?? false,
      };

      return contactsSubscribeField;
    }
    case INPUT_FIELD_TYPES.TEXT_AREA: {
      const options = inputOptions?.stringOptions?.textInputOptions ?? {};
      const label = options?.label ?? '';
      const placeholder = options?.placeholder ?? undefined;
      const description = options?.description ?? undefined;
      const showLabel = options?.showLabel ?? true;

      console.log('---- field ----', label, identifier, field);
      console.log('inputOptions', inputOptions);
      console.log('booleanOptions', inputOptions?.booleanOptions);

      const textAreaField: TextAreaField = {
        type,
        name,
        label,
        required,
        readOnly,
        placeholder,
        description,
        showLabel,
      };

      return textAreaField;
    }
    // case INPUT_FIELD_TYPES.TEXT_AREA:
    // case INPUT_FIELD_TYPES.CONTACTS_FIRST_NAME:
    // case INPUT_FIELD_TYPES.CONTACTS_LAST_NAME:
    // case INPUT_FIELD_TYPES.CONTACTS_EMAIL: {
    default: {
      const options = inputOptions?.stringOptions?.textInputOptions ?? {};

      const label = options?.label ?? '';
      const placeholder = options?.placeholder ?? undefined;
      const description = options?.description ?? undefined;
      const showLabel = options?.showLabel ?? true;

      const defaultField: DefaultField = {
        type,
        name,
        label,
        required,
        readOnly,
        placeholder,
        description,
        showLabel,
      };

      return defaultField;
    }
  }
}
