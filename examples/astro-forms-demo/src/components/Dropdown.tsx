import { type DropdownProps } from '@wix/headless-forms/react';

const Dropdown = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  placeholder = 'Select an option...',
  onChange,
  onBlur,
  onFocus,
}: DropdownProps) => {
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

      <select
        id={id}
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        onBlur={onBlur}
        onFocus={onFocus}
        className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
