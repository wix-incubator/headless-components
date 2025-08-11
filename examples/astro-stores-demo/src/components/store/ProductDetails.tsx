import { MediaGallery } from '@wix/headless-media/react';
import { WixMediaImage } from '../media';
import React from 'react';

import { productsV3 } from '@wix/stores';

import {
  Product as ProductPrimitive,
  ProductModifiers as ProductModifiersPrimitive,
  ProductVariantSelector as ProductVariantSelectorPrimitive,
  SelectedVariant as SelectedVariantPrimitive,
  ProductV2 as Product,
  Option,
} from '@wix/headless-stores/react';
import { ProductActionButtons } from './ProductActionButtons';
import { CurrentCart } from '@wix/headless-ecom/react';

import { getStockStatusMessage } from './product-status-enums';

// Reusable FreeText Input Component
const FreeTextInput = ({ modifier, name }: { modifier: any; name: string }) => (
  <ProductModifiersPrimitive.FreeText modifier={modifier}>
    {({
      value,
      setText,
      placeholder: freeTextPlaceholder,
      charCount,
      isOverLimit,
      maxChars,
    }) => (
      <div className="space-y-2">
        <textarea
          data-testid="product-modifier-free-text-input"
          value={value}
          onChange={e => setText(e.target.value)}
          placeholder={
            freeTextPlaceholder || `Enter custom ${name.toLowerCase()}...`
          }
          maxLength={maxChars}
          className="w-full p-3 border border-brand-light rounded-lg bg-surface-primary text-content-primary placeholder-text-content-subtle focus:border-brand-medium focus:outline-none resize-none"
          rows={3}
        />
        {maxChars && (
          <div
            className={`text-xs text-right ${
              isOverLimit ? 'text-status-error' : 'text-content-muted'
            }`}
          >
            {charCount}/{maxChars} characters
          </div>
        )}
      </div>
    )}
  </ProductModifiersPrimitive.FreeText>
);

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
        <ProductPrimitive.Root productServiceConfig={{ product }}>
          <MediaGallery.Root
            mediaGalleryServiceConfig={{
              media: product.media?.itemsInfo?.items ?? [],
            }}
          >
            <SelectedVariantPrimitive.Root>
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-surface-primary rounded-2xl overflow-hidden border border-brand-subtle relative">
                  <MediaGallery.Viewport>
                    {({ src, alt }) => (
                      <>
                        {src ? (
                          <WixMediaImage
                            media={{ image: src }}
                            className="w-full h-full object-cover"
                            alt={alt}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-24 h-24 text-content-subtle"
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

                        <MediaGallery.Previous>
                          {({ previous, canGoPrevious }) => (
                            <button
                              onClick={previous}
                              disabled={!canGoPrevious}
                              className="absolute left-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all"
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
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </MediaGallery.Previous>

                        <MediaGallery.Next>
                          {({ next, canGoNext }) => (
                            <button
                              onClick={next}
                              disabled={!canGoNext}
                              className="absolute right-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all"
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
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          )}
                        </MediaGallery.Next>

                        {/* Image Counter */}
                        {
                          <MediaGallery.Indicator>
                            {({ current, total }) => (
                              <div className="absolute bottom-4 right-4 bg-surface-tooltip text-nav px-3 py-1 rounded-full text-sm">
                                {current} / {total}
                              </div>
                            )}
                          </MediaGallery.Indicator>
                        }
                      </>
                    )}
                  </MediaGallery.Viewport>
                </div>

                {/* Thumbnail Images */}
                <MediaGallery.ThumbnailList>
                  {({ items }) => (
                    <div className="grid grid-cols-4 gap-4">
                      {items.map((_, i) => (
                        <MediaGallery.ThumbnailItem key={i} index={i}>
                          {({ src, isActive, select, alt }) => (
                            <div
                              onClick={select}
                              className={`aspect-square bg-surface-primary rounded-lg border cursor-pointer transition-all ${
                                isActive
                                  ? 'border-brand-medium ring-2 ring-brand-light'
                                  : 'border-brand-subtle hover:border-brand-light'
                              }`}
                            >
                              {src ? (
                                <WixMediaImage
                                  media={{ image: src }}
                                  className="w-full h-full object-cover rounded-lg"
                                  alt={alt}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg
                                    className="w-6 h-6 text-content-subtle"
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
                            </div>
                          )}
                        </MediaGallery.ThumbnailItem>
                      ))}
                    </div>
                  )}
                </MediaGallery.ThumbnailList>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <Product.Root product={product}>
                  {/* Product Name & Price */}
                  <div>
                    <Product.Name asChild>
                      <h1 className="text-4xl font-bold text-content-primary mb-4" />
                    </Product.Name>
                    <div className="space-y-1">
                      <Product.Price className="text-3xl font-bold text-content-primary" />
                      <Product.CompareAtPrice asChild>
                        {React.forwardRef<
                          HTMLDivElement,
                          { formattedPrice: string }
                        >(({ formattedPrice, ...props }, ref) => (
                          <div
                            ref={ref}
                            {...props}
                            className="text-lg font-medium text-content-faded line-through"
                          >
                            {formattedPrice}
                          </div>
                        ))}
                      </Product.CompareAtPrice>
                    </div>
                    {isQuickView && (
                      <SelectedVariantPrimitive.SKU>
                        {({ sku }) =>
                          sku && (
                            <>
                              <br />
                              <div className="text-base text-content-muted">
                                SKU: {sku}
                              </div>
                            </>
                          )
                        }
                      </SelectedVariantPrimitive.SKU>
                    )}
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

                  {/* Product Options (if any) - Using New Simplified API */}
                  <ProductVariantSelectorPrimitive.Root>
                    <Product.Variants>
                      <div className="space-y-6" data-testid="product-options">
                        <h3 className="text-lg font-semibold text-content-primary">
                          Product Options
                        </h3>

                        <Product.VariantOptions>
                          <Product.VariantOptionRepeater>
                            <div className="space-y-3">
                              <Option.Name className="text-lg font-semibold text-content-primary mb-3" />
                              <Option.Choices>
                                <div className="flex flex-wrap gap-3">
                                  <Option.ChoiceRepeater>
                                    <Option.Choice.Color
                                      className="w-10 h-10 rounded-full border-4 transition-all duration-200 data-[selected]:border-brand-primary data-[selected]:shadow-lg data-[selected]:scale-110 data-[selected]:ring-2 data-[selected]:ring-brand-primary/30 border-color-swatch hover:border-color-swatch-hover hover:scale-105"
                                      data-testid="product-modifier-choice-button"
                                    />
                                    <Option.Choice.Text
                                      className="px-4 py-2 border rounded-lg transition-all duration-200 data-[selected]:bg-brand-primary data-[selected]:text-white data-[selected]:border-brand-primary border-brand-light hover:border-brand-medium text-content-primary"
                                      data-testid="product-modifier-choice-button"
                                    />
                                  </Option.ChoiceRepeater>
                                </div>
                              </Option.Choices>
                            </div>
                          </Product.VariantOptionRepeater>
                        </Product.VariantOptions>

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
                      </div>
                    </Product.Variants>

                    {/* Product Modifiers */}
                    <ProductModifiersPrimitive.Root>
                      <ProductModifiersPrimitive.Modifiers>
                        {({ modifiers, hasModifiers }) => (
                          <>
                            {hasModifiers && (
                              <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-content-primary">
                                  Product Modifiers
                                </h3>

                                {modifiers.map((modifier: any) => (
                                  <ProductModifiersPrimitive.Modifier
                                    key={modifier.name}
                                    modifier={modifier}
                                  >
                                    {({
                                      name,
                                      type,
                                      choices,
                                      hasChoices,
                                      mandatory,
                                    }) => (
                                      <div
                                        className="space-y-3"
                                        data-testid="product-modifiers"
                                      >
                                        <h4 className="text-md font-medium text-content-primary">
                                          {name}{' '}
                                          {mandatory && (
                                            <span className="text-status-error">
                                              *
                                            </span>
                                          )}
                                        </h4>

                                        {type === 'SWATCH_CHOICES' &&
                                          hasChoices && (
                                            <div className="flex flex-wrap gap-2">
                                              {choices.map((choice: any) => (
                                                <ProductModifiersPrimitive.Choice
                                                  key={choice.value}
                                                  modifier={modifier}
                                                  choice={choice}
                                                >
                                                  {({
                                                    value,
                                                    isSelected,
                                                    colorCode,
                                                    select,
                                                  }) => (
                                                    <button
                                                      data-testid="product-modifier-choice-button"
                                                      onClick={select}
                                                      className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                                        isSelected
                                                          ? 'border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30'
                                                          : 'border-brand-light hover:border-brand-medium hover:scale-105'
                                                      }`}
                                                      style={{
                                                        backgroundColor:
                                                          colorCode ||
                                                          'var(--theme-text-content-40)',
                                                      }}
                                                      title={value}
                                                    />
                                                  )}
                                                </ProductModifiersPrimitive.Choice>
                                              ))}
                                            </div>
                                          )}

                                        {type === 'TEXT_CHOICES' &&
                                          hasChoices && (
                                            <div className="flex flex-wrap gap-2">
                                              {choices.map((choice: any) => (
                                                <ProductModifiersPrimitive.Choice
                                                  key={choice.value}
                                                  modifier={modifier}
                                                  choice={choice}
                                                >
                                                  {({
                                                    value,
                                                    isSelected,
                                                    select,
                                                  }) => (
                                                    <button
                                                      data-testid="product-modifier-choice-button"
                                                      onClick={select}
                                                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                                                        isSelected
                                                          ? 'product-option-active'
                                                          : 'product-option-inactive'
                                                      }`}
                                                    >
                                                      {value}
                                                    </button>
                                                  )}
                                                </ProductModifiersPrimitive.Choice>
                                              ))}
                                            </div>
                                          )}

                                        {type === 'FREE_TEXT' && (
                                          <>
                                            {mandatory ? (
                                              <FreeTextInput
                                                data-testid="product-modifier-free-text"
                                                modifier={modifier}
                                                name={name}
                                              />
                                            ) : (
                                              <ProductModifiersPrimitive.ToggleFreeText
                                                modifier={modifier}
                                              >
                                                {({
                                                  isTextInputShown,
                                                  toggle,
                                                }) => (
                                                  <div className="space-y-3">
                                                    <label className="flex items-center gap-2">
                                                      <input
                                                        type="checkbox"
                                                        checked={
                                                          isTextInputShown
                                                        }
                                                        onChange={toggle}
                                                        className="w-4 h-4 text-brand-primary rounded border-brand-light focus:ring-brand-primary"
                                                      />
                                                      <span className="text-content-primary">
                                                        Enable
                                                      </span>
                                                    </label>
                                                    {isTextInputShown && (
                                                      <FreeTextInput
                                                        modifier={modifier}
                                                        name={name}
                                                      />
                                                    )}
                                                  </div>
                                                )}
                                              </ProductModifiersPrimitive.ToggleFreeText>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </ProductModifiersPrimitive.Modifier>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </ProductModifiersPrimitive.Modifiers>
                    </ProductModifiersPrimitive.Root>

                    {/* Quantity Selector */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-content-primary">
                        Quantity
                      </h3>
                      <ProductVariantSelectorPrimitive.Stock>
                        {({
                          inStock,
                          isPreOrderEnabled,
                          availableQuantity,
                          selectedQuantity,
                          incrementQuantity,
                          decrementQuantity,
                        }) => {
                          return (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-brand-light rounded-lg">
                                <button
                                  onClick={decrementQuantity}
                                  disabled={
                                    selectedQuantity <= 1 ||
                                    (!inStock && !isPreOrderEnabled)
                                  }
                                  className="px-3 py-2 text-content-primary hover:bg-surface-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-4 py-2 text-content-primary border-x border-brand-light min-w-[3rem] text-center">
                                  {selectedQuantity}
                                </span>
                                <button
                                  onClick={incrementQuantity}
                                  disabled={
                                    (!!availableQuantity &&
                                      selectedQuantity >= availableQuantity) ||
                                    (!inStock && !isPreOrderEnabled)
                                  }
                                  className="px-3 py-2 text-content-primary hover:bg-surface-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>
                              {/* Show max quantity only when out of stock AND preorder enabled */}
                              {!inStock &&
                                isPreOrderEnabled &&
                                availableQuantity && (
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
                          );
                        }}
                      </ProductVariantSelectorPrimitive.Stock>
                    </div>

                    {/* Add to Cart */}
                    <div className="space-y-4">
                      <SelectedVariantPrimitive.Actions>
                        {({
                          error,
                          isPreOrderEnabled,
                          preOrderMessage,
                          inStock,
                        }) => (
                          <div className="space-y-4">
                            {error && (
                              <div className="bg-status-danger-light border border-status-danger rounded-lg p-3">
                                <p className="text-status-error text-sm">
                                  {error}
                                </p>
                              </div>
                            )}
                            {!inStock &&
                              preOrderMessage &&
                              isPreOrderEnabled && (
                                <div className="bg-status-info-light border border-status-info rounded-lg p-3">
                                  <p className="text-status-info text-sm">
                                    {preOrderMessage}
                                  </p>
                                </div>
                              )}

                            <ProductActionButtons isQuickView={isQuickView} />
                          </div>
                        )}
                      </SelectedVariantPrimitive.Actions>

                      {/* Stock Status */}
                      <ProductVariantSelectorPrimitive.Stock>
                        {({
                          inStock,
                          isPreOrderEnabled,
                          availabilityStatus,
                          availableQuantity,
                          trackInventory,
                          currentVariantId,
                        }) => {
                          const displayMessage = getStockStatusMessage(
                            availabilityStatus,
                            isPreOrderEnabled
                          );
                          return (
                            (!!availabilityStatus || currentVariantId) && (
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    inStock || isPreOrderEnabled
                                      ? 'status-dot-success'
                                      : 'status-dot-danger'
                                  }`}
                                ></div>
                                <span
                                  className={`text-sm ${
                                    inStock || isPreOrderEnabled
                                      ? 'text-status-success'
                                      : 'text-status-error'
                                  }`}
                                >
                                  {displayMessage}
                                  {trackInventory &&
                                    availableQuantity !== null && (
                                      <span className="text-content-muted ml-1">
                                        ({availableQuantity} available)
                                      </span>
                                    )}
                                </span>
                              </div>
                            )
                          );
                        }}
                      </ProductVariantSelectorPrimitive.Stock>
                    </div>
                  </ProductVariantSelectorPrimitive.Root>

                  {/* Product Details */}
                  {!isQuickView && (
                    <SelectedVariantPrimitive.Details>
                      {({ sku, weight }) => (
                        <>
                          {(sku || weight) && (
                            <div className="border-t border-brand-light pt-8">
                              <h3 className="text-xl font-semibold text-content-primary mb-4">
                                Product Details
                              </h3>
                              <div className="space-y-3 text-content-secondary">
                                {sku && (
                                  <div className="flex justify-between">
                                    <span>SKU:</span>
                                    <span>{sku}</span>
                                  </div>
                                )}
                                {weight && (
                                  <div className="flex justify-between">
                                    <span>Weight:</span>
                                    <span>{weight}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </SelectedVariantPrimitive.Details>
                  )}
                </Product.Root>
              </div>
            </SelectedVariantPrimitive.Root>
          </MediaGallery.Root>
        </ProductPrimitive.Root>
      </div>

      {/* Current Cart Summary */}
      {!isQuickView && (
        <div className="mt-12 pt-8 border-t border-brand-subtle">
          <CurrentCart.Summary>
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
          </CurrentCart.Summary>
        </div>
      )}
    </>
  );
}
