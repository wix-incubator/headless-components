import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

// ==========================================
// TestIds Enum
// ==========================================

enum TestIds {
  // Root container
  addressRoot = 'address-root',

  // Basic components
  addressLine1 = 'address-line1',
  addressLine2 = 'address-line2',
  addressCity = 'address-city',
  addressState = 'address-state',
  addressPostalCode = 'address-postal-code',
  addressCountry = 'address-country',
  addressCountryCode = 'address-country-code',
  addressFormatted = 'address-formatted',
  addressLabel = 'address-label',

  // Form components
  addressForm = 'address-form',
  addressFormLine1Input = 'address-form-line1-input',
  addressFormLine2Input = 'address-form-line2-input',
  addressFormCityInput = 'address-form-city-input',
  addressFormStateInput = 'address-form-state-input',
  addressFormPostalCodeInput = 'address-form-postal-code-input',
  addressFormCountrySelect = 'address-form-country-select',
}

// ==========================================
// Type Definitions
// ==========================================

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string; // ISO country code (e.g., "US", "CA", "GB")
  countryName?: string; // Full country name (e.g., "United States")
}

interface AddressData {
  address: Address;
  formattedAddress?: string;
  locale?: string; // For formatting - defaults to 'en-US'
  format?: 'single-line' | 'multi-line' | 'compact'; // default 'multi-line'
  showCountry?: boolean; // Whether to show country - default true
  countryList?: CountryOption[]; // Available countries for selection and validation
}

interface CountryOption {
  code: string; // ISO country code
  name: string; // Country display name
  states?: StateOption[]; // Available states/provinces
}

interface StateOption {
  code: string; // State/province code
  name: string; // State/province display name
}

// ==========================================
// Context
// ==========================================

interface AddressContextValue {
  addressData: AddressData;
}

const AddressContext = React.createContext<AddressContextValue | null>(null);

function useAddressContext(): AddressContextValue {
  const context = React.useContext(AddressContext);
  if (!context) {
    throw new Error(
      'useAddressContext must be used within an Address.Root component',
    );
  }
  return context;
}

// ==========================================
// Form Context
// ==========================================

interface AddressFormContextValue {
  address: Address;
  onAddressChange: (address: Address) => void;
  validation?: {
    required?: string[]; // Array of required field names
    customValidation?: (address: Address) => Record<string, string>;
  };
  countryList?: CountryOption[];
  errors: Record<string, string>;
}

const AddressFormContext = React.createContext<AddressFormContextValue | null>(
  null,
);

function useAddressFormContext(): AddressFormContextValue {
  const context = React.useContext(AddressFormContext);
  if (!context) {
    throw new Error(
      'useAddressFormContext must be used within an Address.Form component',
    );
  }
  return context;
}

// ==========================================
// Utility Functions
// ==========================================

function formatAddress(addressData: AddressData): string {
  if (addressData.formattedAddress) {
    return addressData.formattedAddress;
  }

  const { address, format = 'multi-line', showCountry = true } = addressData;
  const parts: string[] = [];

  // Line 1 (required)
  if (address.line1) {
    parts.push(address.line1);
  }

  // Line 2 (optional)
  if (address.line2) {
    parts.push(address.line2);
  }

  // City, State, Postal Code
  const cityStateParts: string[] = [];
  if (address.city) {
    cityStateParts.push(address.city);
  }
  if (address.state) {
    cityStateParts.push(address.state);
  }
  if (address.postalCode) {
    cityStateParts.push(address.postalCode);
  }

  if (cityStateParts.length > 0) {
    if (format === 'single-line') {
      parts.push(cityStateParts.join(', '));
    } else {
      parts.push(cityStateParts.join(' '));
    }
  }

  // Country (optional)
  if (showCountry && address.countryName) {
    parts.push(address.countryName);
  }

  // Join parts based on format
  if (format === 'single-line') {
    return parts.join(', ');
  } else {
    return parts.join('\n');
  }
}

