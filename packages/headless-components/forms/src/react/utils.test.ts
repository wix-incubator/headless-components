import { describe, it, expect } from 'vitest';
import { forms } from '@wix/forms';
import { formatField } from './utils.js';
import { INPUT_FIELD_TYPES } from './types/input-field-types.js';

const createMockField = (
  identifier: string,
  inputOptions: forms.InputField = {},
): forms.Field => ({
  identifier,
  inputOptions: {
    target: 'test-field',
    required: false,
    readOnly: false,
    ...inputOptions,
  },
});

const createMockRichContent = (text: string): forms.RichContent => ({
  nodes: [{ type: 'TEXT', textData: { text } }],
});

describe('formatField', () => {
  describe('CONTACTS_BIRTHDATE', () => {
    it('formats correctly', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE, {
        required: true,
        readOnly: false,
        stringOptions: {
          dateInputOptions: {
            label: 'Date of Birth',
            description: createMockRichContent('Enter your birth date'),
            showLabel: true,
            showPlaceholder: false,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE,
        name: 'test-field',
        required: true,
        readOnly: false,
        label: 'Date of Birth',
        description: createMockRichContent('Enter your birth date'),
        showLabel: true,
        showPlaceholder: false,
      });
    });

    it('adds default values', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE, {
        stringOptions: {
          dateInputOptions: {},
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: '',
        description: undefined,
        showLabel: true,
        showPlaceholder: true,
      });
    });

    it('handles missing dateInputOptions', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE, {
        stringOptions: {},
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: '',
        description: undefined,
        showLabel: true,
        showPlaceholder: true,
      });
    });
  });

  describe('TEXT_AREA', () => {
    it('formats correctly', () => {
      const field = createMockField(INPUT_FIELD_TYPES.TEXT_AREA, {
        required: true,
        readOnly: true,
        stringOptions: {
          textInputOptions: {
            label: 'Message',
            placeholder: 'Enter your message here...',
            description: createMockRichContent(
              'Please provide detailed information',
            ),
            showLabel: false,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.TEXT_AREA,
        name: 'test-field',
        required: true,
        readOnly: true,
        label: 'Message',
        placeholder: 'Enter your message here...',
        description: createMockRichContent(
          'Please provide detailed information',
        ),
        showLabel: false,
      });
    });

    it('adds default values', () => {
      const field = createMockField(INPUT_FIELD_TYPES.TEXT_AREA, {
        stringOptions: {
          textInputOptions: {},
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.TEXT_AREA,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: '',
        placeholder: undefined,
        description: undefined,
        showLabel: true,
      });
    });
  });

  describe('TEXT_INPUT', () => {
    it('formats correctly', () => {
      const field = createMockField(INPUT_FIELD_TYPES.TEXT_INPUT, {
        required: true,
        stringOptions: {
          textInputOptions: {
            label: 'First Name',
            placeholder: 'Enter your first name',
            description: createMockRichContent('Your given name'),
            showLabel: true,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.TEXT_INPUT,
        name: 'test-field',
        required: true,
        readOnly: false,
        label: 'First Name',
        placeholder: 'Enter your first name',
        description: createMockRichContent('Your given name'),
        showLabel: true,
      });
    });

    it('formats minimal options', () => {
      const field = createMockField(INPUT_FIELD_TYPES.TEXT_INPUT, {
        stringOptions: {
          textInputOptions: {
            label: 'Email',
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.TEXT_INPUT,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: 'Email',
        placeholder: undefined,
        description: undefined,
        showLabel: true,
      });
    });

    it('handles missing inputOptions', () => {
      const field: forms.Field = {
        identifier: INPUT_FIELD_TYPES.TEXT_INPUT,
        inputOptions: undefined,
      };

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.TEXT_INPUT,
        name: '',
        required: false,
        readOnly: false,
        label: '',
        placeholder: undefined,
        description: undefined,
        showLabel: true,
      });
    });
  });

  describe('NUMBER_INPUT', () => {
    it('formats correctly', () => {
      const field = createMockField(INPUT_FIELD_TYPES.NUMBER_INPUT, {
        required: true,
        readOnly: true,
        stringOptions: {
          textInputOptions: {
            label: 'Age',
            placeholder: 'Enter your age',
            description: createMockRichContent('Must be 18 or older'),
            showLabel: true,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.NUMBER_INPUT,
        name: 'test-field',
        required: true,
        readOnly: true,
        label: 'Age',
        placeholder: 'Enter your age',
        description: createMockRichContent('Must be 18 or older'),
        showLabel: true,
      });
    });

    it('adds default values', () => {
      const field = createMockField(INPUT_FIELD_TYPES.NUMBER_INPUT, {
        stringOptions: {
          textInputOptions: {},
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.NUMBER_INPUT,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: '',
        placeholder: undefined,
        description: undefined,
        showLabel: true,
      });
    });
  });

  describe('CHECKBOX', () => {
    it('formats correctly', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CHECKBOX, {
        required: true,
        readOnly: false,
        booleanOptions: {
          checkboxOptions: {
            label: createMockRichContent('I agree to the terms and conditions'),
            checked: true,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CHECKBOX,
        name: 'test-field',
        required: true,
        readOnly: false,
        label: createMockRichContent('I agree to the terms and conditions'),
        defaultValue: true,
      });
    });

    it('formats with default values', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CHECKBOX, {
        booleanOptions: {
          checkboxOptions: {
            label: createMockRichContent('Subscribe to newsletter'),
            checked: false,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CHECKBOX,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: createMockRichContent('Subscribe to newsletter'),
        defaultValue: false,
      });
    });

    it('handles missing checkboxOptions', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CHECKBOX, {
        booleanOptions: {},
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CHECKBOX,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: undefined,
        defaultValue: false,
      });
    });

    it('handles missing booleanOptions', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CHECKBOX, {
        booleanOptions: undefined,
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CHECKBOX,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: undefined,
        defaultValue: false,
      });
    });
  });

  describe('CONTACTS_SUBSCRIBE', () => {
    it('formats correctly', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE, {
        required: false,
        readOnly: false,
        booleanOptions: {
          checkboxOptions: {
            label: createMockRichContent('Subscribe to our newsletter'),
            checked: true,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: createMockRichContent('Subscribe to our newsletter'),
        defaultValue: true,
      });
    });

    it('adds default values', () => {
      const field = createMockField(INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE, {
        booleanOptions: {
          checkboxOptions: {
            label: createMockRichContent('Subscribe'),
            checked: false,
          },
        },
      });

      const result = formatField(field);

      expect(result).toEqual({
        type: INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE,
        name: 'test-field',
        required: false,
        readOnly: false,
        label: createMockRichContent('Subscribe'),
        defaultValue: false,
      });
    });
  });
});
