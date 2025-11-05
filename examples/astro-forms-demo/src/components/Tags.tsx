import { Form, type TagsProps } from '@wix/headless-forms/react';

const Tags = ({
  id,
  value,
  label,
  showLabel,
  options,
  onChange,
  onBlur,
  onFocus,
  error,
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
    <Form.Field id={id}>
      {showLabel && (
        <Form.Field.Label>
          <label htmlFor={id} className="text-foreground font-paragraph mb-3">
            {label}
          </label>
        </Form.Field.Label>
      )}
      <Form.Field.InputWrapper>
        <Form.Field.Input>
          <div className="flex flex-wrap gap-2" role="group">
            {options.map(option => {
              const isSelected = currentValues.includes(option.value);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleTagToggle(option.value)}
                  onFocus={onFocus}
                  aria-pressed={isSelected}
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
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {error}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default Tags;