function validateAddress(
  address: Address,
  validation?: AddressFormContextValue['validation'],
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!validation) return errors;

  // Check required fields
  if (validation.required) {
    validation.required.forEach((field) => {
      const value = address[field as keyof Address];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[field] = `${field} is required`;
      }
    });
  }

  // Custom validation
  if (validation.customValidation) {
    const customErrors = validation.customValidation(address);
    // Merge custom errors into the main errors object
    Object.assign(errors, customErrors);
  }

  return errors;
}

function getCountryName(
  countryCode: string,
  countryList?: CountryOption[],
): string {
  // First try to find from countryList if available
  if (countryList) {
    const country = countryList.find((c) => c.code === countryCode);
    if (country) return country.name;
  }

  // Fallback to simplified mapping
  const countryMap: Record<string, string> = {
    US: 'United States',
    CA: 'Canada',
    GB: 'United Kingdom',
    FR: 'France',
    DE: 'Germany',
    JP: 'Japan',
    AU: 'Australia',
  };
  return countryMap[countryCode] || countryCode;
}

function getCountryStates(
  countryCode: string,
  countryList?: CountryOption[],
): StateOption[] | undefined {
  if (!countryList) return undefined;

  const country = countryList.find((c) => c.code === countryCode);
  return country?.states;
}

