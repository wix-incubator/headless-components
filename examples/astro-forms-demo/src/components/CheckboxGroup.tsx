import { Form, type CheckboxGroupProps } from '@wix/headless-forms/react';

const CheckboxGroup = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  numberOfColumns = 1,
  customOption,
  minItems,
  maxItems,
  onChange,
  onBlur,
  onFocus,
}: CheckboxGroupProps) => {
  const currentValues = value || [];

  const handleCheckboxChange = (optionValue: string) => {
    const isSelected = currentValues.includes(optionValue);
    let newValues: string[];

    if (isSelected) {
      newValues = currentValues.filter(v => v !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }

    onChange(newValues);
    onBlur();
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
      <Form.Field.Input>
        <div className="space-y-2">
          {options.map(option => {
            const isSelected = currentValues.includes(option.value);
            return (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer text-foreground font-paragraph"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={readOnly}
                  onChange={() => handleCheckboxChange(option.value)}
                  onFocus={onFocus}
                  className="w-4 h-4 text-primary bg-background border-foreground/20 rounded focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-invalid={!!(required && currentValues.length === 0)}
                  aria-required={required}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </Form.Field.Input>
    </Form.Field>
  );
};

export default CheckboxGroup;
