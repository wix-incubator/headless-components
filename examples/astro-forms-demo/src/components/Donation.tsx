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
    <div className="mb-6">
      {showLabel && (
        <label className="block text-foreground font-paragraph mb-3">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => handleOptionSelect(option)}
            disabled={readOnly}
            className={`px-6 py-3 rounded-lg font-paragraph font-semibold transition-all ${
              value === option
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground border border-foreground/20 hover:border-primary/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currency}
            {option}
          </button>
        ))}

        {customOption && (
          <div className="w-full mt-2">
            <label className="block text-foreground font-paragraph text-sm mb-2">
              {customOption.label}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-paragraph font-semibold text-lg">
                {currency}
              </span>
              <input
                type="number"
                placeholder={customOption.placeholder}
                disabled={readOnly}
                onBlur={onBlur}
                onFocus={onFocus}
                onChange={handleCustomInput}
                className="flex-1 px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