// Default country data for common countries with states/provinces
export function getDefaultCountryList(): CountryOption[] {
  return [
    {
      code: 'US',
      name: 'United States',
      states: [
        { code: 'AL', name: 'Alabama' },
        { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' },
        { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' },
        { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' },
        { code: 'DE', name: 'Delaware' },
        { code: 'FL', name: 'Florida' },
        { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' },
        { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' },
        { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' },
        { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' },
        { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' },
        { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' },
        { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' },
        { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' },
        { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' },
        { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' },
        { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' },
        { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' },
        { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' },
        { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' },
        { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' },
        { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' },
        { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' },
        { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' },
        { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' },
        { code: 'WY', name: 'Wyoming' },
      ],
    },
    {
      code: 'CA',
      name: 'Canada',
      states: [
        { code: 'AB', name: 'Alberta' },
        { code: 'BC', name: 'British Columbia' },
        { code: 'MB', name: 'Manitoba' },
        { code: 'NB', name: 'New Brunswick' },
        { code: 'NL', name: 'Newfoundland and Labrador' },
        { code: 'NT', name: 'Northwest Territories' },
        { code: 'NS', name: 'Nova Scotia' },
        { code: 'NU', name: 'Nunavut' },
        { code: 'ON', name: 'Ontario' },
        { code: 'PE', name: 'Prince Edward Island' },
        { code: 'QC', name: 'Quebec' },
        { code: 'SK', name: 'Saskatchewan' },
        { code: 'YT', name: 'Yukon' },
      ],
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      states: [
        { code: 'ENG', name: 'England' },
        { code: 'SCT', name: 'Scotland' },
        { code: 'WLS', name: 'Wales' },
        { code: 'NIR', name: 'Northern Ireland' },
      ],
    },
    {
      code: 'AU',
      name: 'Australia',
      states: [
        { code: 'NSW', name: 'New South Wales' },
        { code: 'QLD', name: 'Queensland' },
        { code: 'SA', name: 'South Australia' },
        { code: 'TAS', name: 'Tasmania' },
        { code: 'VIC', name: 'Victoria' },
        { code: 'WA', name: 'Western Australia' },
        { code: 'ACT', name: 'Australian Capital Territory' },
        { code: 'NT', name: 'Northern Territory' },
      ],
    },
    {
      code: 'DE',
      name: 'Germany',
      states: [
        { code: 'BW', name: 'Baden-Württemberg' },
        { code: 'BY', name: 'Bavaria' },
        { code: 'BE', name: 'Berlin' },
        { code: 'BB', name: 'Brandenburg' },
        { code: 'HB', name: 'Bremen' },
        { code: 'HH', name: 'Hamburg' },
        { code: 'HE', name: 'Hesse' },
        { code: 'MV', name: 'Mecklenburg-Vorpommern' },
        { code: 'NI', name: 'Lower Saxony' },
        { code: 'NW', name: 'North Rhine-Westphalia' },
        { code: 'RP', name: 'Rhineland-Palatinate' },
        { code: 'SL', name: 'Saarland' },
        { code: 'SN', name: 'Saxony' },
        { code: 'ST', name: 'Saxony-Anhalt' },
        { code: 'SH', name: 'Schleswig-Holstein' },
        { code: 'TH', name: 'Thuringia' },
      ],
    },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'ZA', name: 'South Africa' },
  ];
}

// ==========================================
// Components
// ==========================================

// Address.Root Component Props
interface AddressRootProps {
  address: AddressData;
  children: React.ReactNode;
}

// Address.Root Component
export const Root = React.forwardRef<HTMLElement, AddressRootProps>(
  (props, ref) => {
    const { address, children } = props;

    const contextValue: AddressContextValue = {
      addressData: address,
    };

    const attributes = {
      'data-testid': TestIds.addressRoot,
      'data-country': address.address.country,
      'data-format': address.format || 'multi-line',
      'data-complete':
        address.address.line1 &&
        address.address.city &&
        address.address.postalCode
          ? 'true'
          : 'false',
    };

    return (
      <AddressContext.Provider value={contextValue}>
        <AsChildSlot {...attributes} ref={ref}>
          {children}
        </AsChildSlot>
      </AddressContext.Provider>
    );
  },
);

Root.displayName = 'Address.Root';

// Address.Line1 Component Props
interface AddressLine1Props {
  children?: AsChildChildren<{
    line1: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Address.Line1 Component
export const Line1 = React.forwardRef<HTMLElement, AddressLine1Props>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { addressData } = useAddressContext();
    const { line1 } = addressData.address;

    if (!line1) return null;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ line1 }}
        data-testid={TestIds.addressLine1}
        className={className}
        content={line1}
      >
        <span>{line1}</span>
      </AsChildSlot>
    );
  },
);

Line1.displayName = 'Address.Line1';

// Address.Line2 Component Props
interface AddressLine2Props {
  children?: AsChildChildren<{
    line2: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Address.Line2 Component
export const Line2 = React.forwardRef<HTMLElement, AddressLine2Props>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { addressData } = useAddressContext();
    const { line2 } = addressData.address;

    if (!line2) return null;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ line2 }}
        data-testid={TestIds.addressLine2}
        className={className}
        content={line2}
      >
        <span>{line2}</span>
      </AsChildSlot>
    );
  },
);

Line2.displayName = 'Address.Line2';

// Address.City Component Props
interface AddressCityProps {
  children?: AsChildChildren<{
    city: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Address.City Component
export const City = React.forwardRef<HTMLElement, AddressCityProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { addressData } = useAddressContext();
    const { city } = addressData.address;

    if (!city) return null;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ city }}
        data-testid={TestIds.addressCity}
        className={className}
        content={city}
      >
        <span>{city}</span>
      </AsChildSlot>
    );
  },
);

City.displayName = 'Address.City';

// Address.State Component Props
interface AddressStateProps {
  children?: AsChildChildren<{
    state: string;
  }>;
  asChild?: boolean;
  showFullName?: boolean; // Show full state name vs abbreviation - default false
  className?: string;
}

// Address.State Component
export const State = React.forwardRef<HTMLElement, AddressStateProps>(
  (props, ref) => {
    const { asChild, children, className, showFullName = false } = props;
    const { addressData } = useAddressContext();
    const { state } = addressData.address;

    if (!state) return null;

    // For now, just return the state as-is
    // In a real implementation, you'd have state name mapping logic
    const displayState = showFullName ? state : state;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ state: displayState }}
        data-testid={TestIds.addressState}
        className={className}
        content={displayState}
      >
        <span>{displayState}</span>
      </AsChildSlot>
    );
  },
);

State.displayName = 'Address.State';

// Address.PostalCode Component Props
interface AddressPostalCodeProps {
  children?: AsChildChildren<{
    postalCode: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Address.PostalCode Component
export const PostalCode = React.forwardRef<HTMLElement, AddressPostalCodeProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { addressData } = useAddressContext();
    const { postalCode } = addressData.address;

    if (!postalCode) return null;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ postalCode }}
        data-testid={TestIds.addressPostalCode}
        className={className}
        content={postalCode}
      >
        <span>{postalCode}</span>
      </AsChildSlot>
    );
  },
);

PostalCode.displayName = 'Address.PostalCode';

// Address.Country Component Props
interface AddressCountryProps {
  children?: AsChildChildren<{
    countryName: string;
    countryCode: string;
  }>;
  asChild?: boolean;
  showCode?: boolean; // Show country code alongside name - default false
  className?: string;
}

// Address.Country Component
export const Country = React.forwardRef<HTMLElement, AddressCountryProps>(
  (props, ref) => {
    const { asChild, children, className, showCode = false } = props;
    const { addressData } = useAddressContext();
    const { country, countryName } = addressData.address;

    const displayCountryName =
      countryName || getCountryName(country, addressData.countryList);
    const displayText = showCode
      ? `${displayCountryName} (${country})`
      : displayCountryName;

    if (!displayCountryName) return null;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{
          countryName: displayCountryName,
          countryCode: country,
        }}
        data-testid={TestIds.addressCountry}
        className={className}
        content={displayText}
      >
        <span>{displayText}</span>
      </AsChildSlot>
    );
  },
);

Country.displayName = 'Address.Country';

// Address.CountryCode Component Props
interface AddressCountryCodeProps {
  children?: AsChildChildren<{
    countryCode: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Address.CountryCode Component
export const CountryCode = React.forwardRef<
  HTMLElement,
  AddressCountryCodeProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { addressData } = useAddressContext();
  const { country } = addressData.address;

  if (!country) return null;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{ countryCode: country }}
      data-testid={TestIds.addressCountryCode}
      className={className}
      content={country}
    >
      <span>{country}</span>
    </AsChildSlot>
  );
});

CountryCode.displayName = 'Address.CountryCode';

// Address.Formatted Component Props
interface AddressFormattedProps {
  children?: AsChildChildren<{
    formattedAddress: string;
  }>;
  asChild?: boolean;
  separator?: string; // Separator for single-line format - default ', '
  className?: string;
}

// Address.Formatted Component
export const Formatted = React.forwardRef<HTMLElement, AddressFormattedProps>(
  (props, ref) => {
    const { asChild, children, className, separator = ', ' } = props;
    const { addressData } = useAddressContext();

    const modifiedAddressData =
      separator !== ', ' && addressData.format === 'single-line'
        ? {
            ...addressData,
            formattedAddress: formatAddress(addressData).replace(
              /, /g,
              separator,
            ),
          }
        : addressData;

    const formattedAddress = formatAddress(modifiedAddressData);

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ formattedAddress }}
        data-testid={TestIds.addressFormatted}
        className={className}
        content={formattedAddress}
      >
        <span>{formattedAddress}</span>
      </AsChildSlot>
    );
  },
);

