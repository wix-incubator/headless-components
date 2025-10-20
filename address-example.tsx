import React from 'react';
import { Address } from './packages/headless-components/components/src/react/index.js';

// Example usage of the new simplified Address interface
function AddressExample() {
  // US Address
  const usAddress = {
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

  // UK Address
  const ukAddress = {
    houseNumber: '10',
    road: 'Downing Street',
    city: 'London',
    postcode: 'SW1A 2AA',
    country: 'United Kingdom',
    countryCode: 'GB',
  };

  // French Address
  const frenchAddress = {
    houseNumber: '55',
    road: 'Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    postcode: '75008',
    country: 'France',
    countryCode: 'FR',
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-heading text-foreground">
        Address Interface Examples
      </h1>

      {/* Basic Formatted Display */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-foreground">
          Basic Formatted Display
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-foreground rounded-lg">
            <h3 className="font-heading text-foreground mb-2">US Address</h3>
            <Address.Root address={usAddress}>
              <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
            </Address.Root>
          </div>

          <div className="p-4 border border-foreground rounded-lg">
            <h3 className="font-heading text-foreground mb-2">UK Address</h3>
            <Address.Root address={ukAddress}>
              <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
            </Address.Root>
          </div>

          <div className="p-4 border border-foreground rounded-lg">
            <h3 className="font-heading text-foreground mb-2">
              French Address
            </h3>
            <Address.Root address={frenchAddress}>
              <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
            </Address.Root>
          </div>
        </div>
      </section>

      {/* Formatting Options */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-foreground">
          Formatting Options
        </h2>

        <Address.Root address={usAddress}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-background border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">
                Standard Format
              </h3>
              <Address.Formatted className="text-foreground whitespace-pre-line font-paragraph" />
            </div>

            <div className="p-4 bg-background border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">
                Abbreviated Format
              </h3>
              <Address.Formatted
                abbreviate
                className="text-foreground whitespace-pre-line font-paragraph"
              />
            </div>

            <div className="p-4 bg-background border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">
                With Country
              </h3>
              <Address.Formatted
                appendCountry
                className="text-foreground whitespace-pre-line font-paragraph"
              />
            </div>

            <div className="p-4 bg-background border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">
                UK Format Override
              </h3>
              <Address.Formatted
                countryCode="GB"
                className="text-foreground whitespace-pre-line font-paragraph"
              />
            </div>
          </div>
        </Address.Root>
      </section>

      {/* Custom Lines Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-foreground">
          Custom Lines Layout
        </h2>

        <Address.Root address={usAddress}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Default Lines */}
            <div className="p-4 border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">
                Default Lines
              </h3>
              <Address.Lines className="space-y-1" />
            </div>

            {/* Custom Styled Lines */}
            <div className="p-4 border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">
                Custom Styling
              </h3>
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

            {/* Single Line Format */}
            <div className="p-4 border border-foreground rounded-lg">
              <h3 className="font-heading text-foreground mb-2">Single Line</h3>
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
            </div>
          </div>
        </Address.Root>
      </section>

      {/* International Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-foreground">
          International Formatting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-foreground rounded-lg">
            <h3 className="font-heading text-foreground mb-2">US Format</h3>
            <Address.Root address={usAddress}>
              <Address.Lines asChild>
                {React.forwardRef(({ lines, ...props }, ref) => (
                  <div ref={ref} {...props} className="space-y-1">
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
          </div>

          <div className="p-4 border border-foreground rounded-lg">
            <h3 className="font-heading text-foreground mb-2">UK Format</h3>
            <Address.Root address={ukAddress}>
              <Address.Lines asChild>
                {React.forwardRef(({ lines, ...props }, ref) => (
                  <div ref={ref} {...props} className="space-y-1">
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
          </div>

          <div className="p-4 border border-foreground rounded-lg">
            <h3 className="font-heading text-foreground mb-2">French Format</h3>
            <Address.Root address={frenchAddress}>
              <Address.Lines asChild>
                {React.forwardRef(({ lines, ...props }, ref) => (
                  <div ref={ref} {...props} className="space-y-1">
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddressExample;
