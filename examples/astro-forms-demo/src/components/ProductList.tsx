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
    const currentValue = (value as unknown as string[]) || [];
    const isSelected = currentValue.includes(productId);

    if (isSelected) {
      onChange(currentValue.filter(id => id !== productId));
    } else {
      onChange([...currentValue, productId]);
    }
  };

  return (
    <div className="mb-6">
      {showLabel && (
        <label className="block text-foreground font-paragraph mb-3">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {options.map(option => {
          const isSelected =
            (value as unknown as string[])?.includes(option.value) || false;

          return (
            <div
              key={option.id}
              className="flex items-center gap-3 p-3 bg-background border border-foreground/20 rounded-lg hover:border-primary/50 transition-colors"
            >
              <input
                type="checkbox"
                id={`${id}-${option.id}`}
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                disabled={readOnly}
                className="w-4 h-4 text-primary bg-background border-foreground/20 rounded focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor={`${id}-${option.id}`}
                className="flex-1 text-foreground font-paragraph cursor-pointer"
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-foreground/70"> - {option.price}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
