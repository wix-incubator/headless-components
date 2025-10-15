import { Form, type RatingInputProps } from '@wix/headless-forms/react';

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
  // @ts-expect-error
  layout,
}: RatingInputProps) => {
  return (
    <Form.Field id={id} layout={layout}>
      {showLabel && (
        <Form.Field.Label>
          <label htmlFor={id} className="text-foreground font-paragraph mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        </Form.Field.Label>
      )}
      <Form.Field.Input>
        <div className="flex gap-1" role="radiogroup" aria-required={required}>
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={readOnly}
              role="radio"
              aria-checked={value === rating}
              className={`w-10 h-10 text-2xl ${
                value && rating <= value
                  ? 'text-secondary'
                  : 'text-foreground/20'
              } hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ★
            </button>
          ))}
        </div>
      </Form.Field.Input>
    </Form.Field>
  );
};

export default RatingInput;
