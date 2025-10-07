# Address Interface Documentation

A comprehensive generic address display and input component system built with composable primitives, similar to Radix UI architecture.

## Table of Contents

### Components

- [Address.Root](#addressroot)
- [Address.Line1](#addressline1)
- [Address.Line2](#addressline2)
- [Address.City](#addresscity)
- [Address.State](#addressstate)
- [Address.PostalCode](#addresspostalcode)
- [Address.Country](#addresscountry)
- [Address.CountryCode](#addresscountrycode)
- [Address.Formatted](#addressformatted)
- [Address.Form](#addressform)
- [Address.FormLine1Input](#addressformline1input)
- [Address.FormLine2Input](#addressformline2input)
- [Address.FormCityInput](#addressformcityinput)
- [Address.FormStateInput](#addressformstateinput)
- [Address.FormPostalCodeInput](#addressformpostalcodeinput)
- [Address.FormCountrySelect](#addressformcountryselect)
- [Address.Label](#addresslabel)

---

## Architecture

The Address component follows a compound component pattern where each part can be composed together to create flexible address displays and input forms for various contexts including shipping, billing, contact information, and more.

## Components

### Address.Root

The root container that provides address context to all child components.

**Props**

```tsx
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

interface AddressRootProps {
  address: AddressData;
  children: React.ReactNode;
}
```

## Country Data Utilities

### getDefaultCountryList()

The Address component provides a default country list with major countries and their states/provinces:

```tsx
import { Address, getDefaultCountryList } from '@wix/headless';

const countries = getDefaultCountryList();

// Use with AddressData
const addressData = {
  address: {
    line1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
  },
  countryList: countries, // Provides validation and state options
};

<Address.Root address={addressData}>
  <Address.Formatted />
</Address.Root>;
```

---

## Components

### Address.Root

The root container for address display and interaction.

**Props**

```tsx
interface AddressRootProps {
  address: AddressData;
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="address-root"` - Applied to root container
- `data-country` - ISO country code (e.g., "US", "CA", "GB")
- `data-format` - Address format (single-line | multi-line | compact)
- `data-complete` - Is address complete/valid

**Example**

```tsx
<Address.Root
  address={{
    address: {
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      countryName: 'United States',
    },
    locale: 'en-US',
    format: 'multi-line',
    showCountry: true,
  }}
>
  <Address.Formatted />
</Address.Root>
```

---

### Address.Line1

Displays the first address line (street address).

**Props**

```tsx
interface AddressLine1Props {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          line1: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-line1"` - Applied to line1 element

**Example**

```tsx
// Default usage
<Address.Line1 className="text-foreground" />

// Custom rendering with forwardRef
<Address.Line1 asChild>
  {React.forwardRef(({ line1, ...props }, ref) => (
    <span ref={ref} {...props} className="font-medium text-foreground">
      {line1}
    </span>
  ))}
</Address.Line1>
```

---

### Address.Line2

Displays the second address line (apartment, suite, etc.). Only renders if line2 exists.

**Props**

```tsx
interface AddressLine2Props {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          line2: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-line2"` - Applied to line2 element

**Example**

```tsx
// Default usage
<Address.Line2 className="text-foreground" />

// Custom rendering with forwardRef
<Address.Line2 asChild>
  {React.forwardRef(({ line2, ...props }, ref) => (
    <span ref={ref} {...props} className="text-secondary-foreground">
      {line2}
    </span>
  ))}
</Address.Line2>
```

---

### Address.City

Displays the city name.

**Props**

```tsx
interface AddressCityProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          city: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-city"` - Applied to city element

**Example**

```tsx
// Default usage
<Address.City className="text-foreground" />

// Custom rendering with forwardRef
<Address.City asChild>
  {React.forwardRef(({ city, ...props }, ref) => (
    <span ref={ref} {...props} className="text-foreground">
      {city}
    </span>
  ))}
</Address.City>
```

---

### Address.State

Displays the state/province. Only renders if state exists.

**Props**

```tsx
interface AddressStateProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          state: string;
        }
      >;
  asChild?: boolean;
  showFullName?: boolean; // Show full state name vs abbreviation - default false
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-state"` - Applied to state element

**Example**

```tsx
// Default usage
<Address.State className="text-foreground" />

// Show full state name
<Address.State showFullName className="text-foreground" />

// Custom rendering with forwardRef
<Address.State asChild>
  {React.forwardRef(({ state, ...props }, ref) => (
    <span ref={ref} {...props} className="text-foreground">
      {state}
    </span>
  ))}
</Address.State>
```

---

### Address.PostalCode

Displays the postal/ZIP code.

**Props**

```tsx
interface AddressPostalCodeProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          postalCode: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-postal-code"` - Applied to postal code element

**Example**

```tsx
// Default usage
<Address.PostalCode className="text-foreground" />

// Custom rendering with forwardRef
<Address.PostalCode asChild>
  {React.forwardRef(({ postalCode, ...props }, ref) => (
    <span ref={ref} {...props} className="font-mono text-foreground">
      {postalCode}
    </span>
  ))}
</Address.PostalCode>
```

---

### Address.Country

Displays the full country name.

**Props**

```tsx
interface AddressCountryProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          countryName: string;
          countryCode: string;
        }
      >;
  asChild?: boolean;
  showCode?: boolean; // Show country code alongside name - default false
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-country"` - Applied to country element

**Example**

```tsx
// Default usage
<Address.Country className="text-foreground" />

// Show country code alongside name
<Address.Country showCode className="text-foreground" />

// Custom rendering with forwardRef
<Address.Country asChild>
  {React.forwardRef(({ countryName, countryCode, ...props }, ref) => (
    <span ref={ref} {...props} className="text-foreground">
      {countryName}
    </span>
  ))}
</Address.Country>
```

---

### Address.CountryCode

Displays the ISO country code.

**Props**

```tsx
interface AddressCountryCodeProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          countryCode: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-country-code"` - Applied to country code element

**Example**

```tsx
// Default usage
<Address.CountryCode className="text-secondary-foreground text-sm" />

// Custom rendering with forwardRef
<Address.CountryCode asChild>
  {React.forwardRef(({ countryCode, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      title={getCountryName(countryCode)}
      className="text-secondary-foreground text-sm font-mono"
    >
      {countryCode}
    </span>
  ))}
</Address.CountryCode>
```

---

### Address.Formatted

Displays the fully formatted address according to locale and format settings.

**Props**

```tsx
interface AddressFormattedProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          formattedAddress: string;
        }
      >;
  asChild?: boolean;
  separator?: string; // Separator for single-line format - default ', '
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-formatted"` - Applied to formatted address element

**Example**

```tsx
// Default usage
<Address.Formatted className="text-foreground whitespace-pre-line" />

// Custom separator for single-line format
<Address.Formatted separator=" • " className="text-foreground" />

// Custom rendering with forwardRef
<Address.Formatted asChild>
  {React.forwardRef(({ formattedAddress, ...props }, ref) => (
    <span ref={ref} {...props} className="not-italic text-foreground">
      {formattedAddress}
    </span>
  ))}
</Address.Formatted>
```

---

### Address.Form

Container for address input form. Provides form context for address inputs.

The Form component can get address data and country data from two sources:

1. **Initial Address Data** - Gets initial values from parent `Address.Root` component context
2. **Country Data** - `countryList` prop (takes precedence) or from parent `Address.Root` component

This allows you to either pass country data directly to the form or set it at the Address.Root level for use by all child components. The form will automatically initialize with any address data provided by the Address.Root context, making it easy to create forms for editing existing addresses.

**Props**

```tsx
interface AddressFormProps {
  onAddressChange: (address: Address) => void;
  children: React.ReactNode;
  validation?: {
    required?: string[]; // Array of required field names
    customValidation?: (address: Address) => Record<string, string>;
  };
  countryList?: CountryOption[]; // Available countries for selection
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
```

**Data Attributes**

- `data-testid="address-form"` - Applied to form container

**Example**

```tsx
// Creating a new address form (starts empty)
<Address.Root address={{ address: {}, countryList: countries }}>
  <Address.Form onAddressChange={setAddressData}>
    <Address.FormLine1Input />
    <Address.FormCityInput />
    <Address.FormPostalCodeInput />
    <Address.FormCountrySelect />
  </Address.Form>
</Address.Root>

// Editing an existing address (pre-filled with data)
<Address.Root address={{
  address: existingAddress,
  countryList: countries
}}>
  <Address.Form onAddressChange={setAddressData}>
    <Address.FormLine1Input />
    <Address.FormCityInput />
    <Address.FormPostalCodeInput />
    <Address.FormCountrySelect />
  </Address.Form>
</Address.Root>
```

---

### Address.FormLine1Input

Input field for first address line.

**Props**

```tsx
interface AddressFormLine1InputProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          value: string;
          onChange: (value: string) => void;
          error?: string;
        }
      >;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-form-line1-input"` - Applied to input element
- `data-error` - Has validation error

**Example**

```tsx
// Default usage
<Address.FormLine1Input
  placeholder="Street address"
  className="w-full px-3 py-2 border border-background rounded-lg"
  required
/>

// Custom rendering with forwardRef
<Address.FormLine1Input asChild>
  {React.forwardRef(({ value, onChange, error, ...props }, ref) => (
    <div className="space-y-1">
      <input
        ref={ref}
        {...props}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg ${
          error ? 'border-destructive' : 'border-background'
        }`}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ))}
</Address.FormLine1Input>
```

---

### Address.FormLine2Input

Input field for second address line.

**Props**

```tsx
interface AddressFormLine2InputProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          value: string;
          onChange: (value: string) => void;
          error?: string;
        }
      >;
  asChild?: boolean;
  placeholder?: string;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-form-line2-input"` - Applied to input element
- `data-error` - Has validation error

**Example**

```tsx
// Default usage
<Address.FormLine2Input
  placeholder="Apartment, suite, unit, etc. (optional)"
  className="w-full px-3 py-2 border border-background rounded-lg"
/>
```

---

### Address.FormCityInput

Input field for city.

**Props**

```tsx
interface AddressFormCityInputProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          value: string;
          onChange: (value: string) => void;
          error?: string;
        }
      >;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-form-city-input"` - Applied to input element
- `data-error` - Has validation error

**Example**

```tsx
// Default usage
<Address.FormCityInput
  placeholder="City"
  className="w-full px-3 py-2 border border-background rounded-lg"
  required
/>
```

---

### Address.FormStateInput

Input field for state/province. Renders as select if states are provided, otherwise as text input.

**Props**

```tsx
interface AddressFormStateInputProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          value: string;
          onChange: (value: string) => void;
          error?: string;
          states?: StateOption[];
        }
      >;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-form-state-input"` - Applied to input element
- `data-type` - Input type (input | select)
- `data-error` - Has validation error

**Example**

```tsx
// Default usage
<Address.FormStateInput
  placeholder="State"
  className="w-full px-3 py-2 border border-background rounded-lg"
/>
```

---

### Address.FormPostalCodeInput

Input field for postal/ZIP code.

**Props**

```tsx
interface AddressFormPostalCodeInputProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          value: string;
          onChange: (value: string) => void;
          error?: string;
        }
      >;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  pattern?: string; // Regex pattern for validation
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-form-postal-code-input"` - Applied to input element
- `data-error` - Has validation error

**Example**

```tsx
// Default usage
<Address.FormPostalCodeInput
  placeholder="ZIP / Postal code"
  className="w-full px-3 py-2 border border-background rounded-lg"
  required
/>

// With pattern validation for US ZIP codes
<Address.FormPostalCodeInput
  placeholder="ZIP code"
  pattern="^\d{5}(-\d{4})?$"
  className="w-full px-3 py-2 border border-background rounded-lg"
  required
/>
```

---

### Address.FormCountrySelect

Select dropdown for country selection.

**Props**

```tsx
interface AddressFormCountrySelectProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          value: string;
          onChange: (value: string) => void;
          error?: string;
          countries: CountryOption[];
        }
      >;
  asChild?: boolean;
  placeholder?: string;
  required?: boolean;
  showCodes?: boolean; // Show country codes in options - default false
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-form-country-select"` - Applied to select element
- `data-error` - Has validation error

**Example**

```tsx
// Default usage
<Address.FormCountrySelect
  placeholder="Select country"
  className="w-full px-3 py-2 border border-background rounded-lg"
  required
/>

// Show country codes alongside names
<Address.FormCountrySelect
  showCodes
  className="w-full px-3 py-2 border border-background rounded-lg"
/>

// Custom rendering with forwardRef
<Address.FormCountrySelect asChild>
  {React.forwardRef(({ value, onChange, countries, error, ...props }, ref) => (
    <div className="space-y-1">
      <select
        ref={ref}
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg ${
          error ? 'border-destructive' : 'border-background'
        }`}
      >
        <option value="">Select country</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ))}
</Address.FormCountrySelect>
```

---

### Address.Label

Displays a label/description for the address context.

**Props**

```tsx
interface AddressLabelProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          label: string;
        }
      >;
  asChild?: boolean;
  label: string;
  htmlFor?: string; // For accessibility when used with form inputs
  required?: boolean; // Show required indicator
  className?: string;
}
```

**Data Attributes**

- `data-testid="address-label"` - Applied to label element
- `data-required` - Is field required

**Example**

```tsx
// Default usage
<Address.Label
  label="Shipping Address"
  className="text-sm font-medium text-foreground mb-2"
/>

// As form label
<Address.Label
  label="Billing Address"
  htmlFor="address-form"
  required
  className="text-sm font-medium text-foreground"
/>

// Custom rendering with forwardRef
<Address.Label asChild label="Delivery Address" required>
  {React.forwardRef(({ label, required, ...props }, ref) => (
    <h3 ref={ref} {...props} className="text-lg font-semibold text-foreground mb-3">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </h3>
  ))}
</Address.Label>
```

---

## Usage Examples

### Basic Address Display

```tsx
function BasicAddress() {
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
    locale: 'en-US',
    format: 'multi-line',
    showCountry: true,
  };

  return (
    <Address.Root address={addressData}>
      <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
    </Address.Root>
  );
}
```

### Custom Address Layout

```tsx
function CustomAddressLayout() {
  const addressData = {
    address: {
      line1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90210',
      country: 'US',
      countryName: 'United States',
    },
    format: 'compact',
    locale: 'en-US',
    showCountry: true,
  };

  return (
    <Address.Root address={addressData}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Address.Line1 className="font-heading text-foreground" />
          <Address.Line2 className="font-paragraph text-secondary-foreground" />
        </div>
        <div className="flex items-center gap-1 text-sm text-secondary-foreground font-paragraph">
          <Address.City />
          <Address.State asChild>
            {React.forwardRef<
              HTMLSpanElement,
              { state: string } & React.HTMLAttributes<HTMLSpanElement>
            >(({ state, ...props }, ref) => (
              <span ref={ref} {...props}>
                , {state}
              </span>
            ))}
          </Address.State>
          <Address.PostalCode className="font-paragraph" />
        </div>
        <Address.Country className="text-xs text-secondary-foreground font-paragraph" />
      </div>
    </Address.Root>
  );
}
```

### Address Form

```tsx
function AddressForm() {
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  return (
    <div className="space-y-6">
      <Address.Root address={{ address: {}, countryList: countries }}>
        <Address.Label
          label="Shipping Address"
          className="text-lg font-heading text-foreground"
        />

        <Address.Form
          onAddressChange={setAddress}
          validation={{
            required: ['line1', 'city', 'postalCode', 'country'],
            customValidation: (address) => {
              const errors: Record<string, string> = {};

              // Custom validation for postal code based on country
              if (address.country === 'US' && address.postalCode) {
                const usZipPattern = /^\d{5}(-\d{4})?$/;
                if (!usZipPattern.test(address.postalCode)) {
                  errors.postalCode =
                    'US ZIP code must be in format 12345 or 12345-6789';
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
        >
          <div className="grid grid-cols-1 gap-4">
            <Address.FormLine1Input
              placeholder="Street address"
              className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
              required
            />

            <Address.FormLine2Input
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Address.FormCityInput
                placeholder="City"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
                required
              />

              <Address.FormStateInput
                placeholder="State"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Address.FormPostalCodeInput
                placeholder="ZIP / Postal code"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
                required
              />

              <Address.FormCountrySelect
                placeholder="Select country"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </Address.Form>
      </Address.Root>
    </div>
  );
}
```

### Edit Existing Address

```tsx
function EditAddressForm({ existingAddress }) {
  const [address, setAddress] = useState(existingAddress);

  const countries = getDefaultCountryList();

  return (
    <div className="space-y-6">
      <Address.Root
        address={{ address: existingAddress, countryList: countries }}
      >
        <Address.Label
          label="Edit Address"
          className="text-lg font-heading text-foreground"
        />

        <Address.Form
          onAddressChange={setAddress}
          validation={{
            required: ['line1', 'city', 'postalCode', 'country'],
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <Address.FormLine1Input
              placeholder="Street address"
              className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
              required
            />

            <Address.FormLine2Input
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Address.FormCityInput
                placeholder="City"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
                required
              />

              <Address.FormStateInput
                placeholder="State"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Address.FormPostalCodeInput
                placeholder="ZIP / Postal code"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
                required
              />

              <Address.FormCountrySelect
                placeholder="Select country"
                className="w-full px-3 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </Address.Form>
      </Address.Root>
    </div>
  );
}
```

### Shipping & Billing Addresses

```tsx
function CheckoutAddresses() {
  const [shippingAddress, setShippingAddress] = useState({});
  const [billingAddress, setBillingAddress] = useState({});
  const [sameAsShipping, setSameAsShipping] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Shipping Address */}
      <div className="space-y-4">
        <Address.Root
          address={{ address: {}, countryList: getDefaultCountryList() }}
        >
          <Address.Label
            label="Shipping Address"
            required
            className="text-lg font-heading text-foreground"
          />

          <Address.Form
            onAddressChange={setShippingAddress}
            validation={{
              required: ['line1', 'city', 'postalCode', 'country'],
            }}
          >
            <div className="space-y-4">
              <Address.FormLine1Input
                placeholder="Street address"
                className="w-full px-3 py-2 border border-foreground rounded-lg"
                required
              />
              <Address.FormLine2Input
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full px-3 py-2 border border-foreground rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <Address.FormCityInput
                  placeholder="City"
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                  required
                />
                <Address.FormStateInput
                  placeholder="State"
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Address.FormPostalCodeInput
                  placeholder="ZIP code"
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                  required
                />
                <Address.FormCountrySelect
                  placeholder="Country"
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                  required
                />
              </div>
            </div>
          </Address.Form>
        </Address.Root>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Address.Label
            label="Billing Address"
            className="text-lg font-heading text-foreground"
          />
          <label className="flex items-center gap-2 text-sm font-paragraph">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="rounded border-foreground"
            />
            Same as shipping
          </label>
        </div>

        {sameAsShipping ? (
          <Address.Root
            address={{
              address: shippingAddress,
              format: 'multi-line',
              locale: 'en-US',
            }}
          >
            <div className="p-4 bg-background border border-foreground rounded-lg">
              <Address.Formatted className="text-secondary-foreground whitespace-pre-line font-paragraph" />
            </div>
          </Address.Root>
        ) : (
          <Address.Root
            address={{ address: {}, countryList: getDefaultCountryList() }}
          >
            <Address.Form
              onAddressChange={setBillingAddress}
              validation={{
                required: ['line1', 'city', 'postalCode', 'country'],
              }}
            >
              <div className="space-y-4">
                <Address.FormLine1Input
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                  required
                />
                <Address.FormLine2Input
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Address.FormCityInput
                    placeholder="City"
                    className="w-full px-3 py-2 border border-foreground rounded-lg"
                    required
                  />
                  <Address.FormStateInput
                    placeholder="State"
                    className="w-full px-3 py-2 border border-foreground rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Address.FormPostalCodeInput
                    placeholder="ZIP code"
                    className="w-full px-3 py-2 border border-foreground rounded-lg"
                    required
                  />
                  <Address.FormCountrySelect
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-foreground rounded-lg"
                    required
                  />
                </div>
              </div>
            </Address.Form>
          </Address.Root>
        )}
      </div>
    </div>
  );
}
```

### International Address Support

```tsx
function InternationalAddress() {
  const [address, setAddress] = useState({ country: '' });
  const [countries] = useState([
    {
      code: 'US',
      name: 'United States',
      states: [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' },
        { code: 'TX', name: 'Texas' },
      ],
    },
    {
      code: 'CA',
      name: 'Canada',
      states: [
        { code: 'ON', name: 'Ontario' },
        { code: 'BC', name: 'British Columbia' },
        { code: 'QC', name: 'Quebec' },
      ],
    },
    {
      code: 'GB',
      name: 'United Kingdom',
    },
  ]);

  const selectedCountry = countries.find((c) => c.code === address.country);

  return (
    <Address.Root address={{ address: {}, countryList: countries }}>
      <Address.Form onAddressChange={setAddress} countryList={countries}>
        <div className="space-y-4">
          <Address.FormCountrySelect
            placeholder="Select country first"
            className="w-full px-3 py-2 border border-foreground rounded-lg"
            required
          />

          {address.country && (
            <>
              <Address.FormLine1Input
                placeholder={
                  address.country === 'GB'
                    ? 'House number and street name'
                    : 'Street address'
                }
                className="w-full px-3 py-2 border border-foreground rounded-lg"
                required
              />

              <Address.FormLine2Input
                placeholder={
                  address.country === 'GB'
                    ? 'Flat, suite, unit, building (optional)'
                    : 'Apartment, suite, etc. (optional)'
                }
                className="w-full px-3 py-2 border border-foreground rounded-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Address.FormCityInput
                  placeholder={
                    address.country === 'GB' ? 'Town or City' : 'City'
                  }
                  className="w-full px-3 py-2 border border-foreground rounded-lg"
                  required
                />

                {selectedCountry?.states ? (
                  <Address.FormStateInput
                    type="select"
                    placeholder={
                      address.country === 'CA' ? 'Province' : 'State'
                    }
                    className="w-full px-3 py-2 border border-foreground rounded-lg"
                  />
                ) : (
                  <Address.FormStateInput
                    placeholder={
                      address.country === 'GB'
                        ? 'County (optional)'
                        : 'State/Province'
                    }
                    className="w-full px-3 py-2 border border-foreground rounded-lg"
                  />
                )}
              </div>

              <Address.FormPostalCodeInput
                placeholder={
                  address.country === 'US'
                    ? 'ZIP code'
                    : address.country === 'CA'
                      ? 'Postal code'
                      : address.country === 'GB'
                        ? 'Postcode'
                        : 'Postal code'
                }
                pattern={
                  address.country === 'US'
                    ? '^\\d{5}(-\\d{4})?$'
                    : address.country === 'CA'
                      ? '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$'
                      : undefined
                }
                className="w-full px-3 py-2 border border-foreground rounded-lg"
                required
              />
            </>
          )}
        </div>
      </Address.Form>
    </Address.Root>
  );
}
```

### Address Book Display

```tsx
function AddressBook({ addresses, onSelect, selectedId }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading text-foreground">Saved Addresses</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedId === addr.id
                ? 'border-primary bg-primary/5'
                : 'border-foreground hover:border-primary/50'
            }`}
            onClick={() => onSelect(addr)}
          >
            <Address.Root
              address={{
                address: addr.address,
                format: 'compact',
                locale: 'en-US',
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Address.Label
                    label={addr.label}
                    className="text-sm font-heading text-foreground"
                  />
                  {addr.isDefault && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-paragraph">
                      Default
                    </span>
                  )}
                </div>

                <Address.Formatted className="text-sm text-secondary-foreground font-paragraph" />

                <div className="flex items-center gap-2 pt-2">
                  <button className="text-xs text-primary hover:text-primary/80 font-paragraph">
                    Edit
                  </button>
                  <span className="text-xs text-secondary-foreground">•</span>
                  <button className="text-xs text-destructive hover:text-destructive/80 font-paragraph">
                    Delete
                  </button>
                </div>
              </div>
            </Address.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
```
