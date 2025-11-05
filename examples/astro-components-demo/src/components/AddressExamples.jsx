import React, { useState } from 'react';
import { Address } from '@wix/headless-components';

// Sample address data for different scenarios
const sampleAddresses = {
  usAddress: {
    houseNumber: '301',
    road: 'Hamilton Avenue',
    neighbourhood: 'Crescent Park',
    city: 'Palo Alto',
    postcode: '94303',
    county: 'Santa Clara County',
    state: 'California',
    country: 'United States of America',
    countryCode: 'US',
  },

  simpleUsAddress: {
    houseNumber: '123',
    road: 'Main Street',
    city: 'Springfield',
    state: 'IL',
    postcode: '62701',
    countryCode: 'US',
  },

  ukAddress: {
    houseNumber: '10',
    road: 'Downing Street',
    city: 'London',
    postcode: 'SW1A 2AA',
    countryCode: 'GB',
  },

  frenchAddress: {
    houseNumber: '55',
    road: 'Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    postcode: '75008',
    countryCode: 'FR',
  },

  germanAddress: {
    road: 'Platz der Republik 1',
    city: 'Berlin',
    postcode: '11011',
    countryCode: 'DE',
  },

  businessAddress: {
    houseNumber: '1',
    road: 'Apple Park Way',
    city: 'Cupertino',
    state: 'CA',
    postcode: '95014',
    countryCode: 'US',
  },

  customAddress: {
    houseNumber: '456',
    road: 'Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postcode: '90210',
    countryCode: 'US',
  },

  nyAddress: {
    houseNumber: '350',
    road: 'Fifth Avenue',
    city: 'New York',
    state: 'NY',
    postcode: '10118',
    countryCode: 'US',
  },
};

function CodeBlock({ children }) {
  return (
    <pre className="bg-secondary text-secondary-foreground p-4 rounded-lg text-sm overflow-x-auto font-paragraph">
      <code>{children}</code>
    </pre>
  );
}

