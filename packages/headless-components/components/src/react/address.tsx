import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import addressFormatter from '@fragaria/address-formatter';

// ==========================================
// TestIds Enum
// ==========================================

enum TestIds {
  // Root container
  addressRoot = 'address-root',
  // Formatted address
  addressFormatted = 'address-formatted',
  // Address lines array
  addressLines = 'address-lines',
}

// ==========================================
// Type Definitions
// ==========================================

/**
 * Address data structure compatible with @fragaria/address-formatter
 * Maps common address fields to the formatter's expected structure
 */
type AddressData = Parameters<typeof addressFormatter.format>[0];

/**
 * Formatting options for the address formatter
 */
type AddressFormattingOptions = Omit<
  Parameters<typeof addressFormatter.format>[1],
  'output'
> & { output?: 'string' | 'array' };

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
// Utility Functions
// ==========================================

/**
 * Format address using @fragaria/address-formatter
 */
function formatAddressString(
  addressData: AddressData,
  options: AddressFormattingOptions = {},
): string {
  return addressFormatter.format(addressData, {
    ...options,
    output: 'string',
  });
}

/**
 * Get address as array of lines using @fragaria/address-formatter
 */
function formatAddressLines(
  addressData: AddressData,
  options: AddressFormattingOptions = {},
): string[] {
  return addressFormatter.format(addressData, {
    ...options,
    output: 'array',
  });
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
      'data-country-code': address.countryCode,
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

// Address.Formatted Component Props
interface AddressFormattedProps {
  children?: AsChildChildren<{
    formattedAddress: string;
  }>;
  asChild?: boolean;
  abbreviate?: boolean; // Abbreviate common names (Avenue -> Ave)
  countryCode?: string; // Override country code for formatting
  fallbackCountryCode?: string; // Fallback if country code is invalid
  appendCountry?: boolean; // Whether to append country name
  className?: string;
}

// Address.Formatted Component
export const Formatted = React.forwardRef<HTMLElement, AddressFormattedProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      abbreviate = false,
      countryCode,
      fallbackCountryCode,
      appendCountry = false,
    } = props;

    const { addressData } = useAddressContext();

    const formattingOptions: AddressFormattingOptions = {
      abbreviate,
      countryCode,
      fallbackCountryCode,
      appendCountry,
    };

    const formattedAddress = formatAddressString(
      addressData,
      formattingOptions,
    );

    const attributes = {
      'data-testid': TestIds.addressFormatted,
      'data-abbreviated': abbreviate ? 'true' : undefined,
      'data-append-country': appendCountry ? 'true' : undefined,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ formattedAddress }}
        className={className}
        content={formattedAddress}
        {...attributes}
      >
        <span>{formattedAddress}</span>
      </AsChildSlot>
    );
  },
);

Formatted.displayName = 'Address.Formatted';

// Address.Lines Component Props
interface AddressLinesProps {
  children?: AsChildChildren<{
    lines: string[];
  }>;
  asChild?: boolean;
  abbreviate?: boolean; // Abbreviate common names (Avenue -> Ave)
  countryCode?: string; // Override country code for formatting
  fallbackCountryCode?: string; // Fallback if country code is invalid
  appendCountry?: boolean; // Whether to append country name
  className?: string;
}

// Address.Lines Component (better name than Parts)
export const Lines = React.forwardRef<HTMLElement, AddressLinesProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      abbreviate = false,
      countryCode,
      fallbackCountryCode,
      appendCountry = false,
    } = props;

    const { addressData } = useAddressContext();

    const formattingOptions: AddressFormattingOptions = {
      abbreviate,
      countryCode,
      fallbackCountryCode,
      appendCountry,
    };

    const lines = formatAddressLines(addressData, formattingOptions);

    const attributes = {
      'data-testid': TestIds.addressLines,
      'data-line-count': lines.length,
      'data-abbreviated': abbreviate ? 'true' : undefined,
      'data-append-country': appendCountry ? 'true' : undefined,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ lines }}
        className={className}
        content={null}
        {...attributes}
      >
        <div>
          {lines.map((line, index) => (
            <>
              <span key={index}>{line}</span>
              <br />
            </>
          ))}
        </div>
      </AsChildSlot>
    );
  },
);

Lines.displayName = 'Address.Lines';

// ==========================================
// Type Exports
// ==========================================

export type {
  AddressData,
  AddressFormattingOptions,
  AddressContextValue,
  AddressRootProps,
  AddressFormattedProps,
  AddressLinesProps,
};
