# Address Interface Documentation

A simplified international address display component system built with [@fragaria/address-formatter](https://github.com/fragaria/address-formatter) for proper worldwide address formatting.

## Table of Contents

### Components

- [Address.Root](#addressroot)
- [Address.Formatted](#addressformatted)
- [Address.Lines](#addresslines)

---

## Architecture

The Address component has been simplified to use only 3 components that leverage the powerful @fragaria/address-formatter library for international address formatting. This approach provides:

- **Automatic international formatting** - Follows local formatting conventions for 200+ countries
- **Simplified API** - Only 3 components instead of many individual field components
- **Flexible rendering** - Choose between formatted string or array of lines

The Address component follows a compound component pattern where each part can be composed together to create flexible address displays for various contexts including shipping, billing, contact information, and more.

## Components

---

### Address.Root

The root container that initializes address data and provides context for formatting.

**Props**

```tsx
interface AddressData {
  houseNumber?: string;
  road?: string;
  neighbourhood?: string;
  city?: string;
  postcode?: string;
  county?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  ...
}

interface AddressRootProps {
  address: AddressData;
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="address-root"` - Applied to root container
- `data-country-code` - ISO country code (e.g., "US", "CA", "GB")

**Example**

```tsx
<Address.Root
  address={{
    houseNumber: '301',
    road: 'Hamilton Avenue',
    neighbourhood: 'Crescent Park',
    city: 'Palo Alto',
    postcode: '94303',
    county: 'Santa Clara County',
    state: 'California',
    country: 'United States of America',
    countryCode: 'US',
  }}
>
  <Address.Formatted />
</Address.Root>
```

---

### Address.Formatted

Displays the fully formatted address as a single string using international formatting rules.

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
  className?: string;
  abbreviate?: boolean; // Abbreviate common names (Avenue -> Ave) - default false
  countryCode?: string; // Override country code for formatting
  fallbackCountryCode?: string; // Fallback if country code is invalid
  appendCountry?: boolean; // Whether to append country name - default false
}
```

**Data Attributes**

- `data-testid="address-formatted"` - Applied to formatted address element
- `data-abbreviated` - Whether abbreviations are used
- `data-append-country` - Whether country is appended

**Example**

```tsx
// Default usage - follows country-specific formatting rules
<Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />

// With abbreviations (Avenue -> Ave, Road -> Rd, etc.)
<Address.Formatted
  abbreviate
  className="text-foreground whitespace-pre-line font-paragraph"
/>

// Force specific country formatting
<Address.Formatted
  countryCode="GB"
  className="text-foreground whitespace-pre-line font-paragraph"
/>

// With country appended
<Address.Formatted
  appendCountry
  className="text-foreground whitespace-pre-line font-paragraph"
/>

// Custom rendering with forwardRef
<Address.Formatted asChild>
  {React.forwardRef(({ formattedAddress, ...props }, ref) => (
    <div ref={ref} {...props} className="not-italic text-foreground font-paragraph">
      {formattedAddress}
    </div>
  ))}
</Address.Formatted>
```

---

### Address.Lines

Provides the address as an array of lines for custom rendering and layout control.

**Props**

```tsx
interface AddressLinesProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
    HTMLElement,
    {
      lines: string[];
    }
  >;
  asChild?: boolean;
  className?: string;
  abbreviate?: boolean; // Abbreviate common names (Avenue -> Ave) - default false
  countryCode?: string; // Override country code for formatting
  fallbackCountryCode?: string; // Fallback if country code is invalid
  appendCountry?: boolean; // Whether to append country name - default false
}
```

**Data Attributes**

- `data-testid="address-lines"` - Applied to lines container
- `data-line-count` - Number of address lines
- `data-abbreviated` - Whether abbreviations are used
- `data-append-country` - Whether country is appended

**Example**

```tsx
// Default usage - renders as div with each line in separate div
<Address.Lines className="space-y-1" />

// Custom rendering with access to lines array
<Address.Lines asChild>
  {React.forwardRef(({ lines, ...props }, ref) => (
    <ul ref={ref} {...props} className="list-none space-y-1">
      {lines.map((line, index) => (
        <li key={index} className="text-foreground font-paragraph">
          {line}
        </li>
      ))}
    </ul>
  ))}
</Address.Lines>

// Custom layout - horizontal with separators
<Address.Lines asChild>
  {React.forwardRef(({ lines, ...props }, ref) => (
    <span ref={ref} {...props} className="text-foreground font-paragraph">
      {lines.join(' • ')}
    </span>
  ))}
</Address.Lines>

// Custom styling per line
<Address.Lines asChild>
  {React.forwardRef(({ lines, ...props }, ref) => (
    <div ref={ref} {...props} className="space-y-1">
      {lines.map((line, index) => (
        <div
          key={index}
          className={index === 0 ? 'font-heading text-foreground' : 'font-paragraph text-secondary-foreground'}
        >
          {line}
        </div>
      ))}
    </div>
  ))}
</Address.Lines>
```

---

## Usage Examples

### Basic Address Display

```tsx
function BasicAddress() {
  const address = {
    houseNumber: '301',
    road: 'Hamilton Avenue',
    neighbourhood: 'Crescent Park',
    city: 'Palo Alto',
    postcode: '94303',
    county: 'Santa Clara County',
    state: 'California',
    country: 'United States of America',
    countryCode: 'US',
  };

  return (
    <Address.Root address={address}>
      <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
    </Address.Root>
  );
}
```

### International Address Examples

```tsx
function InternationalAddresses() {
  const addresses = [
    // US Address
    {
      houseNumber: '1600',
      road: 'Pennsylvania Avenue NW',
      city: 'Washington',
      state: 'DC',
      postcode: '20500',
      countryCode: 'US',
    },
    // UK Address
    {
      houseNumber: '10',
      road: 'Downing Street',
      city: 'London',
      postcode: 'SW1A 2AA',
      countryCode: 'GB',
    },
    // French Address
    {
      houseNumber: '55',
      road: 'Rue du Faubourg Saint-Honoré',
      city: 'Paris',
      postcode: '75008',
      countryCode: 'FR',
    },
  ];

  return (
    <div className="space-y-6">
      {addresses.map((address, index) => (
        <Address.Root key={index} address={address}>
          <div className="p-4 border border-foreground rounded-lg">
            <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
          </div>
        </Address.Root>
      ))}
    </div>
  );
}
```

### Custom Line Layout

```tsx
function CustomAddressLayout() {
  const address = {
    houseNumber: '456',
    road: 'Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postcode: '90210',
    countryCode: 'US',
  };

  return (
    <Address.Root address={address}>
      <Address.Lines asChild>
        {React.forwardRef(({ lines, ...props }, ref) => (
          <div ref={ref} {...props} className="space-y-1">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`
                  ${index === 0 ? 'font-heading text-lg text-foreground' : 'font-paragraph text-secondary-foreground'}
                  ${index === lines.length - 1 ? 'text-xs uppercase tracking-wide' : ''}
                `}
              >
                {line}
              </div>
            ))}
          </div>
        ))}
      </Address.Lines>
    </Address.Root>
  );
}
```

### Address Comparison

```tsx
function AddressComparison() {
  const address = {
    houseNumber: '123',
    road: 'Main Street',
    city: 'Springfield',
    state: 'IL',
    postcode: '62701',
    countryCode: 'US',
  };

  return (
    <Address.Root address={address}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Format */}
        <div className="space-y-2">
          <h3 className="font-heading text-foreground">Standard Format</h3>
          <div className="p-3 bg-background border border-foreground rounded">
            <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
          </div>
        </div>

        {/* Abbreviated Format */}
        <div className="space-y-2">
          <h3 className="font-heading text-foreground">Abbreviated Format</h3>
          <div className="p-3 bg-background border border-foreground rounded">
            <Address.Formatted
              abbreviate
              className="text-foreground whitespace-pre-line font-paragraph"
            />
          </div>
        </div>

        {/* Single Line Format */}
        <div className="space-y-2">
          <h3 className="font-heading text-foreground">Single Line</h3>
          <div className="p-3 bg-background border border-foreground rounded">
            <Address.Lines asChild>
              {React.forwardRef(({ lines, ...props }, ref) => (
                <span
                  ref={ref}
                  {...props}
                  className="text-foreground font-paragraph"
                >
                  {lines.join(', ')}
                </span>
              ))}
            </Address.Lines>
          </div>
        </div>

        {/* Custom Styled Lines */}
        <div className="space-y-2">
          <h3 className="font-heading text-foreground">Custom Styling</h3>
          <div className="p-3 bg-background border border-foreground rounded">
            <Address.Lines asChild>
              {React.forwardRef(({ lines, ...props }, ref) => (
                <div ref={ref} {...props} className="space-y-1">
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className={`
                        ${index === 0 ? 'font-bold text-primary' : 'font-paragraph text-secondary-foreground'}
                        ${index === 1 ? 'text-sm' : ''}
                      `}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ))}
            </Address.Lines>
          </div>
        </div>
      </div>
    </Address.Root>
  );
}
```

### Business Card Layout

```tsx
function BusinessCard({ contact }) {
  return (
    <div className="max-w-sm bg-background border border-foreground rounded-lg p-6 shadow-lg">
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-xl text-foreground">
            {contact.name}
          </h2>
          <p className="font-paragraph text-secondary-foreground">
            {contact.title}
          </p>
        </div>

        <Address.Root address={contact.address}>
          <Address.Lines asChild>
            {React.forwardRef(({ lines, ...props }, ref) => (
              <div ref={ref} {...props} className="space-y-0.5">
                {lines.map((line, index) => (
                  <div
                    key={index}
                    className="text-sm text-secondary-foreground font-paragraph"
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </Address.Lines>
        </Address.Root>

        <div className="text-sm text-secondary-foreground font-paragraph">
          <div>{contact.phone}</div>
          <div>{contact.email}</div>
        </div>
      </div>
    </div>
  );
}
```

### Address List

```tsx
function AddressList({ addresses, onSelect }) {
  return (
    <div className="space-y-3">
      {addresses.map((addressData, index) => (
        <div
          key={index}
          className="p-4 border border-foreground rounded-lg hover:border-primary cursor-pointer transition-colors"
          onClick={() => onSelect(addressData)}
        >
          <Address.Root address={addressData.address}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {addressData.label && (
                  <div className="font-heading text-sm text-foreground mb-1">
                    {addressData.label}
                  </div>
                )}
                <Address.Formatted className="text-secondary-foreground text-sm whitespace-pre-line font-paragraph" />
              </div>

              {addressData.isDefault && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-paragraph">
                  Default
                </span>
              )}
            </div>
          </Address.Root>
        </div>
      ))}
    </div>
  );
}
```

## Supported Countries

The address formatter supports formatting rules for 200+ countries worldwide, including:

- **Americas**: United States, Canada, Mexico, Brazil, Argentina, etc.
- **Europe**: United Kingdom, Germany, France, Italy, Spain, Netherlands, etc.
- **Asia-Pacific**: Japan, Australia, China, India, South Korea, etc.
- **Middle East & Africa**: UAE, Saudi Arabia, South Africa, etc.

Each country follows its local postal conventions for address ordering, punctuation, and formatting.
