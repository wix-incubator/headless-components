import {
  ProductCore as ProductPrimitive,
  ProductListCore as ProductListPrimitive,
  SelectedVariant as SelectedVariantPrimitive,
  ProductList,
  Product,
  Option,
  Choice,
} from '@wix/headless-stores/react';
import type { CategoriesListServiceConfig } from '@wix/headless-stores/services';
import { type ProductsListServiceConfig } from '@wix/headless-stores/services';
import { productsV3 } from '@wix/stores';
import * as StyledMediaGallery from '../media/MediaGallery';
import { CategoryPicker } from './CategoryPicker';
import { ProductActionButtons } from './ProductActionButtons';
import ProductFiltersSidebar from './ProductFiltersSidebar';
import QuickViewModal from './QuickViewModal';
import { SortDropdown } from './SortDropdown';
import React, { useState } from 'react';

interface StoreCollectionPageProps {
  productsListConfig: ProductsListServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  productPageRoute?: string;
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

  return (
    <div className="min-h-screen">
      <div className="mb-6 bg-surface-primary backdrop-blur-sm rounded-xl border border-surface-subtle p-4">
        <div className="flex items-top justify-between">
          <CategoryPicker categoriesListConfig={categoriesListConfig} />
          <SortDropdown />
        </div>
      </div>

      {/* Main Layout with Sidebar and Content */}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <ProductFiltersSidebar />

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
          <ProductList.FilterResetTrigger asChild>
            {React.forwardRef(
              ({ resetFilters, isFiltered }, ref) =>
                isFiltered && (
                  <div
                    ref={ref as React.RefObject<HTMLDivElement>}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 filter-status-bar rounded-xl p-4 mb-6"
                  >
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
                        Showing <ProductList.TotalsDisplayed /> products
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
            )}
          </ProductList.FilterResetTrigger>

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
            </div>
          </ProductListPrimitive.EmptyState>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <ProductList.ProductRepeater>
              <div className="relative bg-surface-card backdrop-blur-sm rounded-xl p-4 border border-surface-primary hover:border-surface-hover transition-all duration-200 hover:scale-105 group h-full flex flex-col">
                <Product.Ribbon className="bg-purple-500 text-white font-bold px-3 py-1 rounded-full text-sm absolute top-2 z-10" />

                <div className="aspect-square bg-surface-primary rounded-lg mb-4 overflow-hidden relative">
                  <Product.MediaGallery>
                    <StyledMediaGallery.Viewport className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </Product.MediaGallery>

                  {/* Quick View Button - appears on hover */}
                  <ProductPrimitive.Content>
                    {({ product }) => (
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
                    )}
                  </ProductPrimitive.Content>
                </div>

                {/* Product Name with Link */}
                <Product.Slug asChild>
                  {React.forwardRef<HTMLAnchorElement, { slug: string }>(
                    ({ slug }, ref) => (
                      <a
                        ref={ref}
                        data-testid="title-navigation"
                        href={`/${slug}`}
                      >
                        <Product.Name className="text-content-primary font-semibold mb-2 line-clamp-2" />
                      </a>
                    )
                  )}
                </Product.Slug>

                {/* Product Options */}
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
                                  <Choice.Color className="w-7 h-7 rounded-full border-2 transition-all duration-200 border-color-swatch hover:border-color-swatch-hover hover:scale-105 data-[selected='true']:border-accent-strong data-[selected='true']:ring-1 data-[selected='true']:scale-115 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale" />
                                  <Choice.Text className="text-xs inline-flex items-center px-2 py-1 border transition-all duration-200 border-color-swatch hover:border-color-swatch-hover hover:scale-105 data-[selected='true']:border-accent-strong data-[selected='true']:shadow-lg data-[selected='true']:bg-primary data-[selected='true']:scale-115 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale" />
                                </>
                              </Option.ChoiceRepeater>
                            </div>
                          </Option.Choices>
                        </div>
                      </Product.VariantOptionRepeater>
                    </div>
                  </Product.VariantOptions>
                </Product.Variants>

                {/* Product Description */}
                <Product.Description
                  as="plain"
                  className="text-content-muted text-sm mb-3 line-clamp-2"
                />

                {/* Price */}
                <div className="mt-auto mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Product.Price className="text-xl font-bold text-content-primary" />
                          <Product.CompareAtPrice className="text-sm font-medium text-content-faded line-through" />
                        </div>
                        <Product.Stock
                          labels={{
                            inStock: 'In Stock',
                            limitedStock: 'In Stock',
                            outOfStock: 'Out of Stock',
                          }}
                          asChild
                        >
                          {React.forwardRef<
                            HTMLDivElement,
                            {
                              status:
                                | 'in-stock'
                                | 'limited-stock'
                                | 'out-of-stock';
                              label: string;
                            }
                          >(({ label }, ref) => (
                            <div
                              ref={ref}
                              className="flex items-center gap-1 text-xs font-medium data-[state='out-of-stock']:text-status-error data-[state='in-stock']:text-status-success data-[state='limited-stock']:text-status-success"
                            >
                              {label}
                            </div>
                          ))}
                        </Product.Stock>
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

                        <ProductActionButtons />
                      </div>
                    )}
                  </SelectedVariantPrimitive.Actions>

                  {/* View Product Button */}
                  <Product.Slug asChild>
                    {React.forwardRef<HTMLAnchorElement, { slug: string }>(
                      ({ slug }, ref) => (
                        <a
                          ref={ref}
                          href={`/${slug}`}
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
                      )
                    )}
                  </Product.Slug>
                </div>
              </div>
            </ProductList.ProductRepeater>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
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
      )}
    </div>
  );
};

export const LoadMoreSection = () => {
  return (
    <div className="text-center mt-12">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ProductList.LoadMoreTrigger
          className="text-content-primary font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 btn-primary"
          loadingState="Loading..."
          label="Load More Products"
        />
      </div>
    </div>
  );
};

export function CategoryPage({
  productsListConfig,
  categoriesListConfig,
}: StoreCollectionPageProps) {
  return (
    <ProductList.Root productsListConfig={productsListConfig}>
      <ProductGridContent categoriesListConfig={categoriesListConfig} />
      <LoadMoreSection />
    </ProductList.Root>
  );
}
