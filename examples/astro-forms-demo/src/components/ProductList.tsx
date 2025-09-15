import React from 'react';
import { type ProductListProps } from '@wix/headless-forms/react';

export default function ProductList({
  id,
  value,
  required,
  readOnly,
  label,
  showLabel,
  options,
  onChange,
}: ProductListProps) {
  const handleToggle = (productId: string) => {
    const currentValue = (value as string[]) || [];
    const isSelected = currentValue.includes(productId);

    if (isSelected) {
      onChange(currentValue.filter(id => id !== productId));
    } else {
      onChange([...currentValue, productId]);
    }
  };

  return (
    <div>
      {showLabel && (
        <label className="field-label">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <div className="product-options">
        {options.map(option => {
          const isSelected =
            (value as string[])?.includes(option.value) || false;

          return (
            <div key={option.id} className="product-option">
              <input
                type="checkbox"
                id={`${id}-${option.id}`}
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                disabled={readOnly}
              />
              <label htmlFor={`${id}-${option.id}`}>
                {option.label} - {option.price}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
