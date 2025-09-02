import * as StyledMediaGallery from '../media/MediaGallery';
import React from 'react';

import { productsV3 } from '@wix/stores';

import { Product, Option, Choice } from '@wix/headless-stores/react';

import { ProductActionButtons } from './ProductActionButtons';
import { Cart } from '@wix/headless-ecom/react';

// This component is no longer needed as we'll use Choice.FreeText directly

export default function ProductDetails({
  isQuickView = false,
  product,
}: {
  isQuickView?: boolean;
  product: productsV3.V3Product;
}) {
  return (
    <>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        data-testid="product-details"
      >
        <Product.Root product={product}>
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-surface-primary rounded-2xl overflow-hidden border border-brand-subtle relative">
              <StyledMediaGallery.Viewport />
              <StyledMediaGallery.Previous />
              <StyledMediaGallery.Next />
              <StyledMediaGallery.Indicator />
            </div>

            {/* Thumbnail Images */}
            <StyledMediaGallery.Thumbnails>
              <StyledMediaGallery.ThumbnailRepeater>
                <StyledMediaGallery.ThumbnailItem />
              </StyledMediaGallery.ThumbnailRepeater>
            </StyledMediaGallery.Thumbnails>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Product Name & Price */}
            <div>
              <Product.Name asChild>
                <h1 className="text-4xl font-bold text-content-primary mb-4" />
              </Product.Name>
              <div className="space-y-1">
                <Product.Price className="text-3xl font-bold text-content-primary" />
                <Product.CompareAtPrice asChild>
                  {React.forwardRef<HTMLDivElement, { formattedPrice: string }>(
                    ({ formattedPrice, ...props }, ref) => (
                      <div
                        ref={ref}
                        {...props}
                        className="text-lg font-medium text-content-faded line-through"
                      >
                        {formattedPrice}
                      </div>
                    )
                  )}
                </Product.CompareAtPrice>
              </div>
            </div>

            {/* Product Description */}
            {!isQuickView && (
              <Product.Description as="html" asChild>
                {({ description }) => (
                  <div>
                    <h3 className="text-xl font-semibold text-content-primary mb-3">
                      Description
                    </h3>
                    <div
                      className="text-content-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}
              </Product.Description>
            )}

            <Product.Variants>
              <div className="space-y-6" data-testid="product-options">
                <h3 className="text-lg font-semibold text-content-primary">
                  Product Options
                </h3>

                <Product.VariantOptions>
                  <Product.VariantOptionRepeater>
                    <div className="space-y-3 mb-4">
                      <Option.Name className="text-lg font-semibold text-content-primary mb-3" />
                      <Option.Choices>
                        <div className="flex flex-wrap gap-3">
                          <Option.ChoiceRepeater>
                            <Choice.Color className="w-10 h-10 rounded-full border-2 transition-all duration-200 border-color-swatch hover:border-color-swatch-hover hover:scale-105 data-[selected='true']:border-accent-strong data-[selected='true']:ring-1 data-[selected='true']:scale-115 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale" />
                            <Choice.Text className="text-lg inline-flex items-center px-2 py-1 border transition-all duration-200 border-color-swatch hover:border-color-swatch-hover hover:scale-105 data-[selected='true']:border-accent-strong data-[selected='true']:shadow-lg data-[selected='true']:bg-primary data-[selected='true']:scale-115 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale" />
                          </Option.ChoiceRepeater>
                        </div>
                      </Option.Choices>
                    </div>
                  </Product.VariantOptionRepeater>
                </Product.VariantOptions>

                <Product.ProductVariantSelectorReset className="text-sm text-brand-primary hover:text-brand-light transition-colors" />
              </div>
            </Product.Variants>

            <Product.Modifiers>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  Product Modifiers
                </h3>

                <Product.ModifierOptions>
                  <Product.ModifierOptionRepeater
                    allowedTypes={['color', 'text', 'free-text']}
                  >
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Option.Name className="text-md font-medium text-content-primary" />
                        <Option.MandatoryIndicator className="text-status-error" />
                      </div>

                      <Option.Choices>
                        <div className="flex flex-wrap gap-3">
                          <Option.ChoiceRepeater>
                            <>
                              <Choice.Color className="w-10 h-10 rounded-full border-4 transition-all duration-200 border-brand-light hover:border-brand-medium hover:scale-105 data-[selected='true']:border-brand-primary data-[selected='true']:shadow-lg data-[selected='true']:scale-110 data-[selected='true']:ring-2 data-[selected='true']:ring-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale" />

                              <Choice.Text className="px-4 py-2 border rounded-lg transition-all duration-200 product-option-inactive data-[selected='true']:product-option-active disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400" />

                              <Choice.FreeText className="w-full p-3 border border-brand-light rounded-lg bg-surface-primary text-content-primary placeholder-text-content-subtle focus:border-brand-medium focus:outline-none resize-none" />
                            </>
                          </Option.ChoiceRepeater>
                        </div>
                      </Option.Choices>
                    </div>
                  </Product.ModifierOptionRepeater>
                </Product.ModifierOptions>
              </div>
            </Product.Modifiers>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-content-primary">
                Quantity
              </h3>
              <Product.Quantity.Root className="flex items-center gap-3">
                <>
                  <div className="flex items-center border border-brand-light rounded-lg">
                    <Product.Quantity.Decrement className="px-3 py-1 hover:bg-surface-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" />
                    <Product.Quantity.Input className="w-16 text-center py-1 border-x border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    <Product.Quantity.Increment className="px-3 py-1 hover:bg-surface-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" />
                  </div>
                  <Product.Quantity.Raw asChild>
                    {({ availableQuantity, inStock, isPreOrderEnabled }) => (
                      <div>
                        {/* Show max quantity only when out of stock AND preorder enabled */}
                        {!inStock && isPreOrderEnabled && availableQuantity && (
                          <span className="text-content-muted text-sm">
                            Max: {availableQuantity} Pre Order
                          </span>
                        )}
                        {/* Show stock message when in stock but available quantity < 10 */}
                        {inStock &&
                          availableQuantity &&
                          availableQuantity < 10 && (
                            <span className="text-content-muted text-sm">
                              Only {availableQuantity} left in stock
                            </span>
                          )}
                      </div>
                    )}
                  </Product.Quantity.Raw>
                </>
              </Product.Quantity.Root>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <ProductActionButtons showBuyNow={true} />
            </div>

            {/* Product Details */}
            {!isQuickView && (
              <div className="border-t border-brand-light pt-8">
                <h3 className="text-xl font-semibold text-content-primary mb-4">
                  Product Details
                </h3>
                <div className="space-y-3 text-content-secondary">
                  <div className="flex items-center gap-2">
                    <span>SKU:</span>
                    <Product.ProductVariant.SKU />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Weight:</span>
                    <Product.ProductVariant.Weight />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Product.Root>
      </div>

      {/* Current Cart Summary */}
      {!isQuickView && (
        <div className="mt-12 pt-8 border-t border-brand-subtle">
          <Cart.Summary>
            {({ subtotal, totalItems }) => (
              <>
                {totalItems > 0 && (
                  <div className="bg-surface-primary backdrop-blur-sm rounded-xl p-6 border border-brand-subtle">
                    <h3 className="text-xl font-semibold text-content-primary mb-4">
                      Cart Summary
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-content-secondary">
                        {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                      </span>
                      <span className="text-xl font-bold text-content-primary">
                        {subtotal}
                      </span>
                    </div>
                    <a
                      data-testid="view-cart-button"
                      href="/cart"
                      className="mt-4 w-full text-content-primary font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-secondary"
                    >
                      View Cart
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
                )}
              </>
            )}
          </Cart.Summary>
        </div>
      )}
    </>
  );
}