Formatted.displayName = 'Address.Formatted';

// Address.Label Component Props
interface AddressLabelProps {
  children?: AsChildChildren<{
    label: string;
  }>;
  asChild?: boolean;
  label: string;
  htmlFor?: string; // For accessibility when used with form inputs
  required?: boolean; // Show required indicator
  className?: string;
}

// Address.Label Component
export const Label = React.forwardRef<HTMLElement, AddressLabelProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      label,
      htmlFor,
      required = false,
    } = props;

    const displayText = required ? `${label} *` : label;

    const attributes = {
      'data-testid': TestIds.addressLabel,
      'data-required': required ? 'true' : undefined,
      htmlFor,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ label }}
        className={className}
        content={displayText}
        {...attributes}
      >
        <label>{displayText}</label>
      </AsChildSlot>
    );
  },
);

Label.displayName = 'Address.Label';

// ==========================================
// Form Components
// ==========================================

// Address.Form Component Props
interface AddressFormProps {
  address: Address;
  onAddressChange: (address: Address) => void;
  children: React.ReactNode;
  validation?: {
    required?: string[]; // Array of required field names
    customValidation?: (address: Address) => Record<string, string>;
  };
  countryList?: CountryOption[]; // Available countries for selection
}

// Address.Form Component
export const Form = React.forwardRef<HTMLElement, AddressFormProps>(
  (props, ref) => {
    const { address, onAddressChange, children, validation, countryList } =
      props;

    // Try to get country list from context if not provided in props
    const { addressData } = useAddressContext();
    const effectiveCountryList = countryList || addressData.countryList;

    const errors = React.useMemo(() => {
      return validateAddress(address, validation);
    }, [address, validation]);

    const contextValue: AddressFormContextValue = {
      address,
      onAddressChange,
      validation,
      countryList: effectiveCountryList,
      errors,
    };

    const attributes = {
      'data-testid': TestIds.addressForm,
    };

    return (
      <AddressFormContext.Provider value={contextValue}>
        <AsChildSlot {...attributes} ref={ref}>
          {children}
        </AsChildSlot>
      </AddressFormContext.Provider>
    );
  },
);

