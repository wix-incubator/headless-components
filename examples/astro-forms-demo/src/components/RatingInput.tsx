import { type RatingInputProps } from '@wix/headless-forms/react';

const RatingInput = ({
  id,
  value,
  defaultValue,
  label,
  showLabel,
  description,
  required,
  readOnly,
  onChange,
  onBlur,
  onFocus,
}: RatingInputProps) => {
  return (
    <div className="mb-6">
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-foreground font-paragraph mb-2"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={readOnly}
            className={`w-10 h-10 text-2xl ${
              value && rating <= value ? 'text-secondary' : 'text-foreground/20'
            } hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingInput;
