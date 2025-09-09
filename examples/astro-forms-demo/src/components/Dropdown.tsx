import { type DropdownProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  options,
  placeholder = 'Select an option...',
  onChange,
  onBlur,
  onFocus,
}: DropdownProps) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (readOnly) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      onFocus();
    } else {
      onBlur();
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (readOnly) return;
    onChange(optionValue);
    setIsOpen(false);
    onBlur();
  };

  return (
    <div>
      {showLabel && (
        <label htmlFor={id}>
          {label}
          {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <div
        ref={dropdownRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        <button
          type="button"
          onClick={handleToggle}
          disabled={readOnly}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: readOnly ? '#f5f5f5' : 'white',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={descriptionId}
        >
          <span style={{ color: selectedOption ? 'inherit' : '#999' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {isOpen ? '▲' : '▼'}
            </span>
          </div>
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
            role="listbox"
          >
            {options.length === 0 ? (
              <div
                style={{
                  padding: '8px 12px',
                  color: '#999',
                  fontSize: '14px',
                  fontStyle: 'italic',
                }}
              >
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: option.value === value ? '#e3f2fd' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: option.value === value ? '#1976d2' : 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    if (option.value !== value) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (option.value !== value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <span style={{ fontSize: '12px', color: '#1976d2' }}>✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

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

export default Dropdown;
