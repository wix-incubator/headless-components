import { type RadioGroupProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState } from 'react';

const RadioGroup = ({
  id,
  value,
  defaultValue,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  numberOfColumns = 1,
  customOption,
  onChange,
  onBlur,
  onFocus,
}: RadioGroupProps) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const currentValue = value || defaultValue;
  const [customValue, setCustomValue] = useState('');
  const isCustomSelected = currentValue === 'custom';

  const handleRadioChange = (optionValue: string) => {
    if (readOnly) return;
    onChange(optionValue);
    onBlur();
  };

  const handleCustomValueChange = (customText: string) => {
    if (readOnly) return;
    setCustomValue(customText);
    onChange(customText);
  };

  const handleRadioFocus = () => {
    if (readOnly) return;
    onFocus();
  };

  const getColumnStyle = () => {
    const columnWidth = numberOfColumns === 1 ? '100%' : numberOfColumns === 2 ? '50%' : '33.33%';
    return {
      display: 'flex',
      flexDirection: 'column' as const,
      width: columnWidth,
      paddingRight: '8px',
    };
  };

  return (
    <div>
      {showLabel && (
        <label>
          {label}
          {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <fieldset
        style={{
          border: 'none',
          padding: 0,
          margin: '8px 0 0 0',
        }}
        aria-describedby={descriptionId}
        aria-required={required}
      >
        <legend style={{ display: 'none' }}>{label}</legend>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0',
          }}
        >
          {Array.from({ length: numberOfColumns }, (_, columnIndex) => (
            <div key={columnIndex} style={getColumnStyle()}>
              {options
                .filter((_, index) => index % numberOfColumns === columnIndex)
                .map((option) => {
                  const optionId = `${id}-option-${option.id}`;
                  const isChecked = currentValue === option.value;

                  return (
                    <div
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <input
                        type="radio"
                        id={optionId}
                        name={id}
                        value={option.value}
                        checked={isChecked}
                        onChange={() => handleRadioChange(option.value)}
                        onFocus={handleRadioFocus}
                        disabled={readOnly}
                        style={{
                          marginRight: '8px',
                          cursor: readOnly ? 'default' : 'pointer',
                        }}
                        aria-describedby={descriptionId}
                      />
                      <label
                        htmlFor={optionId}
                        style={{
                          cursor: readOnly ? 'default' : 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        {option.label}
                      </label>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>

        {customOption && (
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <input
                type="radio"
                id={`${id}-custom`}
                name={id}
                value="custom"
                checked={isCustomSelected}
                onChange={() => handleRadioChange('custom')}
                onFocus={handleRadioFocus}
                disabled={readOnly}
                style={{
                  marginRight: '8px',
                  cursor: readOnly ? 'default' : 'pointer',
                }}
                aria-describedby={descriptionId}
              />
              <label
                htmlFor={`${id}-custom`}
                style={{
                  cursor: readOnly ? 'default' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {customOption.label}
              </label>
            </div>

            {isCustomSelected && (
              <input
                type="text"
                value={customValue}
                onChange={(e) => handleCustomValueChange(e.target.value)}
                placeholder={customOption.placeholder}
                disabled={readOnly}
                style={{
                  marginLeft: '24px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '200px',
                }}
                aria-describedby={descriptionId}
              />
            )}
          </div>
        )}
      </fieldset>

      {description && (
        <div id={descriptionId} style={{ marginTop: '8px' }}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default RadioGroup;
