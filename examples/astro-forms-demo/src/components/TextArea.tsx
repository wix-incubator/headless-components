import { Form, type TextAreaProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const TextArea = ({
  id,
  value,
  label,
  showLabel,
  placeholder,
  required,
  readOnly,
  description,
  minLength,
  maxLength,
  onChange,
  onBlur,
  onFocus,
  target,
}: TextAreaProps) => {
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
          asChild
          className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px]"
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
          <textarea
            id={id}
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
        <Form.Field.Error path={target}>
          <span className="text-destructive text-sm font-paragraph">
            This field is required
          </span>
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default TextArea;
