import React, { createContext, useContext } from 'react';
import type { EnhancedItem } from '../../services/types.js';

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
    price?: string;
    formattedPrice?: string;
    hasPrice: boolean;
  }) => React.ReactNode;
}

export interface ItemImagesProps {
  children: (props: { images: string[]; altText: string }) => React.ReactNode;
}

export interface ItemFeaturedProps {
  children: (props: { featured: boolean }) => React.ReactNode;
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

  const price = item.priceInfo?.price;
  const formattedPrice = (item.priceInfo as { formattedPrice?: string })
    ?.formattedPrice;
  const hasPrice = !!(price || formattedPrice);

  return props.children({ price, formattedPrice, hasPrice });
}

export function Images(props: ItemImagesProps) {
  const { item } = useItemContext();

  const mainImage = item.image;
  const additionalImages = item.additionalImages || [];
  const images = mainImage
    ? [mainImage, ...additionalImages]
    : additionalImages;
  const altText = item.name ?? '';

  return props.children({
    images,
    altText,
  });
}

export function Featured(props: ItemFeaturedProps) {
  const { item } = useItemContext();

  return props.children({ featured: !!item.featured });
}
