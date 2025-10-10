import React from 'react';

// Base field props that match Wix Forms expectations
export interface BaseFieldProps {
  id: string;
  required: boolean;
  readOnly: boolean;
  error: string | undefined;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
}

// Text field props that match Wix Forms TextInputProps
export interface TextFieldProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  placeholder?: string;
  description?: any; // RichContent type
}

// TextArea props that match Wix Forms TextAreaProps
export interface TextAreaProps extends TextFieldProps {
  minLength?: number;
  maxLength?: number;
}

// Number input props that match Wix Forms NumberInputProps
export interface NumberInputProps extends BaseFieldProps {
  value: string | number | null | undefined;
  label: string;
  showLabel: boolean;
  placeholder?: string;
  description?: any; // RichContent type
}

// Phone input props that match Wix Forms PhoneInputProps
export interface PhoneInputProps extends TextFieldProps {
  allowedCountryCodes: string[];
  defaultCountryCode?: string;
}

// Checkbox props that match Wix Forms CheckboxProps
export interface CheckboxProps extends BaseFieldProps {
  value: boolean;
  label: any; // RichContent type
  defaultValue: boolean;
}

// File upload props that match Wix Forms FileUploadProps
export interface FileUploadProps {
  id: string;
  required: boolean;
  readOnly: boolean;
  error: string | undefined;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
  value: any[] | null | undefined; // FileData array
  label: string;
  showLabel: boolean;
  description?: any; // RichContent type
  buttonText?: string;
  maxFiles?: number;
  allowedFileFormats?: string[];
  explanationText?: string;
}

// Submit button props that match Wix Forms SubmitButtonProps
export interface SubmitButtonProps {
  id: string;
  submitText: string;
  onSubmitClick: () => void;
}

// Rich text props that match Wix Forms RichTextProps
export interface RichTextProps {
  content: any; // RichContent type
  maxShownParagraphs: number;
}

