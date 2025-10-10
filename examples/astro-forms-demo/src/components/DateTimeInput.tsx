import { type DateTimeInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const DateTimeInput = ({
  id,
  value,
  label,
  showLabel,
  showDateLabels,
  showPlaceholder,
  use24HourFormat,
  acceptedDates,
  required,
  readOnly,
  description,
  onChange,
  onBlur,
  onFocus,
}: DateTimeInputProps) => {
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

      <input
        id={id}
        type="datetime-local"
        value={value || ''}
        required={required}
        readOnly={readOnly}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={descriptionId}
        className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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

export default DateTimeInput;
