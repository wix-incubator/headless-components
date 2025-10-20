import { Form, type TextInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const TextInput = ({
  id,
  value,
  label,
  showLabel,
  placeholder,
  description,
  required,
  readOnly,
  minLength,
  maxLength,
  onChange,
  onBlur,
  onFocus,
}: TextInputProps) => {
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
      <Form.Field.Input
        asChild
        className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        description={
          description ? (
            <div id={descriptionId} className="mt-2 text-foreground/70 text-sm">
              <RicosViewer
                content={description as RichContent}
                plugins={quickStartViewerPlugins()}
              />
            </div>
          ) : undefined
        }
      >
        <input
          id={id}
          type="text"
          value={value || ''}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          aria-describedby={descriptionId}
          aria-invalid={!!(required && !value)}
          aria-required={required}
          onChange={e => onChange(e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
        />
      </Form.Field.Input>
    </Form.Field>
  );
};

export default TextInput;