// Legacy FieldProps for backward compatibility
export interface FieldProps {
  value?: any;
  onChange: (value: any) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
  type?: string;
  min?: number;
  max?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export interface ChoiceFieldProps extends FieldProps {
  options?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

export interface FileUploadProps extends FieldProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

// Field Components
export const TextInput: React.FC<TextFieldProps> = ({
  value,
  onChange,
  label,
  showLabel,
  error,
  required,
  readOnly,
  placeholder,
  id,
  onBlur,
  onFocus,
  ...props
}) => (
  <div className="form-field space-y-2">
    {showLabel && (
      <label
        htmlFor={id}
        className="text-foreground font-paragraph text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <input
      id={id}
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-3 py-2 bg-background border border-foreground text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  showLabel,
  error,
  required,
  readOnly,
  placeholder,
  id,
  onBlur,
  onFocus,
  minLength,
  maxLength,
  ...props
}) => (
  <div className="form-field space-y-2">
    {showLabel && (
      <label
        htmlFor={id}
        className="text-foreground font-paragraph text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <textarea
      id={id}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      minLength={minLength}
      maxLength={maxLength}
      rows={4}
      className="w-full px-3 py-2 bg-background border border-foreground text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
      {...props}
    />
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  label,
  showLabel,
  error,
  required,
  readOnly,
  placeholder,
  id,
  onBlur,
  onFocus,
  ...props
}) => (
  <div className="form-field space-y-2">
    {showLabel && (
      <label
        htmlFor={id}
        className="text-foreground font-paragraph text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <input
      id={id}
      type="number"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-3 py-2 bg-background border border-foreground text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label,
  showLabel,
  error,
  required,
  readOnly,
  placeholder,
  id,
  onBlur,
  onFocus,
  allowedCountryCodes,
  defaultCountryCode,
  ...props
}) => (
  <div className="form-field space-y-2">
    {showLabel && (
      <label
        htmlFor={id}
        className="text-foreground font-paragraph text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <input
      id={id}
      type="tel"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-3 py-2 bg-background border border-foreground text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onChange,
  label,
  error,
  readOnly,
  id,
  onBlur,
  onFocus,
  defaultValue,
  ...props
}) => (
  <div className="form-field space-y-2">
    <label className="flex items-center text-foreground font-paragraph">
      <input
        id={id}
        type="checkbox"
        checked={value || false}
        onChange={e => onChange(e.target.checked)}
        onBlur={onBlur}
        onFocus={onFocus}
        readOnly={readOnly}
        className="mr-2 h-4 w-4 text-primary focus:ring-primary border-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      />
      {typeof label === 'string' ? label : 'Checkbox'}
    </label>
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const RadioGroup: React.FC<ChoiceFieldProps> = ({
  value,
  onChange,
  options = [],
  label,
  error,
  required,
  disabled,
  name,
  id,
  className,
  ...props
}) => (
  <div className={`form-field space-y-2 ${className || ''}`}>
    {label && (
      <legend className="text-foreground font-paragraph text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </legend>
    )}
    <fieldset className="space-y-2">
      {options.map(option => (
        <label
          key={option.id}
          className="flex items-center text-foreground font-paragraph"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className="mr-2 h-4 w-4 text-primary focus:ring-primary border-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const CheckboxGroup: React.FC<ChoiceFieldProps> = ({
  value = [],
  onChange,
  options = [],
  label,
  error,
  required,
  disabled,
  name,
  id,
  className,
  ...props
}) => (
  <div className={`form-field space-y-2 ${className || ''}`}>
    {label && (
      <legend className="text-foreground font-paragraph text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </legend>
    )}
    <fieldset className="space-y-2">
      {options.map(option => (
        <label
          key={option.id}
          className="flex items-center text-foreground font-paragraph"
        >
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={value?.includes(option.value)}
            onChange={e => {
              const newValue = e.target.checked
                ? [...value, option.value]
                : value.filter((v: string) => v !== option.value);
              onChange(newValue);
            }}
            disabled={disabled}
            className="mr-2 h-4 w-4 text-primary focus:ring-primary border-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const Dropdown: React.FC<ChoiceFieldProps> = ({
  value,
  onChange,
  options = [],
  label,
  error,
  required,
  disabled,
  placeholder,
  name,
  id,
  className,
  ...props
}) => (
  <div className={`form-field space-y-2 ${className || ''}`}>
    {label && (
      <label
        htmlFor={id}
        className="text-foreground font-paragraph text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 bg-background border border-foreground text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  label,
  error,
  required,
  disabled,
  accept,
  multiple,
  name,
  id,
  className,
  ...props
}) => (
  <div className={`form-field space-y-2 ${className || ''}`}>
    {label && (
      <label
        htmlFor={id}
        className="text-foreground font-paragraph text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <input
      id={id}
      name={name}
      type="file"
      onChange={e => onChange(e.target.files)}
      disabled={disabled}
      accept={accept}
      multiple={multiple}
      className="w-full px-3 py-2 bg-background border border-foreground text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-paragraph file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
      {...props}
    />
    {error && (
      <span className="text-destructive text-sm font-paragraph">{error}</span>
    )}
  </div>
);

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  submitText,
  onSubmitClick,
  ...props
}) => (
  <button
    type="submit"
    className="w-full bg-primary text-primary-foreground font-paragraph font-medium py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    onClick={onSubmitClick}
    {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
  >
    {submitText}
  </button>
);

export const RichText: React.FC<RichTextProps> = ({
  content,
  maxShownParagraphs,
  ...props
}) => (
  <div className="form-field space-y-2">
    <div
      className="text-foreground font-paragraph prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{
        __html: content?.nodes?.map((node: any) => node.text).join('') || '',
      }}
      {...props}
    />
  </div>
);

// Placeholder components for fields not yet implemented
export const MultilineAddress: React.FC<any> = props => <TextArea {...props} />;
export const DateInput: React.FC<any> = props => <TextInput {...props} />;
export const DatePicker: React.FC<any> = props => <TextInput {...props} />;
export const DateTimeInput: React.FC<any> = props => <TextInput {...props} />;
export const TimeInput: React.FC<any> = props => <TextInput {...props} />;
export const Signature: React.FC<any> = props => <TextArea {...props} />;
export const RatingInput: React.FC<any> = props => <NumberInput {...props} />;
export const Tags: React.FC<any> = props => <TextInput {...props} />;
export const ProductList: React.FC<any> = props => (
  <div className="text-foreground font-paragraph">
    Product List - not implemented
  </div>
);
export const FixedPayment: React.FC<any> = props => (
  <div className="text-foreground font-paragraph">
    Fixed Payment - not implemented
  </div>
);
export const PaymentInput: React.FC<any> = props => <NumberInput {...props} />;
export const Donation: React.FC<any> = props => <NumberInput {...props} />;
export const Appointment: React.FC<any> = props => (
  <div className="text-foreground font-paragraph">
    Appointment - not implemented
  </div>
);
export const ImageChoice: React.FC<any> = props => (
  <div className="text-foreground font-paragraph">
    Image Choice - not implemented
  </div>
);
