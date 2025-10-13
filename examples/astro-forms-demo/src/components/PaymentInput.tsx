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
    <div className="mb-6">
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-foreground font-paragraph mb-2"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2">
        <span className="text-foreground font-paragraph font-semibold text-lg">
          {currency}
        </span>
        <input
          id={id}
          type="number"
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={readOnly}
          min={minValue}
          max={maxValue}
          className="flex-1 px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
