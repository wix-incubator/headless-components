import React, { useState } from 'react';
import { Address, getDefaultCountryList } from '@wix/headless-components';

// Basic address display example
function BasicAddressExample() {
  const addressData = {
    address: {
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      countryName: 'United States',
    },
    countryList: getDefaultCountryList(),
    locale: 'en-US',
    format: 'multi-line',
    showCountry: true,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading text-foreground">
        Multi-line Format
      </h3>
      <Address.Root address={addressData}>
        <div className="p-4 border border-foreground rounded-lg bg-background">
          <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
        </div>
      </Address.Root>
    </div>
  );
}

// Address formats example
function AddressFormatsExample() {
  const baseAddress = {
    line1: '123 Main Street',
    line2: 'Suite 456',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
    countryName: 'United States',
  };

  const countryList = getDefaultCountryList();

  const formats = [
    { format: 'multi-line', title: 'Multi-line Format' },
    { format: 'single-line', title: 'Single-line Format' },
    { format: 'compact', title: 'Compact Format' },
  ];

  return (
    <div className="space-y-6">
      {formats.map((formatOption) => (
        <div key={formatOption.format} className="space-y-2">
          <h3 className="text-lg font-heading text-foreground">
            {formatOption.title}
          </h3>
          <Address.Root
            address={{
              address: baseAddress,
              countryList,
              format: formatOption.format,
              showCountry: true,
            }}
          >
            <div className="p-4 border border-foreground rounded-lg bg-background">
              <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
            </div>
          </Address.Root>
        </div>
      ))}
    </div>
  );
}

