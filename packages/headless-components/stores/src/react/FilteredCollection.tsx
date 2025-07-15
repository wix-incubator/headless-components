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

/**
 * Props for the FiltersLoading headless component.
 */
export interface FiltersLoadingProps {
  /** Function that receives loading state data. Use this function to render your custom loading UI components while filters are being prepared. */
  children: (data: {
    /** Whether all filter options have been fully loaded and are ready to display. */
    isFullyLoaded: boolean;
  }) => ReactNode;
}

/**
 * <blockquote class="caution">
 *
 * **Developer Preview**
 *
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 *
 * </blockquote>
 *
 * A headless component that provides filter initialization status.
 * Tracks whether all filter options have been fully loaded and are ready for user interaction.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @example
 * import { FiltersLoading } from "@wix/stores/components";
 *
 * <FiltersLoading>
 *   {({ isFullyLoaded }) => (
 *     <div className="filters-loading">
 *       {!isFullyLoaded && (
 *         <div className="loading-spinner">
 *           Loading filter options...
 *         </div>
 *       )}
 *     </div>
 *   )}
 * </FiltersLoading>
 *
 * @component
 */
export const FiltersLoading: React.FC<FiltersLoadingProps> = ({ children }) => {
  const filter = useService(FilterServiceDefinition);

  const isFullyLoaded = filter!.isFullyLoaded.get();

  return <>{children({ isFullyLoaded })}</>;
};

/**
 * Props for the Grid headless component.
 */
export interface FilteredGridProps {
  /** Function that receives filtered product grid data and loading states. Use this function to render your custom UI components with the provided filtered product data. */
  children: (data: {
    /** Array of filtered products. Learn about [managing products and categories](https://support.wix.com/en/managing-products-and-categories). */
    products: V3Product[];
    /** Total number of products matching the current filters. */
    totalProducts: number;
    /** Whether the filtered collection data is loading. */
    isLoading: boolean;
    /** Error message if loading fails. */
    error: string | null;
    /** Whether the filtered collection is empty. */
    isEmpty: boolean;
    /** Whether there are more filtered products available to load. */
    hasMoreProducts: boolean;
  }) => ReactNode;
}

/**
 * <blockquote class="caution">
 *
 * **Developer Preview**
 *
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 *
 * </blockquote>
 *
 * A headless component for displaying filtered products in a grid layout.
 * Handles product collection display with applied filters and automatically updates when filters change.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @example
 * import { Grid } from "@wix/stores/components";
 *
 * <Grid>
 *   {({ products, isLoading, error, isEmpty, totalProducts }) => (
 *     <div className="filtered-product-grid">
 *       {isLoading && <div>Loading filtered products...</div>}
 *       {error && <div>Error: {error}</div>}
 *       {isEmpty && <div>No products found matching your filters</div>}
 *       <div className="grid-header">
 *         <h2>{totalProducts} Products Found</h2>
 *       </div>
 *       <div className="grid">
 *         {products.map(product => (
 *           <div key={product._id} className="product-card">
 *             <img src={product.media?.main?.image} alt={product.name} />
 *             <h3>{product.name}</h3>
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   )}
 * </Grid>
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

/**
 * Props for the Item headless component.
 */
export interface FilteredItemProps {
  /** Product data with all available variants and options. */
  product: V3Product;
  /** Function that receives filtered product item data. Use this function to render your custom UI components with the provided product information. */
  children: (data: {
    /** Display name of the product. */
    title: string;
    /** Main product image URL. */
    image: string | null;
    /** Alternative text for the product image for accessibility. */
    imageAltText: string | null;
    /** Formatted product price that reflects the variant pricing. */
    price: string;
    /** Original price for comparison. Indicates a discount when available. */
    compareAtPrice: string | null;
    /** Whether the product is available for purchase based on inventory status. */
    available: boolean;
    /** URL-friendly product identifier used in product page URLs. */
    slug: string;
    /** Product description. */
    description?: string;
  }) => ReactNode;
}

