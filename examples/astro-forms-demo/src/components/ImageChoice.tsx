import { type ImageChoiceProps } from '@wix/headless-forms/react';

const ImageChoice = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  numberOfColumns = 1,
  multiple = false,
  onChange,
  onBlur,
  onFocus,
}: ImageChoiceProps) => {
  return (
    <div className="mb-6">
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-foreground font-paragraph font-semibold mb-3"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)` }}
      >
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              if (multiple) {
                const currentValue = (value as string[]) || [];
                const isSelected = currentValue.includes(option.value);
                onChange(
                  isSelected
                    ? currentValue.filter(v => v !== option.value)
                    : [...currentValue, option.value]
                );
              } else {
                onChange(option.value);
              }
            }}
            disabled={readOnly}
            className={`p-4 rounded-lg border-2 transition-all ${
              (
                multiple
                  ? (value as string[])?.includes(option.value)
                  : value === option.value
              )
                ? 'border-primary bg-primary/10'
                : 'border-foreground/20 bg-background hover:border-primary/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {option.image && (
              <img
                src={option.image}
                alt={option.label}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <span className="text-foreground font-paragraph font-semibold">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageChoice;
