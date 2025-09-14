import React, { createContext, useContext } from 'react';
import type { EnhancedItem } from '../../services/types';

export interface ItemProps {
  children: React.ReactNode;
  item: EnhancedItem;
}

interface ItemContextValue {
  item: EnhancedItem;
}

const ItemContext = createContext<ItemContextValue | null>(null);

export function Item(props: ItemProps) {
  const contextValue: ItemContextValue = {
    item: props.item,
  };

  return (
    <ItemContext.Provider value={contextValue}>
      {props.children}
    </ItemContext.Provider>
  );
}

export function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItemContext must be used within Item');
  }
  return context;
}

export interface ItemNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export interface ItemDescriptionProps {
  children: (props: { description: string }) => React.ReactNode;
}

export interface ItemPriceProps {
  children: (props: {
    price: string;
    formattedPrice?: string;
  }) => React.ReactNode;
}

export interface ItemImageProps {
  children: (props: {
    hasImage: boolean;
    altText: string;
    image?: string;
  }) => React.ReactNode;
}

export function Name(props: ItemNameProps) {
  const { item } = useItemContext();

  return props.children({ name: item.name ?? '' });
}

export function Description(props: ItemDescriptionProps) {
  const { item } = useItemContext();

  return props.children({ description: item.description ?? '' });
}

export function Price(props: ItemPriceProps) {
  const { item } = useItemContext();

  const price = item.priceInfo?.price ?? '';
  const formattedPrice = (item.priceInfo as { formattedPrice?: string })
    ?.formattedPrice;

  return props.children({ price, formattedPrice });
}

export function Image(props: ItemImageProps) {
  const { item } = useItemContext();

  const hasImage = !!item.image;
  const altText = item.name ?? '';

  return props.children({
    hasImage,
    image: item.image,
    altText,
  });
}
