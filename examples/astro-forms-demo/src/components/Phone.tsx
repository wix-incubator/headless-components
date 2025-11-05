import {
  PhoneField,
  type PhoneInputProps,
  Form,
} from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const Phone = ({
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
    <PhoneField id={id}>
      <PhoneField.Label
        className="text-foreground font-paragraph mb-2"
        showLabel={showLabel}
        id={id}
        label={label}
        required={required}
      >
        <PhoneField.Label.Required />
      </PhoneField.Label>
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
            <PhoneField.CountryCode
              className="px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              id={id}
              value={value}
              required={required}
              readOnly={readOnly}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              allowedCountryCodes={allowedCountryCodes}
              defaultCountryCode={defaultCountryCode}
            />
            <PhoneField.Input
              id={id}
              value={value}
              required={required}
              readOnly={readOnly}
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              className="flex-1 px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </Form.Field.Input>
        <PhoneField.Error className="text-destructive text-sm font-paragraph">
          {error}
        </PhoneField.Error>
      </Form.Field.InputWrapper>
    </PhoneField>
  );
};

export default Phone;
