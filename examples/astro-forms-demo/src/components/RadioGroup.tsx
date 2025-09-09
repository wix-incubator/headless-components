import { type RadioGroupProps } from '@wix/headless-forms/react';

const RadioGroup = ({
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
  onChange,
  onBlur,
  onFocus,
}: RadioGroupProps) => {
  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <div>
        {options.map(option => (
          <label
            key={option.id}
            style={{ display: 'block', marginBottom: '4px' }}
          >
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              style={{ marginRight: '8px' }}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
