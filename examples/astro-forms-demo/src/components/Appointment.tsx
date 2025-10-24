import React from 'react';
import { Form, type AppointmentProps } from '@wix/headless-forms/react';

export default function Appointment({
  id,
  value,
  required,
  readOnly,
  label,
  showLabel,
  description,
  onChange,
  onBlur,
  onFocus,
}: AppointmentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Form.Field id={id}>
      {showLabel && (
        <Form.Field.Label>
          <label htmlFor={id} className="text-foreground font-paragraph mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        </Form.Field.Label>
      )}
      <Form.Field.InputWrapper>
        <Form.Field.Input
          asChild
          className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <input
            id={id}
            type="datetime-local"
            value={value || ''}
            required={required}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={readOnly}
            aria-invalid={!!(required && !value)}
            aria-required={required}
          />
        </Form.Field.Input>
        <Form.Field.Error>
          <span className="text-destructive text-sm font-paragraph">
            This field is required
          </span>
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
}
