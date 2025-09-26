import { type DateInputProps } from '@wix/headless-forms/react';

const DateInput = ({
  id,
  value,
  label,
  showLabel,
  showPlaceholder,
  acceptedDates = 'all',
  required,
  readOnly,
  description,
  showDateLabels,
  onChange,
  onBlur,
  onFocus,
}: DateInputProps) => {
  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        type="date"
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        onBlur={onBlur}
        onFocus={onFocus}
        style={{
          width: '100%',
          maxWidth: '200px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default DateInput;
