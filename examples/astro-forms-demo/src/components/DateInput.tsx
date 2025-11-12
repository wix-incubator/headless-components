import { Form, type DateInputProps } from '@wix/headless-forms/react';

const DateInput = ({
  id,
  value,
  label,
  showLabel,
  showPlaceholder,
  acceptedDates = 'all',
  required,
  readOnly,
  description,
  showDateLabels,
  onChange,
  onBlur,
  onFocus,
  errorMessage,
}: DateInputProps) => {
  return (
    <Form.Field id={id}>
      <Form.Field.Label>
        <label htmlFor={id} className="text-foreground font-paragraph mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </Form.Field.Label>
      <Form.Field.InputWrapper>
        <Form.Field.Input
          asChild
          className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <input
            id={id}
            type="date"
            value={value || ''}
            required={required}
            readOnly={readOnly}
            onChange={e => onChange(e.target.value || null)}
            onBlur={onBlur}
            onFocus={onFocus}
            aria-invalid={!!(required && !value)}
            aria-required={required}
          />
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {errorMessage}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default DateInput;
