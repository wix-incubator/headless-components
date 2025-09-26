import React from 'react';
import { type AppointmentProps } from '@wix/headless-forms/react';

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
    <div>
      {showLabel && (
        <label htmlFor={id}>
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <input
        id={id}
        type="datetime-local"
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={readOnly}
      />
    </div>
  );
}
