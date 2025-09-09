import { type TagsProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState } from 'react';

const Tags = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  numberOfColumns = 0,
  customOption,
  minItems,
  maxItems,
  onChange,
  onBlur,
  onFocus,
}: TagsProps) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const currentValues = value || [];
  const [customValue, setCustomValue] = useState('');

  const handleTagToggle = (optionValue: string) => {
    if (readOnly) return;

    const isSelected = currentValues.includes(optionValue);
    let newValues: string[];

    if (isSelected) {
      newValues = currentValues.filter(v => v !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }

    onChange(newValues);
    onBlur();
  };

  const handleCustomTagToggle = () => {
    if (readOnly) return;

    const isSelected = currentValues.includes('custom');
    let newValues: string[];

    if (isSelected) {
      newValues = currentValues.filter(v => v !== 'custom');
      setCustomValue('');
    } else {
      newValues = [...currentValues, 'custom'];
    }

    onChange(newValues);
    onBlur();
  };

  const handleCustomValueChange = (customText: string) => {
    if (readOnly) return;
    setCustomValue(customText);
  };

  const getColumnStyle = () => {
    if (numberOfColumns === 0) {
      return { flex: '1 1 auto', minWidth: '200px' };
    }
    const width = 100 / numberOfColumns;
    return { flex: `0 0 ${width}%`, minWidth: '200px' };
  };

  const selectedCount = currentValues.length;
  const maxSelectable = maxItems || options.length + (customOption ? 1 : 0);
  const minRequired = minItems || 0;

  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <label>
            {label}
            {required && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </label>
          <span
            style={{
              fontSize: '12px',
              color: '#666',
              backgroundColor: '#f5f5f5',
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {Array.from({ length: numberOfColumns || 1 }, (_, columnIndex) => (
          <div key={columnIndex} style={getColumnStyle()}>
            {options
              .filter(
                (_, index) =>
                  numberOfColumns === 0 ||
                  index % numberOfColumns === columnIndex
              )
              .map(option => {
                const isSelected = currentValues.includes(option.value);
                const isDisabled = readOnly;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleTagToggle(option.value)}
                    disabled={isDisabled}
                    style={{
                      padding: '6px 12px',
                      margin: '2px',
                      border: '1px solid #ccc',
                      borderRadius: '16px',
                      backgroundColor: isSelected ? '#007bff' : 'white',
                      color: isSelected ? 'white' : '#333',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      opacity: isDisabled ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (!isDisabled && !isSelected) {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#007bff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isDisabled && !isSelected) {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#ccc';
                      }
                    }}
                    onFocus={onFocus}
                  >
                    {option.label}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {customOption && (
        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            onClick={handleCustomTagToggle}
            disabled={
              readOnly ||
              (maxItems !== undefined &&
                currentValues.length >= maxItems &&
                !currentValues.includes('custom'))
            }
            style={{
              padding: '6px 12px',
              margin: '2px',
              border: '1px solid #ccc',
              borderRadius: '16px',
              backgroundColor: currentValues.includes('custom')
                ? '#007bff'
                : 'white',
              color: currentValues.includes('custom') ? 'white' : '#333',
              cursor: readOnly ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity:
                maxItems !== undefined &&
                currentValues.length >= maxItems &&
                !currentValues.includes('custom')
                  ? 0.5
                  : 1,
            }}
            onFocus={onFocus}
          >
            {customOption.label}
          </button>
          {currentValues.includes('custom') && (
            <input
              type="text"
              value={customValue}
              onChange={e => handleCustomValueChange(e.target.value)}
              placeholder={customOption.placeholder}
              disabled={readOnly}
              style={{
                marginLeft: '8px',
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                minWidth: '200px',
              }}
            />
          )}
        </div>
      )}

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

export default Tags;