/**
 * <blockquote class="caution">
 *
 * **Developer Preview**
 *
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 *
 * </blockquote>
 *
 * A headless component for displaying individual filtered product items.
 * Provides structured product details including pricing, availability, images, and navigation links for filtered results.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @example
 * import { Item } from "@wix/stores/components";
 *
 * <Item product={product}>
 *   {({ title, price, compareAtPrice, image, available, slug, description }) => (
 *     <div className="filtered-product-item">
 *       {image && <img src={image} alt={title} />}
 *       <h3>{title}</h3>
 *       {description && <p className="description">{description}</p>}
 *       <div className="price">
 *         <span className="current-price">{price}</span>
 *         {compareAtPrice && (
 *           <span className="compare-price">{compareAtPrice}</span>
 *         )}
 *       </div>
 *       {available ? (
 *         <a href={`/store/products/${slug}`} className="product-link">
 *           View Product
 *         </a>
 *       ) : (
 *         <span className="out-of-stock">Out of Stock</span>
 *       )}
 *     </div>
 *   )}
 * </Item>
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

/**
 * Props for the LoadMore headless component.
 */
export interface FilteredLoadMoreProps {
  /** Function that receives pagination and loading state data for filtered products. Use this function to render your custom loading and pagination UI components. */
  children: (data: {
    /** Function to load additional filtered products. */
    loadMore: () => Promise<void>;
    /** Function to refresh the filtered collection data. */
    refresh: () => Promise<void>;
    /** Whether additional filtered products are loading. */
    isLoading: boolean;
    /** Whether the filtered collection contains any products. */
    hasProducts: boolean;
    /** Total number of products matching the current filters. */
    totalProducts: number;
    /** Whether there are more filtered products available to load. */
    hasMoreProducts: boolean;
  }) => ReactNode;
}

/**
 * <blockquote class="caution">
 *
 * **Developer Preview**
 *
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 *
 * </blockquote>
 *
 * A headless component that enables progressive loading of filtered products.
 * Loads additional products that match applied filters without traditional pagination.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @example
 * import { LoadMore } from "@wix/stores/components";
 *
 * <LoadMore>
 *   {({ loadMore, refresh, isLoading, hasMoreProducts, totalProducts }) => (
 *     <div className="filtered-load-more">
 *       <div className="results-info">
 *         Showing filtered results ({totalProducts} total)
 *       </div>
 *       {hasMoreProducts && (
 *         <button onClick={loadMore} disabled={isLoading}>
 *           {isLoading ? 'Loading...' : 'Load More Filtered Products'}
 *         </button>
 *       )}
 *       <button onClick={refresh} disabled={isLoading}>
 *         Refresh Results
 *       </button>
 *     </div>
 *   )}
 * </LoadMore>
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

/**
 * Props for the Filters headless component.
 */
export interface FilteredFiltersProps {
  /** Function that receives filter management data and state. Use this function to render your custom filter UI components with the provided filter options and controls. */
  children: (data: {
    /** Function to apply selected filters to the product collection. */
    applyFilters: (filters: Filter) => void;
    /** Function to clear all applied filters and show all products. */
    clearFilters: () => void;
    /** Currently applied filter settings including price ranges and selected options. */
    currentFilters: Filter;
    /** Array of all products available for filtering. Learn about [managing products and categories](https://support.wix.com/en/managing-products-and-categories). */
    allProducts: V3Product[];
    /** Available filter options including price ranges and product attributes. */
    availableOptions: AvailableOptions;
    /** Whether any filters are currently applied to the collection. */
    isFiltered: boolean;
  }) => ReactNode;
}

/**
 * <blockquote class="caution">
 *
 * **Developer Preview**
 *
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 *
 * </blockquote>
 *
 * A headless component for managing product filters with available options.
 * Provides comprehensive filter functionality including price ranges, product attributes, and custom options, and automatically updates the product collection when filters are applied.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @example
 * import { Filters } from "@wix/stores/components";
 *
 * <Filters>
 *   {({ applyFilters, clearFilters, currentFilters, availableOptions, isFiltered }) => (
 *     <div className="product-filters">
 *       <h3>Filter Products</h3>
 *       {isFiltered && (
 *         <button onClick={clearFilters}>Clear All Filters</button>
 *       )}
 *
 *       <div className="price-filter">
 *         <label>Price: ${currentFilters.priceRange.min} - ${currentFilters.priceRange.max}</label>
 *         <input
 *           type="range"
 *           min={availableOptions.priceRange.min}
 *           max={availableOptions.priceRange.max}
 *           value={currentFilters.priceRange.min}
 *           onChange={(e) => applyFilters({
 *             ...currentFilters,
 *             priceRange: { ...currentFilters.priceRange, min: parseInt(e.target.value) }
 *           })}
 *         />
 *       </div>
 *     </div>
 *   )}
 * </Filters>
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
