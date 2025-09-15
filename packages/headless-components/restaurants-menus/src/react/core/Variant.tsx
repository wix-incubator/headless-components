import React, { createContext, useContext } from 'react';
import type { Variant } from '../../services/types.js';

export interface VariantProps {
  children: React.ReactNode;
  variant: Variant & {
    priceInfo?: {
      price?: string;
      formattedPrice?: string;
    };
  };
}

interface VariantContextValue {
  variant: Variant & {
    priceInfo?: {
      price?: string;
      formattedPrice?: string;
    };
  };
}

const VariantContext = createContext<VariantContextValue | null>(null);

export function Variant(props: VariantProps) {
  const contextValue: VariantContextValue = {
    variant: props.variant,
  };

  return (
    <VariantContext.Provider value={contextValue}>
      {props.children}
    </VariantContext.Provider>
  );
}

export function useVariantContext() {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error('useVariantContext must be used within Variant');
  }
  return context;
}

export interface VariantNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export interface VariantPriceProps {
  children: (props: {
    price: string;
    formattedPrice?: string;
    hasPrice: boolean;
  }) => React.ReactNode;
}

export function Name(props: VariantNameProps) {
  const { variant } = useVariantContext();

  return props.children({ name: variant.name ?? '' });
}

export function Price(props: VariantPriceProps) {
  const { variant } = useVariantContext();

  const price = variant.priceInfo?.price ?? '';
  const formattedPrice = variant.priceInfo?.formattedPrice;
  const hasPrice = !!(price || formattedPrice);

  return props.children({
    price,
    formattedPrice,
    hasPrice,
  });
}
