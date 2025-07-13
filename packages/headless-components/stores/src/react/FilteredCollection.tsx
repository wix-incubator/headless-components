import { useService } from "@wix/services-manager-react";
import React, { type ReactNode } from "react";
import { CollectionServiceDefinition } from "../services/collection-service.js";
import {
  FilterServiceDefinition,
  type AvailableOptions,
  type FilterServiceAPI,
  type Filter,
} from "../services/filter-service.js";
import {
  InventoryAvailabilityStatus,
  type V3Product,
} from "@wix/auto_sdk_stores_products-v-3";

export type { AvailableOptions, Filter, FilterServiceAPI };

// Filters Loading component with pulse animation
export interface FiltersLoadingProps {
  children: (data: { isFullyLoaded: boolean }) => ReactNode;
}

/**
 * Headless component for displaying a loading state for filters
 *
 * @component
 */
export const FiltersLoading: React.FC<FiltersLoadingProps> = ({ children }) => {
  const filter = useService(FilterServiceDefinition);

  const isFullyLoaded = filter!.isFullyLoaded.get();

  return <>{children({ isFullyLoaded })}</>;
};

// Grid component for displaying filtered products
export interface FilteredGridProps {
  children: (data: {
    products: V3Product[];
    totalProducts: number;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
    hasMoreProducts: boolean;
  }) => ReactNode;
}

/**
 * Headless component for displaying a grid of filtered products
 *
 * @component
 */
export const Grid: React.FC<FilteredGridProps> = ({ children }) => {
  const collection = useService(CollectionServiceDefinition);

  const products = collection!.products.get() || [];
  const totalProducts = collection!.totalProducts.get();
  const isLoading = collection!.isLoading.get();
  const error = collection!.error.get();
  const hasProducts = collection!.hasProducts.get();
  const hasMoreProducts = collection!.hasMoreProducts.get();

  return (
    <>
      {children({
        products,
        isLoading,
        error,
        isEmpty: !hasProducts,
        totalProducts,
        hasMoreProducts,
      })}
    </>
  );
};

// Item component for individual product rendering
export interface FilteredItemProps {
  product: V3Product;
  children: (data: {
    title: string;
    image: string | null;
    imageAltText: string | null;
    price: string;
    compareAtPrice: string | null;
    available: boolean;
    slug: string;
    description?: string;
  }) => ReactNode;
}

/**
 * Headless component for displaying a filtered product item
 *
 * @component
 */
export const Item: React.FC<FilteredItemProps> = ({ product, children }) => {
  // Safe conversion of product data with type safety guards
  const title = String(product.name || "");
  const image = product.media?.main?.image || null;
  const imageAltText = product.media?.main?.altText || "";
  const price =
    product.actualPriceRange?.minValue?.formattedAmount ||
    product.actualPriceRange?.maxValue?.formattedAmount ||
    (product.actualPriceRange?.minValue?.amount
      ? `$${product.actualPriceRange.minValue.amount}`
      : "$0.00");

  // Add compare at price
  const compareAtPrice =
    product.compareAtPriceRange?.minValue?.formattedAmount ||
    (product.compareAtPriceRange?.minValue?.amount
      ? `$${product.compareAtPriceRange.minValue.amount}`
      : null);

  const availabilityStatus = product.inventory?.availabilityStatus;
  const available =
    availabilityStatus === InventoryAvailabilityStatus.IN_STOCK ||
    availabilityStatus === InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;
  const slug = String(product.slug || product._id || "");
  const description = product.plainDescription
    ? String(product.plainDescription)
    : undefined;

  return (
    <>
      {children({
        title,
        image,
        imageAltText,
        price: String(price),
        compareAtPrice,
        available,
        slug,
        description,
      })}
    </>
  );
};

// Load More component for pagination
export interface FilteredLoadMoreProps {
  children: (data: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    isLoading: boolean;
    hasProducts: boolean;
    totalProducts: number;
    hasMoreProducts: boolean;
  }) => ReactNode;
}

/**
 * Headless component for load more filtered products functionality
 *
 * @component
 */
export const LoadMore: React.FC<FilteredLoadMoreProps> = ({ children }) => {
  const collection = useService(CollectionServiceDefinition);

  const loadMore = collection!.loadMore;
  const refresh = collection!.refresh;
  const isLoading = collection!.isLoading.get();
  const hasProducts = collection!.hasProducts.get();
  const totalProducts = collection!.totalProducts.get();
  const hasMoreProducts = collection!.hasMoreProducts.get();

  return (
    <>
      {children({
        loadMore,
        refresh,
        isLoading,
        hasProducts,
        totalProducts,
        hasMoreProducts,
      })}
    </>
  );
};

// Filters component for managing filters
export interface FilteredFiltersProps {
  children: (data: {
    applyFilters: (filters: Filter) => void;
    clearFilters: () => void;
    currentFilters: Filter;
    allProducts: V3Product[];
    availableOptions: AvailableOptions;
    isFiltered: boolean;
  }) => ReactNode;
}

/**
 * Headless component for product filters with available options
 *
 * @component
 */
export const Filters: React.FC<FilteredFiltersProps> = ({ children }) => {
  const collection = useService(CollectionServiceDefinition);
  const filter = useService(FilterServiceDefinition);

  const applyFilters = filter!.applyFilters;
  const clearFilters = filter!.clearFilters;
  const currentFilters = filter!.currentFilters.get();
  const allProducts = collection!.products.get();
  const availableOptions = filter!.availableOptions.get();
  const isFiltered =
    currentFilters.priceRange.min !== availableOptions.priceRange.min ||
    currentFilters.priceRange.max !== availableOptions.priceRange.max ||
    Object.keys(currentFilters.selectedOptions).length > 0;

  return (
    <>
      {children({
        applyFilters,
        clearFilters,
        currentFilters,
        allProducts,
        availableOptions,
        isFiltered,
      })}
    </>
  );
};