function ExampleSection({ title, description, address, children, code }) {
  return (
    <div className="mb-12 border-b border-foreground pb-8 last:border-b-0">
      <div className="mb-6">
        <h3 className="text-2xl font-heading text-foreground mb-2">{title}</h3>
        <p className="text-secondary-foreground font-paragraph">
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-heading text-foreground mb-4">Result:</h4>
          <div className="bg-background border border-foreground rounded-lg p-6">
            <Address.Root address={address}>{children}</Address.Root>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-heading text-foreground mb-4">Code:</h4>
          <CodeBlock>{code}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

function AddressExamples() {
  return (
    <div className="bg-background min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Address Component Examples
          </h2>
          <p className="text-lg text-secondary-foreground font-paragraph">
            Explore different ways to use the Address component for
            international address formatting
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic Address Display */}
          <ExampleSection
            title="Basic Address Display"
            description="Simple address display using Address.Formatted component with automatic international formatting"
            address={sampleAddresses.usAddress}
            code={`const address = {
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

<Address.Root address={address}>
  <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
</Address.Root>`}
          >
            <Address.Formatted className="text-foreground font-paragraph whitespace-pre-line" />
          </ExampleSection>

          {/* Formatting Options */}
          <ExampleSection
            title="Abbreviated Format"
            description="Use the abbreviate prop to shorten common address terms (Avenue → Ave, Street → St)"
            address={sampleAddresses.simpleUsAddress}
            code={`const address = {
  houseNumber: '123',
  road: 'Main Street',
  city: 'Springfield',
  state: 'IL',
  postcode: '62701',
  countryCode: 'US',
};

<Address.Root address={address}>
  <Address.Formatted
    abbreviate
    className="text-foreground whitespace-pre-line font-paragraph"
  />
</Address.Root>`}
          >
            <Address.Formatted
              abbreviate
              className="text-foreground whitespace-pre-line font-paragraph"
            />
          </ExampleSection>

          {/* With Country */}
          <ExampleSection
            title="Address with Country"
            description="Include country information in the formatted address using appendCountry prop"
            address={sampleAddresses.simpleUsAddress}
            code={`<Address.Root address={address}>
  <Address.Formatted
    appendCountry
    className="text-foreground whitespace-pre-line font-paragraph"
  />
</Address.Root>`}
          >
            <Address.Formatted
              appendCountry
              className="text-foreground whitespace-pre-line font-paragraph"
            />
          </ExampleSection>

          {/* Single Line Format */}
          <ExampleSection
            title="Single Line Format"
            description="Convert address lines to a single line using Address.Lines with custom formatting"
            address={sampleAddresses.simpleUsAddress}
            code={`<Address.Root address={address}>
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
</Address.Root>`}
          >
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
          </ExampleSection>

          {/* UK Address */}
          <ExampleSection
            title="UK Address Format"
            description="British addresses follow UK postal conventions with proper formatting"
            address={sampleAddresses.ukAddress}
            code={`const ukAddress = {
  houseNumber: '10',
  road: 'Downing Street',
  city: 'London',
  postcode: 'SW1A 2AA',
  countryCode: 'GB',
};

<Address.Root address={ukAddress}>
  <Address.Formatted
    appendCountry
    className="text-foreground font-paragraph whitespace-pre-line"
  />
</Address.Root>`}
          >
            <Address.Formatted
              appendCountry
              className="text-foreground font-paragraph whitespace-pre-line"
            />
          </ExampleSection>

          {/* French Address */}
          <ExampleSection
            title="French Address Format"
            description="French addresses with proper European formatting conventions"
            address={sampleAddresses.frenchAddress}
            code={`const frenchAddress = {
  houseNumber: '55',
  road: 'Rue du Faubourg Saint-Honoré',
  city: 'Paris',
  postcode: '75008',
  countryCode: 'FR',
};

<Address.Root address={frenchAddress}>
  <Address.Formatted
    appendCountry
    className="text-foreground font-paragraph whitespace-pre-line"
  />
</Address.Root>`}
          >
            <Address.Formatted
              appendCountry
              className="text-foreground font-paragraph whitespace-pre-line"
            />
          </ExampleSection>

          {/* German Address */}
          <ExampleSection
            title="German Address Format"
            description="German addresses demonstrating European address formatting without house number separation"
            address={sampleAddresses.germanAddress}
            code={`const germanAddress = {
  road: 'Platz der Republik 1',
  city: 'Berlin',
  postcode: '11011',
  countryCode: 'DE',
};

<Address.Root address={germanAddress}>
  <Address.Formatted
    appendCountry
    className="text-foreground font-paragraph whitespace-pre-line"
  />
</Address.Root>`}
          >
            <Address.Formatted
              appendCountry
              className="text-foreground font-paragraph whitespace-pre-line"
            />
          </ExampleSection>

          {/* Custom Styled Lines */}
          <ExampleSection
            title="Custom Line Styling"
            description="Style each address line differently using Address.Lines with custom rendering"
            address={sampleAddresses.customAddress}
            code={`<Address.Root address={address}>
  <Address.Lines asChild>
    {React.forwardRef(({ lines, ...props }, ref) => (
      <div ref={ref} {...props} className="space-y-1">
        {lines.map((line, index) => (
          <div
            key={index}
            className={\`
              \${index === 0 ? 'font-heading text-lg text-foreground' : 'font-paragraph text-secondary-foreground'}
              \${index === lines.length - 1 ? 'text-xs uppercase tracking-wide' : ''}
            \`}
          >
            {line}
          </div>
        ))}
      </div>
    ))}
  </Address.Lines>
</Address.Root>`}
          >
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
          </ExampleSection>

          {/* Horizontal Layout */}
          <ExampleSection
            title="Horizontal Layout with Separators"
            description="Display address lines horizontally with custom separators"
            address={sampleAddresses.customAddress}
            code={`<Address.Root address={address}>
  <Address.Lines asChild>
    {React.forwardRef(({ lines, ...props }, ref) => (
      <span
        ref={ref}
        {...props}
        className="text-foreground font-paragraph"
      >
        {lines.join(' • ')}
      </span>
    ))}
  </Address.Lines>
</Address.Root>`}
          >
            <Address.Lines asChild>
              {React.forwardRef(({ lines, ...props }, ref) => (
                <span
                  ref={ref}
                  {...props}
                  className="text-foreground font-paragraph"
                >
                  {lines.join(' • ')}
                </span>
              ))}
            </Address.Lines>
          </ExampleSection>

          {/* List Format */}
          <ExampleSection
            title="List Format"
            description="Render address lines as an unordered list with bullet points"
            address={sampleAddresses.customAddress}
            code={`<Address.Root address={address}>
  <Address.Lines asChild>
    {React.forwardRef(({ lines, ...props }, ref) => (
      <ul
        ref={ref}
        {...props}
        className="list-disc list-inside space-y-1"
      >
        {lines.map((line, index) => (
          <li
            key={index}
            className="text-foreground font-paragraph"
          >
            {line}
          </li>
        ))}
      </ul>
    ))}
  </Address.Lines>
</Address.Root>`}
          >
            <Address.Lines asChild>
              {React.forwardRef(({ lines, ...props }, ref) => (
                <ul
                  ref={ref}
                  {...props}
                  className="list-disc list-inside space-y-1"
                >
                  {lines.map((line, index) => (
                    <li key={index} className="text-foreground font-paragraph">
                      {line}
                    </li>
                  ))}
                </ul>
              ))}
            </Address.Lines>
          </ExampleSection>

          {/* Badge Style */}
          <ExampleSection
            title="Badge Style Layout"
            description="Display address lines as styled badges with different colors"
            address={sampleAddresses.customAddress}
            code={`<Address.Root address={address}>
  <Address.Lines asChild>
    {React.forwardRef(({ lines, ...props }, ref) => (
      <div ref={ref} {...props} className="flex flex-wrap gap-2">
        {lines.map((line, index) => (
          <span
            key={index}
            className={\`px-3 py-1 rounded-full text-sm font-paragraph \${
              index === 0
                ? 'bg-primary/20 text-primary border border-primary'
                : 'bg-secondary/20 text-secondary-foreground border border-secondary'
            }\`}
          >
            {line}
          </span>
        ))}
      </div>
    ))}
  </Address.Lines>
</Address.Root>`}
          >
            <Address.Lines asChild>
              {React.forwardRef(({ lines, ...props }, ref) => (
                <div ref={ref} {...props} className="flex flex-wrap gap-2">
                  {lines.map((line, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-paragraph ${
                        index === 0
                          ? 'bg-primary/20 text-primary border border-primary'
                          : 'bg-secondary/20 text-secondary-foreground border border-secondary'
                      }`}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              ))}
            </Address.Lines>
          </ExampleSection>

          {/* Business Card Layout */}
          <ExampleSection
            title="Business Card Layout"
            description="Real-world example of address formatting in a business card context"
            address={sampleAddresses.businessAddress}
            code={`const contact = {
  name: 'John Smith',
  title: 'Software Engineer',
  phone: '+1 (555) 123-4567',
  email: 'john.smith@example.com',
  address: {
    houseNumber: '1',
    road: 'Apple Park Way',
    city: 'Cupertino',
    state: 'CA',
    postcode: '95014',
    countryCode: 'US',
  },
};

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
</div>`}
          >
            <div className="max-w-sm bg-background border border-foreground rounded-lg p-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <h2 className="font-heading text-xl text-foreground">
                    John Smith
                  </h2>
                  <p className="font-paragraph text-secondary-foreground">
                    Software Engineer
                  </p>
                </div>

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

                <div className="text-sm text-secondary-foreground font-paragraph">
                  <div>+1 (555) 123-4567</div>
                  <div>john.smith@example.com</div>
                </div>
              </div>
            </div>
          </ExampleSection>

          {/* AsChild Pattern with Custom Elements */}
          <ExampleSection
            title="AsChild Pattern - Custom Formatted Element"
            description="Use asChild to render address with custom elements and styling"
            address={sampleAddresses.nyAddress}
            code={`<Address.Root address={address}>
  <Address.Formatted asChild>
    {React.forwardRef(({ formattedAddress, ...props }, ref) => (
      <h4
        ref={ref}
        {...props}
        className="text-xl font-heading text-foreground"
      >
        📍 {formattedAddress}
      </h4>
    ))}
  </Address.Formatted>
</Address.Root>`}
          >
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-xl border border-primary/30">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Address.Formatted asChild>
                    {React.forwardRef(({ formattedAddress, ...props }, ref) => (
                      <h4
                        ref={ref}
                        {...props}
                        className="text-xl font-heading text-foreground"
                      >
                        📍 {formattedAddress}
                      </h4>
                    ))}
                  </Address.Formatted>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xl">🏢</span>
                  </div>
                </div>
              </div>
            </div>
          </ExampleSection>

          {/* Interactive Address Lines */}
          <ExampleSection
            title="Interactive Address Lines"
            description="Make address lines interactive with custom onClick handlers"
            address={sampleAddresses.nyAddress}
            code={`<Address.Root address={address}>
  <Address.Lines asChild>
    {React.forwardRef(({ lines, ...props }, ref) => (
      <div ref={ref} {...props} className="space-y-2">
        {lines.map((line, index) => (
          <button
            key={index}
            onClick={() => alert(\`You clicked: \${line}\`)}
            className={\`
              w-full text-left px-4 py-2 rounded-lg border transition-colors
              \${
                index === 0
                  ? 'border-primary bg-primary/10 hover:bg-primary/20 text-primary'
                  : 'border-foreground bg-background hover:bg-secondary text-foreground'
              } font-paragraph
            \`}
          >
            {line}
          </button>
        ))}
      </div>
    ))}
  </Address.Lines>
</Address.Root>`}
          >
            <div className="space-y-3">
              <Address.Lines asChild>
                {React.forwardRef(({ lines, ...props }, ref) => (
                  <div ref={ref} {...props} className="space-y-2">
                    {lines.map((line, index) => (
                      <button
                        key={index}
                        onClick={() => alert(`You clicked: ${line}`)}
                        className={`
                          w-full text-left px-4 py-2 rounded-lg border transition-colors
                          ${
                            index === 0
                              ? 'border-primary bg-primary/10 hover:bg-primary/20 text-primary'
                              : 'border-foreground bg-background hover:bg-secondary text-foreground'
                          } font-paragraph
                        `}
                      >
                        {line}
                      </button>
                    ))}
                  </div>
                ))}
              </Address.Lines>
            </div>
          </ExampleSection>
        </div>
      </div>
    </div>
  );
}

export default AddressExamples;