Form.displayName = 'Address.Form';

// Address.Form.Line1Input Component Props
interface AddressFormLine1InputProps {
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }>;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Address.FormLine1Input Component
export const FormLine1Input = React.forwardRef<
  HTMLElement,
  AddressFormLine1InputProps
>((props, ref) => {
  const { asChild, children, className, placeholder, required = false } = props;
  const { address, onAddressChange, errors } = useAddressFormContext();

  const handleChange = (value: string) => {
    onAddressChange({ ...address, line1: value });
  };

  const error = errors['line1'];

  const attributes = {
    'data-testid': TestIds.addressFormLine1Input,
    'data-error': error ? 'true' : undefined,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        value: address.line1,
        onChange: handleChange,
        error,
      }}
      className={className}
      content={null}
      {...attributes}
    >
      <input
        type="text"
        value={address.line1}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </AsChildSlot>
  );
});

FormLine1Input.displayName = 'Address.FormLine1Input';

// Address.Form.Line2Input Component Props
interface AddressFormLine2InputProps {
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }>;
  asChild?: boolean;
  placeholder?: string;
  className?: string;
}

// Address.FormLine2Input Component
export const FormLine2Input = React.forwardRef<
  HTMLElement,
  AddressFormLine2InputProps
>((props, ref) => {
  const { asChild, children, className, placeholder } = props;
  const { address, onAddressChange, errors } = useAddressFormContext();

  const handleChange = (value: string) => {
    onAddressChange({ ...address, line2: value });
  };

  const error = errors['line2'];

  const attributes = {
    'data-testid': TestIds.addressFormLine2Input,
    'data-error': error ? 'true' : undefined,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        value: address.line2 || '',
        onChange: handleChange,
        error,
      }}
      className={className}
      content={null}
      {...attributes}
    >
      <input
        type="text"
        value={address.line2 || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />
    </AsChildSlot>
  );
});

FormLine2Input.displayName = 'Address.FormLine2Input';

// Address.Form.CityInput Component Props
interface AddressFormCityInputProps {
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }>;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Address.FormCityInput Component
export const FormCityInput = React.forwardRef<
  HTMLElement,
  AddressFormCityInputProps
>((props, ref) => {
  const { asChild, children, className, placeholder, required = false } = props;
  const { address, onAddressChange, errors } = useAddressFormContext();

  const handleChange = (value: string) => {
    onAddressChange({ ...address, city: value });
  };

  const error = errors['city'];

  const attributes = {
    'data-testid': TestIds.addressFormCityInput,
    'data-error': error ? 'true' : undefined,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        value: address.city,
        onChange: handleChange,
        error,
      }}
      className={className}
      content={null}
      {...attributes}
    >
      <input
        type="text"
        value={address.city}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </AsChildSlot>
  );
});

FormCityInput.displayName = 'Address.FormCityInput';

// Address.Form.StateInput Component Props
interface AddressFormStateInputProps {
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
    states?: StateOption[];
  }>;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Address.FormStateInput Component
export const FormStateInput = React.forwardRef<
  HTMLElement,
  AddressFormStateInputProps
