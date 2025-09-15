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
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <div>
        {options.map(option => {
          const isSelected = currentValues.includes(option.value);
          return (
            <label
              key={option.id}
              style={{ display: 'block', marginBottom: '4px' }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCheckboxChange(option.value)}
                onFocus={onFocus}
                style={{ marginRight: '8px' }}
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
