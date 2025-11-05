import { Form, type PhoneInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsPhone = ({
  id,
  value,
  label,
  showLabel,
  placeholder,
  description,
  required,
  readOnly,
  allowedCountryCodes,
  defaultCountryCode,
  onChange,
  onBlur,
  onFocus,
  error,
}: PhoneInputProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <Form.Field id={id}>
      {showLabel && (
        <Form.Field.Label>
          <label htmlFor={id} className="text-foreground font-paragraph mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        </Form.Field.Label>
      )}
      <Form.Field.InputWrapper>
        <Form.Field.Input
          description={
            description ? (
              <div
                id={descriptionId}
                className="mt-2 text-foreground/70 text-sm"
              >
                <RicosViewer
                  content={description as RichContent}
                  plugins={quickStartViewerPlugins()}
                />
              </div>
            ) : undefined
          }
        >
          <div className="flex gap-2">
            <select
              id={`${id}-country`}
              defaultValue={defaultCountryCode}
              disabled={readOnly}
              className="px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {allowedCountryCodes?.map((code: string) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              id={id}
              type="tel"
              value={value || ''}
              required={required}
              readOnly={readOnly}
              placeholder={placeholder}
              aria-describedby={descriptionId}
              aria-invalid={!!(required && !value)}
              aria-required={required}
              onChange={e => onChange(e.target.value)}
              onBlur={() => onBlur()}
              onFocus={() => onFocus()}
              className="flex-1 px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {error}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default ContactsPhone;
