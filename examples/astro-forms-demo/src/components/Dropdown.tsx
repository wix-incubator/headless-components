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
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <select
        id={id}
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        onBlur={onBlur}
        onFocus={onFocus}
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
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
