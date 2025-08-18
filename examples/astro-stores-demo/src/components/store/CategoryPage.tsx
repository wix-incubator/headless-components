import { CurrentCart } from '@wix/headless-ecom/react';
import type { LineItem } from '@wix/headless-ecom/services';
import {
  Product as ProductPrimitive,
  ProductList as ProductListPrimitive,
  ProductListFilters as ProductListFiltersPrimitive,
  ProductListPagination as ProductListPaginationPrimitive,
  ProductVariantSelector as ProductVariantSelectorPrimitive,
  SelectedVariant as SelectedVariantPrimitive,
  ProductListV2 as ProductList,
  ProductV2 as Product,
  Option,
  Choice,
} from '@wix/headless-stores/react';
import type {
  CategoriesListServiceConfig,
  ProductsListSearchServiceConfig,
} from '@wix/headless-stores/services';
import { type ProductsListServiceConfig } from '@wix/headless-stores/services';
import { productsV3 } from '@wix/stores';
import React, { useEffect, useState } from 'react';
import { WixMediaImage } from '../media';
import { CategoryPicker } from './CategoryPicker';
import { ProductActionButtons } from './ProductActionButtons';
import { ProductFilters } from './ProductFilters';
import QuickViewModal from './QuickViewModal';
import { SortDropdown } from './SortDropdown';
import { MediaGallery as MediaGalleryCore } from '@wix/headless-media/core';

interface StoreCollectionPageProps {
  productsListConfig: ProductsListServiceConfig;
  productsListSearchConfig: ProductsListSearchServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  productPageRoute: string;
}

