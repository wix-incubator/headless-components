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
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        type="number"
        min="1"
        max="5"
        value={value || ''}
        onChange={e => onChange(parseInt(e.target.value) || null)}
        onBlur={onBlur}
        onFocus={onFocus}
        style={{
          width: '100%',
          maxWidth: '100px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default RatingInput;
