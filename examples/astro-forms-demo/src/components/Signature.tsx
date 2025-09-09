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
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        type="file"
        accept="image/*"
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
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default Signature;