export const ProductGridContent = ({
  categoriesListConfig,
}: {
  categoriesListConfig: CategoriesListServiceConfig;
}) => {
  const [quickViewProduct, setQuickViewProduct] =
    useState<productsV3.V3Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: productsV3.V3Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewProduct(null), 300); // Allow animation to complete
  };

  const ProductItem = ({ product }: { product: productsV3.V3Product }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const availabilityStatus = product.inventory?.availabilityStatus;
    const available =
      availabilityStatus === productsV3.InventoryAvailabilityStatus.IN_STOCK ||
      availabilityStatus ===
        productsV3.InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;

    return (
      <MediaGalleryCore.Root
        mediaGalleryServiceConfig={{
          media: product.media?.itemsInfo?.items ?? [],
        }}
      >
        <ProductVariantSelectorPrimitive.Root>
          <SelectedVariantPrimitive.Root
            selectedVariantServiceConfig={{ fetchInventoryData: false }}
          >
            <div
              data-testid="product-item"
              data-product-id={product._id}
              data-product-available={available}
              className="relative bg-surface-card backdrop-blur-sm rounded-xl p-4 border border-surface-primary hover:border-surface-hover transition-all duration-200 hover:scale-105 group h-full flex flex-col relative"
            >
              {/* Success Message */}
              {showSuccessMessage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-status-success-light/90 backdrop-blur-sm border border-status-success rounded-lg px-4 py-2 text-status-success text-base font-bold text-center shadow-md animate-bounce">
                    Added to Cart!
                  </div>
                </div>
              )}

              <CurrentCart.LineItemAdded>
                {({ onAddedToCart }) => {
                  useEffect(() => {
                    return onAddedToCart(
                      (lineItems: LineItem[] | undefined) => {
                        if (!lineItems) return;
                        const myLineItemIsThere = lineItems.some(
                          lineItem =>
                            lineItem.catalogReference?.catalogItemId ===
                            product._id
                        );
                        if (!myLineItemIsThere) return;

                        setShowSuccessMessage(true);
                        setTimeout(() => {
                          setShowSuccessMessage(false);
                        }, 3000);
                      }
                    );
                  }, [onAddedToCart]);

                  return null;
                }}
              </CurrentCart.LineItemAdded>

              <div className="aspect-square bg-surface-primary rounded-lg mb-4 overflow-hidden relative">
                {product.media?.main?.image ? (
                  <WixMediaImage
                    media={{ image: product.media.main.image }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    alt={product.media.main.altText || ''}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-content-subtle"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Quick View Button - appears on hover */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickView(product);
                    }}
                    className="bg-gradient-primary text-white px-4 py-2 rounded-lg border border-surface-primary shadow-lg flex items-center gap-2 font-medium bg-gradient-primary-hover transition-all duration-200 whitespace-nowrap"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Quick View
                  </button>
                </div>
              </div>

              {product.ribbon?.name && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-ribbon text-content-primary text-xs px-2 py-1 rounded-full font-medium">
                    {product.ribbon.name}
                  </span>
                </div>
              )}

              <Product.Name asChild>
                <a data-testid="title-navigation" href={`/${product.slug}`}>
                  <h3 className="text-content-primary font-semibold mb-2 line-clamp-2" />
                </a>
              </Product.Name>

              {/* Product Options - Using New Product API */}
              <Product.Variants>
                <Product.VariantOptions>
                  <div className="mb-3 space-y-2">
                    <Product.VariantOptionRepeater>
                      <div className="space-y-1">
                        <Option.Name className="text-content-secondary text-xs font-medium" />
                        <Option.Choices>
                          <div className="flex flex-wrap gap-1">
                            <Option.ChoiceRepeater>
                              <>
                                <Choice.Color className="w-6 h-6 rounded-full border-2 transition-colors cursor-pointer border-color-swatch hover:border-color-swatch-hover data-[selected='true']:border-brand-primary data-[selected='true']:shadow-md data-[selected='true']:ring-1 data-[selected='true']:ring-brand-primary/30 data-[out-of-stock='true']:grayscale data-[out-of-stock='true']:opacity-50" />
                                <Choice.Text className="inline-flex items-center px-2 py-1 text-xs rounded border transition-colors cursor-pointer bg-surface-primary text-content-secondary border-brand-medium hover:border-brand-primary data-[selected='true']:bg-brand-primary data-[selected='true']:text-content-primary data-[selected='true']:border-brand-primary data-[out-of-stock='true']:opacity-50 data-[out-of-stock='true']:line-through" />
                              </>
                            </Option.ChoiceRepeater>
                          </div>
                        </Option.Choices>
                      </div>
                    </Product.VariantOptionRepeater>
                  </div>
                </Product.VariantOptions>
              </Product.Variants>

              <ProductVariantSelectorPrimitive.Reset>
                {({ reset, hasSelections }) =>
                  hasSelections && (
                    <div className="pt-4">
                      <button
                        onClick={reset}
                        className="text-sm text-brand-primary hover:text-brand-light transition-colors"
                      >
                        Reset Selections
                      </button>
                    </div>
                  )
                }
              </ProductVariantSelectorPrimitive.Reset>

              <Product.Description
                as="plain"
                className="text-content-muted text-sm mb-3 line-clamp-2"
              />

              <div className="mt-auto mb-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Product.Price className="text-xl font-bold text-content-primary" />
                      <Product.CompareAtPrice className="text-sm font-medium text-content-faded line-through" />
                    </div>
                    <div className="flex items-center gap-2">
                      {available ? (
                        <span className="text-status-success text-sm">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-status-error text-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Add to Cart Button */}
                <SelectedVariantPrimitive.Actions>
                  {({ error }) => (
                    <div className="space-y-2">
                      {error && (
                        <div className="bg-status-danger-light border border-status-danger rounded-lg p-2">
                          <p className="text-status-error text-xs">{error}</p>
                        </div>
                      )}

                      <ProductActionButtons
                        isQuickView={true} // This will hide the Buy Now button for list items
                      />
                    </div>
                  )}
                </SelectedVariantPrimitive.Actions>

                {/* View Product Button */}
                <a
                  data-testid="view-product-button"
                  href={`/${product.slug}`}
                  className="w-full text-content-primary font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-secondary"
                >
                  View Product
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </SelectedVariantPrimitive.Root>
        </ProductVariantSelectorPrimitive.Root>
      </MediaGalleryCore.Root>
    );
  };

  return (
    <div className="min-h-screen">
      {/* <div className="mb-6 bg-surface-primary backdrop-blur-sm rounded-xl border border-surface-subtle p-4 mb-6">
        <div className="flex items-top justify-between">
          <ProductListFiltersPrimitive.CategoryFilter>
            {({ selectedCategory, setSelectedCategory }) => (
              <CategoryPicker
                categoriesListConfig={categoriesListConfig}
                currentCategorySlug={selectedCategory?.slug || ''}
                onCategorySelect={setSelectedCategory}
              />
            )}
          </ProductListFiltersPrimitive.CategoryFilter>
          <SortDropdown />
        </div>
      </div> */}

      {/* Main Layout with Sidebar and Content */}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <div className="relative">
              <ProductFilters />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <ProductListPrimitive.Error>
            {({ error }) => (
              <div className="bg-surface-error border border-status-error rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-status-error text-sm sm:text-base">
                  {error}
                </p>
              </div>
            )}
          </ProductListPrimitive.Error>

          {/* Filter Status Bar */}
          <ProductListFiltersPrimitive.ResetTrigger>
            {({ resetFilters, isFiltered }) =>
              isFiltered && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 filter-status-bar rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-brand-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="text-brand-light text-sm sm:text-base">
                      <ProductList.Totals.Displayed asChild>
                        {React.forwardRef<
                          HTMLSpanElement,
                          { displayed: number }
                        >(({ displayed }, ref) => (
                          <span ref={ref}>Showing {displayed}</span>
                        ))}
                      </ProductList.Totals.Displayed>
                    </span>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-brand-primary hover:text-brand-light transition-colors text-sm self-start sm:self-auto"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            }
          </ProductListFiltersPrimitive.ResetTrigger>

          <ProductListPrimitive.Loading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-card rounded-xl p-4 animate-pulse"
                >
                  <div className="aspect-square bg-surface-primary rounded-lg mb-4"></div>
                  <div className="h-4 bg-surface-primary rounded mb-2"></div>
                  <div className="h-3 bg-surface-primary rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </ProductListPrimitive.Loading>

          <ProductListPrimitive.EmptyState>
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 text-content-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <ProductListFiltersPrimitive.ResetTrigger>
                {({ isFiltered }) => (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-content-primary mb-3 sm:mb-4">
                      {isFiltered
                        ? 'No Products Match Your Filters'
                        : 'No Products Found'}
                    </h2>
                    <p className="text-content-light text-sm sm:text-base">
                      {isFiltered
                        ? 'Try adjusting your filters to see more products.'
                        : "We couldn't find any products to display."}
                    </p>
                  </>
                )}
              </ProductListFiltersPrimitive.ResetTrigger>
            </div>
          </ProductListPrimitive.EmptyState>

          <ProductList.Products
            emptyState={
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-content-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <ProductListFiltersPrimitive.ResetTrigger>
                  {({ isFiltered }) => (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold text-content-primary mb-3 sm:mb-4">
                        {isFiltered
                          ? 'No Products Match Your Filters'
                          : 'No Products Found'}
                      </h2>
                      <p className="text-content-light text-sm sm:text-base">
                        {isFiltered
                          ? 'Try adjusting your filters to see more products.'
                          : "We couldn't find any products to display."}
                      </p>
                    </>
                  )}
                </ProductListFiltersPrimitive.ResetTrigger>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <ProductList.ProductRepeater>
                <Product.Slug asChild>
                  {({ slug }) => (
                    <a data-testid="title-navigation" href={`/${slug}`}>
                      <Product.Name className="text-content-primary font-semibold mb-2 line-clamp-2" />
                    </a>
                  )}
                </Product.Slug>
              </ProductList.ProductRepeater>
            </div>
          </ProductList.Products>
        </div>
      </div>

      {/* Quick View Modal */}
      {/* {quickViewProduct && (
        <ProductPrimitive.Root
          productServiceConfig={{ productSlug: quickViewProduct.slug! }}
        >
          <ProductPrimitive.Loading>
            {({ isLoading }) => (
              <ProductPrimitive.Content>
                {({ product }) => (
                  <QuickViewModal
                    product={product}
                    isLoading={isLoading}
                    isOpen={isQuickViewOpen}
                    onClose={closeQuickView}
                  />
                )}
              </ProductPrimitive.Content>
            )}
          </ProductPrimitive.Loading>
        </ProductPrimitive.Root>
      )} */}
    </div>
  );
};

export const LoadMoreSection = () => {
  return (
    <ProductList.LoadMoreTrigger asChild>
      {React.forwardRef<
        HTMLButtonElement,
        { loadMore: () => void; hasMore: boolean; isLoading: boolean }
      >(({ loadMore, hasMore, isLoading, ...props }, ref) => (
        <ProductList.Totals.Displayed asChild>
          {React.forwardRef<HTMLElement, { displayed: number }>(
            ({ displayed }) =>
              hasMore ? (
                <>
                  {displayed > 0 && (
                    <div className="text-center mt-12">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          ref={ref}
                          {...props}
                          onClick={loadMore}
                          disabled={isLoading}
                          className={`text-content-primary font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                            isLoading ? 'bg-surface-loading' : 'btn-primary'
                          }`}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="animate-spin w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            'Load More Products'
                          )}
                        </button>
                      </div>
                      <p className="text-content-muted text-sm mt-4">
                        {displayed} products loaded
                      </p>
                    </div>
                  )}
                </>
              ) : null
          )}
        </ProductList.Totals.Displayed>
      ))}
    </ProductList.LoadMoreTrigger>
  );
};

export function CategoryPage({
  productsListConfig,
  productsListSearchConfig,
  categoriesListConfig,
}: StoreCollectionPageProps) {
  return (
    <ProductList.Root
      productsListConfig={productsListConfig}
      productsListSearchConfig={productsListSearchConfig}
    >
      <ProductGridContent categoriesListConfig={categoriesListConfig} />
      <LoadMoreSection />
    </ProductList.Root>
  );
}
