import { Form, type MultilineAddressProps } from '@wix/headless-forms/react';

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
  errorMessage,
}: MultilineAddressProps) => {
  const handleFieldChange = (field: keyof typeof value, fieldValue: string) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange(newValue);
  };

  return (
    <Form.Field id={id}>
      <Form.Field.InputWrapper>
        <Form.Field.Input asChild>
          <fieldset className="mb-6 p-4 border border-foreground/20 rounded-lg">
            <legend className="text-foreground font-paragraph font-semibold px-2">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </legend>

            <div className="mb-4">
              <label
                htmlFor={`${id}-streetNumber`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                Street Number
              </label>
              <input
                id={`${id}-streetNumber`}
                type="text"
                value={value?.streetNumber || ''}
                required={required}
                readOnly={readOnly}
                onChange={e =>
                  handleFieldChange('streetNumber', e.target.value)
                }
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`${id}-streetName`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                Street Name
              </label>
              <input
                id={`${id}-streetName`}
                type="text"
                value={value?.streetName || ''}
                required={required}
                readOnly={readOnly}
                onChange={e => handleFieldChange('streetName', e.target.value)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`${id}-addressLine`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                Address Line
              </label>
              <input
                id={`${id}-addressLine`}
                type="text"
                value={value?.addressLine || ''}
                required={required}
                readOnly={readOnly}
                onChange={e => handleFieldChange('addressLine', e.target.value)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {showAddressLine2 && (
              <div className="mb-4">
                <label
                  htmlFor={`${id}-addressLine2`}
                  className="block text-foreground font-paragraph text-sm mb-1"
                >
                  Address Line 2
                </label>
                <input
                  id={`${id}-addressLine2`}
                  type="text"
                  value={value?.addressLine2 || ''}
                  required={addressLine2Required}
                  readOnly={readOnly}
                  onChange={e =>
                    handleFieldChange('addressLine2', e.target.value)
                  }
                  onBlur={() => onBlur()}
                  onFocus={() => onFocus()}
                  className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor={`${id}-apartment`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                Apartment
              </label>
              <input
                id={`${id}-apartment`}
                type="text"
                value={value?.apartment || ''}
                readOnly={readOnly}
                onChange={e => handleFieldChange('apartment', e.target.value)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`${id}-city`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                City
              </label>
              <input
                id={`${id}-city`}
                type="text"
                value={value?.city || ''}
                required={required}
                readOnly={readOnly}
                onChange={e => handleFieldChange('city', e.target.value)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`${id}-subdivision`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                State/Province
              </label>
              <input
                id={`${id}-subdivision`}
                type="text"
                value={value?.subdivision || ''}
                readOnly={readOnly}
                onChange={e => handleFieldChange('subdivision', e.target.value)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`${id}-postalCode`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                Postal Code
              </label>
              <input
                id={`${id}-postalCode`}
                type="text"
                value={value?.postalCode || ''}
                required={required}
                readOnly={readOnly}
                onChange={e => handleFieldChange('postalCode', e.target.value)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor={`${id}-country`}
                className="block text-foreground font-paragraph text-sm mb-1"
              >
                Country
              </label>
              <select
                id={`${id}-country`}
                value={value?.country || ''}
                required={required}
                disabled={readOnly}
                onChange={e =>
                  handleFieldChange('country', e.target.value as any)
                }
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                className="w-full px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
        </Form.Field.Input>
        <Form.Field.Error className="text-destructive text-sm font-paragraph">
          {errorMessage}
        </Form.Field.Error>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default MultilineAddress;
