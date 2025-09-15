import { type ImageChoiceProps } from '@wix/headless-forms/react';

const ImageChoice = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  numberOfColumns = 1,
  multiple = false,
  onChange,
  onBlur,
  onFocus,
}: ImageChoiceProps) => {
  return (
    <div>
      {showLabel && (
        <label
          htmlFor={id}
          style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}
        >
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </label>
      )}
    </div>
  );
};

export default ImageChoice;
