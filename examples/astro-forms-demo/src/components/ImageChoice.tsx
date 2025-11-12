import { Form, type ImageChoiceProps } from '@wix/headless-forms/react';

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
  errorMessage,
}: ImageChoiceProps) => {
  return (
    <Form.Field id={id}>
      <Form.Field.Label>
        <label
          htmlFor={id}
          className="text-foreground font-paragraph font-semibold mb-3"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </Form.Field.Label>
      <Form.Field.InputWrapper>
        <Form.Field.Input>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)` }}
            role="group"
            aria-required={required}
          >
            {options.map(option => {
              const isSelected = multiple
                ? (value as string[])?.includes(option.value)
                : value === option.value;
              return (
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
                  onFocus={onFocus}
                  onBlur={onBlur}
                  disabled={readOnly}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-foreground/20 bg-background hover:border-primary/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {option.image && option.image.url && (
                    <img
                      src={option.image.url}
                      alt={option.label}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <span className="text-foreground font-paragraph font-semibold">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {errorMessage}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default ImageChoice;