>((props, ref) => {
  const { asChild, children, className, placeholder, required = false } = props;
  const { address, onAddressChange, errors, countryList } =
    useAddressFormContext();

  const handleChange = (value: string) => {
    onAddressChange({ ...address, state: value });
  };

  const error = errors['state'];
  const states = getCountryStates(address.country, countryList);

  const attributes = {
    'data-testid': TestIds.addressFormStateInput,
    'data-type': states ? 'select' : 'input',
    'data-error': error ? 'true' : undefined,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        value: address.state || '',
        onChange: handleChange,
        error,
        states,
      }}
      className={className}
      content={null}
      {...attributes}
    >
      {states ? (
        <select
          value={address.state || ''}
          onChange={(e) => handleChange(e.target.value)}
          required={required}
        >
          <option value="">{placeholder || 'Select state'}</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={address.state || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </AsChildSlot>
  );
});

FormStateInput.displayName = 'Address.FormStateInput';

// Address.Form.PostalCodeInput Component Props
interface AddressFormPostalCodeInputProps {
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }>;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  pattern?: string; // Regex pattern for validation
  className?: string;
}

// Address.FormPostalCodeInput Component
export const FormPostalCodeInput = React.forwardRef<
  HTMLElement,
  AddressFormPostalCodeInputProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    placeholder,
    required = false,
    pattern,
  } = props;
  const { address, onAddressChange, errors } = useAddressFormContext();

  const handleChange = (value: string) => {
    onAddressChange({ ...address, postalCode: value });
  };

  const error = errors['postalCode'];

  const attributes = {
    'data-testid': TestIds.addressFormPostalCodeInput,
    'data-error': error ? 'true' : undefined,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        value: address.postalCode,
        onChange: handleChange,
        error,
      }}
      className={className}
      content={null}
      {...attributes}
    >
      <input
        type="text"
        value={address.postalCode}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
      />
    </AsChildSlot>
  );
});

FormPostalCodeInput.displayName = 'Address.FormPostalCodeInput';

// Address.Form.CountrySelect Component Props
interface AddressFormCountrySelectProps {
  children?: AsChildChildren<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
    countries: CountryOption[];
  }>;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  showCodes?: boolean; // Show country codes in options - default false
  className?: string;
}

// Address.FormCountrySelect Component
export const FormCountrySelect = React.forwardRef<
  HTMLElement,
  AddressFormCountrySelectProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    placeholder,
    required = false,
    showCodes = false,
  } = props;
  const {
    address,
    onAddressChange,
    errors,
    countryList = [],
  } = useAddressFormContext();

  const handleChange = (value: string) => {
    const selectedCountry = countryList.find((c) => c.code === value);
    onAddressChange({
      ...address,
      country: value,
      countryName: selectedCountry?.name,
      // Reset state when country changes
      state: '',
    });
  };

  const error = errors['country'];

  const attributes = {
    'data-testid': TestIds.addressFormCountrySelect,
    'data-error': error ? 'true' : undefined,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        value: address.country,
        onChange: handleChange,
        error,
        countries: countryList,
      }}
      className={className}
      content={null}
      {...attributes}
    >
      <select
        value={address.country}
        onChange={(e) => handleChange(e.target.value)}
        required={required}
      >
        <option value="">{placeholder || 'Select country'}</option>
        {countryList.map((country) => (
          <option key={country.code} value={country.code}>
            {showCodes ? `${country.name} (${country.code})` : country.name}
          </option>
        ))}
      </select>
    </AsChildSlot>
  );
});

FormCountrySelect.displayName = 'Address.FormCountrySelect';

// ==========================================
// Type Exports
// ==========================================

export type {
  Address,
  AddressData,
  CountryOption,
  StateOption,
  AddressContextValue,
  AddressFormContextValue,
  AddressRootProps,
  AddressLine1Props,
  AddressLine2Props,
  AddressCityProps,
  AddressStateProps,
  AddressPostalCodeProps,
  AddressCountryProps,
  AddressCountryCodeProps,
  AddressFormattedProps,
  AddressLabelProps,
  AddressFormProps,
  AddressFormLine1InputProps,
  AddressFormLine2InputProps,
  AddressFormCityInputProps,
  AddressFormStateInputProps,
  AddressFormPostalCodeInputProps,
  AddressFormCountrySelectProps,
};
