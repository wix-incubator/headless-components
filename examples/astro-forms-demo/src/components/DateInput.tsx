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

      <input
        id={id}
        type="date"
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        onBlur={onBlur}
        onFocus={onFocus}
        className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default DateInput;
