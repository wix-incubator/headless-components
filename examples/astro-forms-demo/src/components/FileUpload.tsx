import { type FileUploadProps } from '@wix/headless-forms/react';
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

  const validateFiles = (files: FileList | null) => {
    if (!files) return true;

    // Check max files
    if (maxFiles && files.length > maxFiles) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      return false;
    }

    // Check allowed file formats
    if (allowedFileFormats && allowedFileFormats.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isAllowed = allowedFileFormats.some(format =>
          fileExtension === format.toLowerCase() ||
          file.type.startsWith(format.toLowerCase())
        );

        if (!isAllowed) {
          console.warn(`File ${file.name} is not in allowed formats: ${allowedFileFormats.join(', ')}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleFileChangeWithValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (validateFiles(files)) {
      handleFileChange(event);
    } else {
      // Reset the input if validation fails
      event.target.value = '';
    }
  };

  // Convert allowedFileFormats to accept string for HTML input
  const acceptString = allowedFileFormats?.map(format =>
    format.startsWith('.') ? format : `.${format.toLowerCase()}`
  ).join(',');

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="file"
        required={required}
        readOnly={readOnly}
        accept={acceptString}
        multiple={maxFiles !== 1}
        aria-describedby={descriptionId}
        onChange={handleFileChangeWithValidation}
        onBlur={() => onBlur()}
        onFocus={() => onFocus()}
      />
      {buttonText && (
        <button type="button" onClick={() => document.getElementById(id)?.click()}>
          {buttonText}
        </button>
      )}
      {description && (
        <div id={descriptionId}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
      {explanationText && (
        <div className="file-upload-explanation">
          {explanationText}
        </div>
      )}
      {value && value.length > 0 && (
        <div>
          <p>Selected files:</p>
          <ul>
            {value.map((file, index) => (
              <li key={file.fileId || index}>
                {file.displayName} ({file.fileType})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
