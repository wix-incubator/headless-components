import { type CheckboxGroupProps } from '@wix/headless-forms/react';

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
    <div className="mb-6">
      {showLabel && (
        <label className="block text-foreground font-paragraph mb-3">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

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
                onChange={() => handleCheckboxChange(option.value)}
                onFocus={onFocus}
                className="w-4 h-4 text-primary bg-background border-foreground/20 rounded focus:ring-2 focus:ring-primary/50"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;
