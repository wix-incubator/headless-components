import { Form, type FileUploadProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const FileUpload = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  buttonText,
  maxFiles,
  allowedFileFormats,
  explanationText,
  onChange,
  onBlur,
  onFocus,
  errorMessage,
}: FileUploadProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      onChange(null);
      return;
    }

    // Convert FileList to FileData array
    const fileDataArray = Array.from(files).map((file, index) => ({
      fileId: `file_${Date.now()}_${index}`,
      displayName: file.name,
      url: URL.createObjectURL(file), // Temporary URL for preview
      fileType: file.type || 'application/octet-stream',
    }));

    onChange(fileDataArray);
  };

  // Convert allowedFileFormats to accept string for HTML input
  const acceptString = allowedFileFormats
    ?.map(format =>
      format.startsWith('.') ? format : `.${format.toLowerCase()}`
    )
    .join(',');

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
          className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
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
          <input
            id={id}
            type="file"
            required={required}
            readOnly={readOnly}
            accept={acceptString}
            multiple={maxFiles !== 1}
            aria-describedby={descriptionId}
            aria-invalid={!!(required && !value)}
            aria-required={required}
            onChange={handleFileChange}
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
          />
          {buttonText && (
            <button
              type="button"
              onClick={() => document.getElementById(id)?.click()}
              className="mt-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph rounded-lg hover:opacity-90 transition-opacity"
            >
              {buttonText}
            </button>
          )}
          {explanationText && (
            <div className="mt-2 text-foreground/60 text-sm">
              {explanationText}
            </div>
          )}
          {value && value.length > 0 && (
            <div className="mt-3 p-3 bg-background border border-foreground/10 rounded-lg">
              <p className="text-foreground font-paragraph font-semibold mb-2">
                Selected files:
              </p>
              <ul className="space-y-1">
                {value.map((file, index) => (
                  <li
                    key={file.fileId || index}
                    className="text-foreground/80 text-sm"
                  >
                    {file.displayName} ({file.fileType})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {errorMessage}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default FileUpload;
