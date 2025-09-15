import React from 'react';
import { type DonationProps } from '@wix/headless-forms/react';

export default function Donation({
  id,
  value,
  required,
  readOnly,
  label,
  showLabel,
  description,
  numberOfColumns,
  currency,
  options,
  customOption,
  onChange,
  onBlur,
  onFocus,
}: DonationProps) {
  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {showLabel && (
        <label>
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <div>
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => handleOptionSelect(option)}
            disabled={readOnly}
          >
            {currency}
            {option}
          </button>
        ))}

        {customOption && (
          <div className="custom-donation-option">
            <input
              type="text"
              placeholder={customOption.placeholder}
              disabled={readOnly}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={handleCustomInput}
              className="custom-donation-input"
            />
            <label className="custom-option-label">{customOption.label}</label>
          </div>
        )}
      </div>
    </div>
  );
}
