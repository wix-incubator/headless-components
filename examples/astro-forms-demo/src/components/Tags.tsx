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
    <div className="mb-6">
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-foreground font-paragraph mb-3"
        >
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isSelected = currentValues.includes(option.value);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleTagToggle(option.value)}
              onFocus={onFocus}
              className={`px-4 py-2 rounded-full font-paragraph transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground border border-foreground/20 hover:border-primary/50'
              }`}
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