// International addresses example
function InternationalAddressExample() {
  const addresses = [
    {
      title: 'US Address',
      address: {
        line1: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        postalCode: '20500',
        country: 'US',
        countryName: 'United States',
      },
    },
    {
      title: 'UK Address',
      address: {
        line1: '10 Downing Street',
        city: 'London',
        postalCode: 'SW1A 2AA',
        country: 'GB',
        countryName: 'United Kingdom',
      },
    },
    {
      title: 'Canadian Address',
      address: {
        line1: '24 Sussex Drive',
        city: 'Ottawa',
        state: 'ON',
        postalCode: 'K1M 1M4',
        country: 'CA',
        countryName: 'Canada',
      },
    },
    {
      title: 'German Address',
      address: {
        line1: 'Platz der Republik 1',
        city: 'Berlin',
        postalCode: '11011',
        country: 'DE',
        countryName: 'Germany',
      },
    },
  ];

  const countryList = getDefaultCountryList();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addressInfo) => (
          <div key={addressInfo.title} className="space-y-2">
            <h3 className="text-lg font-heading text-foreground">
              {addressInfo.title}
            </h3>
            <Address.Root
              address={{
                address: addressInfo.address,
                countryList,
                format: 'multi-line',
                showCountry: true,
              }}
            >
              <div className="p-4 border border-foreground rounded-lg bg-background">
                <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
              </div>
            </Address.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

// Address form example with validation and submission
function AddressFormExample() {
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAddress, setSubmittedAddress] = useState(null);

  const countries = getDefaultCountryList();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with address:', address);
    setSubmittedAddress({ ...address });
    setIsSubmitted(true);

    // Reset confirmation after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSubmittedAddress(null);
    }, 3000);
  };

  const handleReset = () => {
    console.log('Form reset');
    setAddress({
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
    setIsSubmitted(false);
    setSubmittedAddress(null);
  };

  const isFormValid =
    address.line1 && address.city && address.postalCode && address.country;

  console.log('Current address state:', address);
  console.log('Form is valid:', isFormValid);

  return (
    <Address.Root address={{address}}>
      <div className="space-y-6">
        <Address.Label
          label="Shipping Address"
          className="text-lg font-heading text-foreground"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Address.Form
            address={address}
            onAddressChange={(newAddress) => {
              console.log('Address changed:', newAddress);
              setAddress(newAddress);
            }}
            validation={{
              required: ['line1', 'city', 'postalCode', 'country'],
              customValidation: (address) => {
                const errors = {};

                // Custom validation for postal code based on country
                if (address.country === 'US' && address.postalCode) {
                  const usZipPattern = /^\d{5}(-\d{4})?$/;
                  if (!usZipPattern.test(address.postalCode)) {
                    errors.postalCode =
                      'US ZIP code must be in format 12345 or 12345-6789';
                  }
                }

                if (address.country === 'CA' && address.postalCode) {
                  const caPostalPattern =
                    /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
                  if (!caPostalPattern.test(address.postalCode)) {
                    errors.postalCode = 'Canadian postal code format: A1A 1A1';
                  }
                }

                // Custom validation for line1 length
                if (address.line1 && address.line1.length < 5) {
                  errors.line1 =
                    'Street address must be at least 5 characters long';
                }

                return errors;
              },
            }}
            countryList={countries}
          >
            <div className="grid grid-cols-1 gap-4">
              <Address.FormLine1Input
                placeholder="Street address"
                className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <Address.FormLine2Input
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Address.FormCityInput
                  placeholder="City"
                  className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />

                <Address.FormStateInput
                  placeholder="State / Province"
                  className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Address.FormPostalCodeInput
                  placeholder="ZIP / Postal code"
                  className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />

                <Address.FormCountrySelect
                  placeholder="Select country"
                  className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </Address.Form>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2 rounded-lg font-paragraph transition-colors ${
                isFormValid
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary text-secondary-foreground cursor-not-allowed opacity-50'
              }`}
            >
              {isSubmitted ? '✅ Address Saved!' : 'Save Address'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 rounded-lg border border-foreground text-foreground hover:bg-secondary font-paragraph transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>

        {/* Debug info */}
        <div className="mt-4 p-3 bg-secondary/20 rounded-lg text-sm font-paragraph">
          <strong>Debug Info:</strong>
          <div>Line1: {address.line1 || '(empty)'}</div>
          <div>City: {address.city || '(empty)'}</div>
          <div>PostalCode: {address.postalCode || '(empty)'}</div>
          <div>Country: {address.country || '(empty)'}</div>
          <div>Form Valid: {isFormValid ? 'Yes' : 'No'}</div>
        </div>

        {/* Live preview */}
        {address.line1 && (
          <div className="mt-6 p-4 border border-foreground rounded-lg bg-secondary">
            <h3 className="text-lg font-heading text-foreground mb-2">
              Live Preview:
            </h3>
            <Address.Root address={{ address, countryList: countries }}>
              <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
            </Address.Root>
          </div>
        )}

        {/* Submitted address confirmation */}
        {isSubmitted && submittedAddress && (
          <div className="mt-6 p-4 border border-green-500 bg-green-500/20 rounded-lg">
            <h3 className="text-lg font-heading text-foreground mb-2">
              ✅ Address Successfully Saved:
            </h3>
            <Address.Root
              address={{ address: submittedAddress, countryList: countries }}
            >
              <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
            </Address.Root>
          </div>
        )}
      </div>
    </Address.Root>
  );
}

// Individual address components example
function IndividualComponentsExample() {
  const address = {
    line1: '1 Apple Park Way',
    line2: 'Building A',
    city: 'Cupertino',
    state: 'CA',
    postalCode: '95014',
    country: 'US',
    countryName: 'United States',
  };

  const countryList = getDefaultCountryList();

  return (
    <div className="space-y-6">
      <Address.Root address={{ address, countryList }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-heading text-foreground">
              Address Lines
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-paragraph text-secondary-foreground">
                Street Address:
              </label>
              <div className="p-3 border border-foreground rounded-lg bg-background">
                <Address.Line1 className="text-foreground font-paragraph" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-paragraph text-secondary-foreground">
                Address Line 2:
              </label>
              <div className="p-3 border border-foreground rounded-lg bg-background">
                <Address.Line2 className="text-foreground font-paragraph" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-heading text-foreground">
              Location Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-paragraph text-secondary-foreground">
                  City:
                </label>
                <div className="p-3 border border-foreground rounded-lg bg-background">
                  <Address.City className="text-foreground font-paragraph" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-paragraph text-secondary-foreground">
                  State:
                </label>
                <div className="p-3 border border-foreground rounded-lg bg-background">
                  <Address.State className="text-foreground font-paragraph" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-paragraph text-secondary-foreground">
                  Postal Code:
                </label>
                <div className="p-3 border border-foreground rounded-lg bg-background">
                  <Address.PostalCode className="text-foreground font-paragraph" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-paragraph text-secondary-foreground">
                  Country:
                </label>
                <div className="p-3 border border-foreground rounded-lg bg-background">
                  <Address.Country className="text-foreground font-paragraph" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            Complete Address
          </h3>
          <div className="p-4 border-2 border-primary rounded-lg bg-primary/10">
            <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line text-lg" />
          </div>
        </div>
      </Address.Root>
    </div>
  );
}

// Simple working form example as fallback
function SimpleFormExample() {
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleInputChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! Check console for details.');
    console.log('Submitted address:', address);
  };

  const isValid =
    address.line1 && address.city && address.postalCode && address.country;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-heading text-foreground">
        Simple Working Form
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Street Address"
          value={address.line1}
          onChange={(e) => handleInputChange('line1', e.target.value)}
          className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph"
        />

        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph"
        />

        <input
          type="text"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) => handleInputChange('postalCode', e.target.value)}
          className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph"
        />

        <select
          value={address.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-foreground rounded-lg font-paragraph"
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
        </select>

        <button
          type="submit"
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg font-paragraph transition-colors ${
            isValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground cursor-not-allowed opacity-50'
          }`}
        >
          Submit Simple Form
        </button>
      </form>

      <div className="p-3 bg-secondary/20 rounded-lg text-sm font-paragraph">
        <strong>Current Values:</strong>
        <pre>{JSON.stringify(address, null, 2)}</pre>
      </div>
    </div>
  );
}

