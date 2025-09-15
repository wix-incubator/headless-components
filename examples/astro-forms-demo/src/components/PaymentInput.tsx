import React from 'react';
import { type PaymentInputProps } from '@wix/headless-forms/react';

export default function PaymentInput({
  id,
  value,
  required,
  readOnly,
  label,
  showLabel,
  placeholder,
  description,
  currency,
  minValue,
  maxValue,
  onChange,
  onBlur,
  onFocus,
}: PaymentInputProps) {
  return (
    <div>
      {showLabel && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <div className="payment-input-container">
        <span className="currency-symbol">{currency}</span>
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={readOnly}
          min={minValue}
          max={maxValue}
          className="payment-input"
        />
      </div>
    </div>
  );
}
