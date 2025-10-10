import { type SignatureProps } from '@wix/headless-forms/react';

const Signature = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  imageUploadEnabled,
  onChange,
  onBlur,
  onFocus,
}: SignatureProps) => {
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
        type="file"
        accept="image/*"
        required={required}
        disabled={readOnly}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            onChange({
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
            });
          } else {
            onChange(null);
          }
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
      />
      {value && (
        <div className="mt-3 p-3 bg-background border border-foreground/10 rounded-lg">
          <img src={value.url} alt="" className="max-w-full h-auto rounded" />
        </div>
      )}
    </div>
  );
};

export default Signature;