// AsChild pattern example
function AsChildPatternExample() {
  const address = {
    line1: '350 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10118',
    country: 'US',
    countryName: 'United States',
  };

  const countryList = getDefaultCountryList();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-heading text-foreground">
          Custom Card Layout
        </h3>
        <Address.Root address={{ address, countryList }}>
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-xl border border-primary/30">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Address.Line1 asChild>
                  <h4 className="text-xl font-heading text-foreground" />
                </Address.Line1>
                <div className="text-secondary-foreground font-paragraph">
                  <Address.City className="inline" />
                  <span className="mx-1">•</span>
                  <Address.State className="inline" />
                  <span className="mx-1">•</span>
                  <Address.PostalCode className="inline" />
                </div>
                <Address.Country asChild>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30" />
                </Address.Country>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xl">📍</span>
                </div>
              </div>
            </div>
          </div>
        </Address.Root>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-heading text-foreground">
          Badge Style Components
        </h3>
        <Address.Root address={{ address, countryList }}>
          <div className="flex flex-wrap gap-2">
            <Address.Line1 asChild>
              <div className="px-3 py-1 bg-background border border-foreground rounded-full text-sm font-paragraph text-foreground" />
            </Address.Line1>
            <Address.City asChild>
              <div className="px-3 py-1 bg-primary/20 border border-primary rounded-full text-sm font-paragraph text-primary" />
            </Address.City>
            <Address.State asChild>
              <div className="px-3 py-1 bg-secondary/20 border border-secondary rounded-full text-sm font-paragraph text-secondary-foreground" />
            </Address.State>
            <Address.PostalCode asChild>
              <div className="px-3 py-1 bg-background border border-foreground rounded-full text-sm font-paragraph text-foreground" />
            </Address.PostalCode>
            <Address.Country asChild>
              <div className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-sm font-paragraph text-green-500" />
            </Address.Country>
          </div>
        </Address.Root>
      </div>
    </div>
  );
}

// Main component that exports all examples
export default function AddressExamples() {
  const [selectedExample, setSelectedExample] = useState('display');

  const examples = [
    {
      id: 'display',
      title: 'Basic Display',
      component: <BasicAddressExample />,
      description: 'Simple address display with default formatting',
    },
    {
      id: 'formats',
      title: 'Format Options',
      component: <AddressFormatsExample />,
      description:
        'Different address formatting options: multi-line, single-line, and compact',
    },
    {
      id: 'international',
      title: 'International',
      component: <InternationalAddressExample />,
      description: 'International addresses from different countries',
    },
    {
      id: 'form',
      title: 'Interactive Form',
      component: <AddressFormExample />,
      description:
        'Complete address form with validation, submission, and country/state support',
    },
    {
      id: 'simple',
      title: 'Simple Form Test',
      component: <SimpleFormExample />,
      description: 'Basic working form to test functionality (debugging)',
    },
    {
      id: 'components',
      title: 'Individual Components',
      component: <IndividualComponentsExample />,
      description: 'Using individual address components separately',
    },
    {
      id: 'aschild',
      title: 'Custom Styling',
      component: <AsChildPatternExample />,
      description: 'Custom styling using the asChild pattern',
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-wrap gap-2 mb-6">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedExample(example.id)}
            className={`px-4 py-2 rounded-lg border transition-colors font-paragraph ${
              selectedExample === example.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-foreground hover:bg-secondary'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {examples
          .filter((example) => example.id === selectedExample)
          .map((example) => (
            <div key={example.id} className="space-y-4">
              <div>
                <h3 className="text-xl font-heading text-foreground mb-2">
                  {example.title}
                </h3>
                <p className="text-secondary-foreground font-paragraph">
                  {example.description}
                </p>
              </div>

              <div className="border border-foreground rounded-lg p-6 bg-background">
                {example.component}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
