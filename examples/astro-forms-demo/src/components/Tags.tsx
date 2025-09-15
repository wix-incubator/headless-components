import { type TagsProps } from '@wix/headless-forms/react';

const Tags = ({
  id,
  value,
  label,
  showLabel,
  options,
  onChange,
  onBlur,
  onFocus,
}: TagsProps) => {
  const currentValues = value || [];

  const handleTagToggle = (optionValue: string) => {
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(option => {
          const isSelected = currentValues.includes(option.value);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleTagToggle(option.value)}
              onFocus={onFocus}
              style={{
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: '16px',
                backgroundColor: isSelected ? '#e3f2fd' : 'white',
                color: isSelected ? '#1976d2' : 'inherit',
                cursor: 'pointer',
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tags;
