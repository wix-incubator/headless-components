import React from 'react';
import { Product, ProductVariantSelector } from '@wix/headless-stores/react';

interface ProductActionButtonsProps {
  isQuickView?: boolean;
}

// Main Product Action Buttons Container
export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  isQuickView = false,
}) => {
  return (
    <ProductVariantSelector.Stock>
      {({ inStock, isPreOrderEnabled }) => (
        <div className="flex gap-3">
          {/* Show Add to Cart when in stock */}
          {inStock && (
            <Product.Action.AddToCart
              label="Add to Cart"
              className="flex-1 text-content-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 data-[disabled]:hover:scale-100 relative data-[disabled]:bg-surface-primary data-[disabled]:cursor-not-allowed btn-primary"
              loadingState={
                <>
                  <span className="opacity-0">Add to Cart</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin w-5 h-5 text-content-primary"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </>
              }
              data-testid="add-to-cart-button"
            />
          )}

          {/* Show Pre-Order when out of stock but pre-order is enabled */}
          {!inStock && isPreOrderEnabled && (
            <Product.Action.PreOrder
              label="Pre Order"
              className="flex-1 text-content-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 data-[disabled]:hover:scale-100 relative data-[disabled]:bg-surface-primary data-[disabled]:cursor-not-allowed btn-primary"
              loadingState={
                <>
                  <span className="opacity-0">Pre Order</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin w-5 h-5 text-content-primary"
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
                        d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </>
              }
              data-testid="pre-order-button"
            />
          )}

          {/* Buy Now Button - Only show for in-stock items and not in QuickView */}
          {inStock && !isQuickView && (
            <Product.Action.BuyNow
              label="Buy Now"
              className="flex-1 btn-warning text-content-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 data-[disabled]:hover:scale-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              loadingState={
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
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
                      d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              }
            />
          )}
        </div>
      )}
    </ProductVariantSelector.Stock>
  );
};

export default ProductActionButtons;
