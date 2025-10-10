import { type TextAreaProps } from '@wix/headless-forms/react';
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
}: TextAreaProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

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
      <textarea
        id={id}
        value={value || ''}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        aria-describedby={descriptionId}
        className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px]"
        onChange={e => onChange(e.target.value)}
        onBlur={() => onBlur()}
        onFocus={() => onFocus()}
      />
      {description && (
        <div id={descriptionId} className="mt-2 text-foreground/70 text-sm">
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default TextArea;
