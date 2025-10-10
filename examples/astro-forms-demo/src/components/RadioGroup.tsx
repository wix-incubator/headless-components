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
    <div className="mb-6">
      {showLabel && (
        <label className="block text-foreground font-paragraph mb-3">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {options.map(option => (
          <label
            key={option.id}
            className="flex items-center gap-3 cursor-pointer text-foreground font-paragraph"
          >
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              className="w-4 h-4 text-primary bg-background border-foreground/20 focus:ring-2 focus:ring-primary/50"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
