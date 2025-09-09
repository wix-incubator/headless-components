import { type CheckboxGroupProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState } from 'react';

const CheckboxGroup = ({
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
  minItems,
  maxItems,
  onChange,
  onBlur,
  onFocus,
}: CheckboxGroupProps) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const currentValues = value || defaultValue || [];
  const [customValue, setCustomValue] = useState('');
  const isCustomSelected = currentValues.includes('custom');

  // Selection indicator logic
  const selectedCount = currentValues.length;
  const totalOptions = options.length + (customOption ? 1 : 0);
  const maxSelectable = maxItems || totalOptions;
  const minRequired = minItems || 0;

  const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
    if (readOnly) return;

    let newValues: string[];
    if (isChecked) {
      // Check maxItems limit
      if (maxItems !== undefined && currentValues.length >= maxItems) {
        return; // Don't allow selection if maxItems limit reached
      }
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }

    onChange(newValues);
    onBlur();
  };

  const handleCustomValueChange = (customText: string) => {
    if (readOnly) return;
    setCustomValue(customText);

    // Remove old custom value and add new one
    const filteredValues = currentValues.filter(v => v !== 'custom' && v !== customValue);
    const newValues = customText ? [...filteredValues, customText] : filteredValues;
    onChange(newValues);
  };

  const handleCustomCheckboxChange = (isChecked: boolean) => {
    if (readOnly) return;

    let newValues: string[];
    if (isChecked) {
      newValues = [...currentValues, 'custom'];
    } else {
      newValues = currentValues.filter(v => v !== 'custom' && v !== customValue);
    }

    onChange(newValues);
  };

  const handleCheckboxFocus = () => {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>
            {label}
            {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
          </label>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            {selectedCount}/{maxSelectable} selected
            {minRequired > 0 && (
              <span style={{ marginLeft: '4px', fontSize: '10px' }}>
                (min: {minRequired})
              </span>
            )}
          </span>
        </div>
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
                  const isChecked = currentValues.includes(option.value);
                  const isMaxReached = maxItems !== undefined && currentValues.length >= maxItems && !isChecked;
                  const isDisabled = readOnly || isMaxReached;

                  return (
                    <div
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                        opacity: isMaxReached ? 0.5 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        id={optionId}
                        name={id}
                        value={option.value}
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                        onFocus={handleCheckboxFocus}
                        disabled={isDisabled}
                        style={{
                          marginRight: '8px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                        }}
                        aria-describedby={descriptionId}
                      />
                      <label
                        htmlFor={optionId}
                        style={{
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          color: isMaxReached ? '#999' : 'inherit',
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
                opacity: maxItems !== undefined && currentValues.length >= maxItems && !isCustomSelected ? 0.5 : 1,
              }}
            >
              <input
                type="checkbox"
                id={`${id}-custom`}
                name={id}
                value="custom"
                checked={isCustomSelected}
                onChange={(e) => handleCustomCheckboxChange(e.target.checked)}
                onFocus={handleCheckboxFocus}
                disabled={readOnly || (maxItems !== undefined && currentValues.length >= maxItems && !isCustomSelected)}
                style={{
                  marginRight: '8px',
                  cursor: readOnly || (maxItems !== undefined && currentValues.length >= maxItems && !isCustomSelected) ? 'not-allowed' : 'pointer',
                }}
                aria-describedby={descriptionId}
              />
              <label
                htmlFor={`${id}-custom`}
                style={{
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

export default CheckboxGroup;
