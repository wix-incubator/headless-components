import React from 'react';
import { Form, type ProductListProps } from '@wix/headless-forms/react';

export default function ProductList({
  id,
  value,
  required,
  readOnly,
  label,
  showLabel,
  options,
  onChange,
  error,
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
    <Form.Field id={id}>
      {showLabel && (
        <Form.Field.Label>
          <label className="text-foreground font-paragraph mb-3">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        </Form.Field.Label>
      )}
      <Form.Field.InputWrapper>
        <Form.Field.Input>
          <div className="space-y-3">
            {options.map(option => {
              const isSelected =
                (value as unknown as string[])?.includes(option.value) || false;

              return (
                <div
                  key={option.id}
                  className="flex items-center gap-3 p-3 bg-background border-foreground/20"
                >
                  <input
                    type="checkbox"
                    id={`${id}-${option.id}`}
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                    disabled={readOnly}
                    className="w-4 h-4 text-primary bg-background border-foreground/20 rounded focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-invalid={
                      !!(
                        required && (value as unknown as string[])?.length === 0
                      )
                    }
                    aria-required={required}
                  />
                  <label
                    htmlFor={`${id}-${option.id}`}
                    className="flex-1 text-foreground font-paragraph cursor-pointer"
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-foreground/70">
                      {' '}
                      - {option.price}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {error}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
}
