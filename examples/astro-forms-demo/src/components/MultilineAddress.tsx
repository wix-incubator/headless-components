import { type MultilineAddressProps } from '@wix/headless-forms/react';

const MultilineAddress = ({
  id,
  value,
  label,
  required,
  readOnly,
  showAddressLine2,
  addressLine2Required,
  onChange,
  onBlur,
  onFocus,
}: MultilineAddressProps) => {
  const handleFieldChange = (field: keyof typeof value, fieldValue: string) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange(newValue);
  };

  return (
    <fieldset>
      <legend>{label}</legend>

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-streetNumber`}>Street Number</label>
        <input
          id={`${id}-streetNumber`}
          type="text"
          value={value?.streetNumber || ''}
          required={required}
          readOnly={readOnly}
          onChange={e => handleFieldChange('streetNumber', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-streetName`}>Street Name</label>
        <input
          id={`${id}-streetName`}
          type="text"
          value={value?.streetName || ''}
          required={required}
          readOnly={readOnly}
          onChange={e => handleFieldChange('streetName', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-addressLine`}>Address Line</label>
        <input
          id={`${id}-addressLine`}
          type="text"
          value={value?.addressLine || ''}
          required={required}
          readOnly={readOnly}
          onChange={e => handleFieldChange('addressLine', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      {showAddressLine2 && (
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor={`${id}-addressLine2`}>Address Line 2</label>
          <input
            id={`${id}-addressLine2`}
            type="text"
            value={value?.addressLine2 || ''}
            required={addressLine2Required}
            readOnly={readOnly}
            onChange={e => handleFieldChange('addressLine2', e.target.value)}
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
            style={{ width: '100%', marginTop: '4px' }}
          />
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-apartment`}>Apartment</label>
        <input
          id={`${id}-apartment`}
          type="text"
          value={value?.apartment || ''}
          readOnly={readOnly}
          onChange={e => handleFieldChange('apartment', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-city`}>City</label>
        <input
          id={`${id}-city`}
          type="text"
          value={value?.city || ''}
          required={required}
          readOnly={readOnly}
          onChange={e => handleFieldChange('city', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      {/* Subdivision */}
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-subdivision`}>State/Province</label>
        <input
          id={`${id}-subdivision`}
          type="text"
          value={value?.subdivision || ''}
          readOnly={readOnly}
          onChange={e => handleFieldChange('subdivision', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-postalCode`}>Postal Code</label>
        <input
          id={`${id}-postalCode`}
          type="text"
          value={value?.postalCode || ''}
          required={required}
          readOnly={readOnly}
          onChange={e => handleFieldChange('postalCode', e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label htmlFor={`${id}-country`}>Country</label>
        <select
          id={`${id}-country`}
          value={value?.country || ''}
          required={required}
          disabled={readOnly}
          onChange={e => handleFieldChange('country', e.target.value as any)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ width: '100%', marginTop: '4px' }}
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </select>
      </div>
    </fieldset>
  );
};

export default MultilineAddress;
