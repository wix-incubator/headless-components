import { useState } from 'react';
import {
  Cart,
  LineItem,
  SelectedOption,
  Quantity,
} from '@wix/headless-ecom/react';
import { WixMediaImage } from '../media';

// Mini coupon form for the cart sidebar
const CouponFormMini = ({
  apply,
  isLoading,
  appliedCoupon,
}: {
  apply: (code: string) => void;
  isLoading: boolean;
  appliedCoupon: string | null;
}) => {
  if (appliedCoupon) {
    return null;
  }

  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      apply(code.trim());
      setCode('');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-accent hover:text-brand-light text-xs font-medium"
      >
        Have a promo code?
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-1">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Promo code"
          className="flex-1 px-2 py-1 text-xs bg-surface-interactive border border-surface-interactive rounded text-content-primary placeholder:text-content-muted focus:border-brand-light focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="btn-accent px-2 py-1 disabled:opacity-50 text-content-primary text-xs font-medium rounded"
        >
          {isLoading ? '...' : 'Apply'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        className="text-content-muted hover:text-content-secondary text-xs"
      >
        Cancel
      </button>
    </form>
  );
};

export function MiniCartIcon() {
  return (
    <>
      {/* Fixed Cart Icon */}
      <div className="fixed top-6 right-6 z-50">
        <Cart.OpenTrigger>
          {({ open, totalItems }) => (
            <button
              onClick={open}
              className="relative p-2 text-content-primary hover:text-brand-light transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-medium text-content-primary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </Cart.OpenTrigger>
      </div>
    </>
  );
}

export function MiniCartContent() {
  return (
    <>
      {/* Cart Modal */}
      <Cart.Content>
        {({ isOpen, close }) => {
          // Lock body scroll when modal is open
          if (typeof document !== 'undefined') {
            if (isOpen) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = 'unset';
            }
          }

          return (
            <>
              {isOpen && (
                <div
                  className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-sm"
                  onClick={close}
                >
                  <div
                    className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-modal shadow-xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between p-6 border-b border-surface-subtle flex-shrink-0">
                      <Cart.Summary asChild>
                        {({ totalItems }) => (
                          <h2 className="text-xl font-bold text-content-primary">
                            Shopping Cart ({totalItems})
                          </h2>
                        )}
                      </Cart.Summary>

                      <button
                        onClick={close}
                        className="p-2 text-content-primary hover:text-brand-light transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0">
                      <Cart.LineItems
                        emptyState={
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-surface-interactive rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg
                                className="w-8 h-8 text-content-muted"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                                />
                              </svg>
                            </div>
                            <p className="text-content-muted">
                              Your cart is empty
                            </p>
                          </div>
                        }
                      >
                        <Cart.LineItemRepeater>
                          <div className="flex gap-4 p-4 border border-brand-light rounded-lg">
                            <LineItem.Image className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1 space-y-2">
                              <LineItem.Title className="text-lg font-semibold text-content-primary" />
                              <LineItem.SelectedOptions>
                                <div className="flex flex-wrap gap-2">
                                  <LineItem.SelectedOptionRepeater>
                                    <SelectedOption.Text className="text-sm text-content-secondary" />
                                    <SelectedOption.Color className="flex items-center gap-2 text-sm text-content-secondary" />
                                  </LineItem.SelectedOptionRepeater>
                                </div>
                              </LineItem.SelectedOptions>

                              {/* Quantity Controls */}
                              <LineItem.Quantity steps={1}>
                                <div className="flex items-center gap-2 mt-3">
                                  <span className="text-sm text-content-secondary">
                                    Qty:
                                  </span>
                                  <div className="flex items-center border border-brand-light rounded-lg bg-surface-primary">
                                    <Quantity.Decrement className="px-3 py-1 text-content-primary hover:bg-surface-interactive transition-colors" />
                                    <Quantity.Input
                                      disabled={true}
                                      className="w-16 text-center py-1 border-x border-brand-light bg-surface-primary text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                    <Quantity.Increment className="px-3 py-1 text-content-primary hover:bg-surface-interactive transition-colors" />
                                  </div>
                                  <Quantity.Reset className="px-2 py-1 text-xs text-status-danger hover:text-status-danger/80 hover:bg-status-danger/10 rounded transition-colors">
                                    Remove
                                  </Quantity.Reset>
                                </div>
                              </LineItem.Quantity>
                            </div>
                          </div>
                        </Cart.LineItemRepeater>
                      </Cart.LineItems>
                    </div>

                    <div className="border-t border-surface-subtle p-6 flex-shrink-0">
                      <Cart.Notes />

                      {/* Coupon Code */}
                      <div className="mb-4">
                        <Cart.Coupon.Input
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-brand-light rounded-lg focus:ring-2 focus:ring-brand-primary"
                        />
                        <Cart.Coupon.Clear className="text-sm text-content-muted hover:text-content-primary mt-2 inline-block">
                          Remove applied coupon
                        </Cart.Coupon.Clear>

                        <Cart.Coupon.Trigger asChild>
                          {({ apply, isLoading, appliedCoupon }) => (
                            <CouponFormMini
                              apply={apply}
                              isLoading={isLoading}
                              appliedCoupon={appliedCoupon}
                            />
                          )}
                        </Cart.Coupon.Trigger>
                      </div>

                      <Cart.Summary>
                        {({
                          subtotal,
                          discount,
                          appliedCoupon,
                          shipping,
                          tax,
                          total,
                          totalItems,
                          isTotalsLoading,
                        }) => {
                          const LoadingOrValue = ({
                            children,
                          }: {
                            children: string;
                          }) =>
                            isTotalsLoading ? (
                              <span className="text-content-muted">
                                Calculating...
                              </span>
                            ) : (
                              children
                            );

                          return (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-content-secondary">
                                    Subtotal ({totalItems}{' '}
                                    {totalItems === 1 ? 'item' : 'items'})
                                  </span>
                                  <span className="text-content-primary font-semibold">
                                    <LoadingOrValue>{subtotal}</LoadingOrValue>
                                  </span>
                                </div>
                                {appliedCoupon && discount && (
                                  <div className="flex justify-between">
                                    <span className="text-status-success">
                                      Discount
                                    </span>
                                    <span className="text-status-success font-semibold">
                                      {isTotalsLoading ? (
                                        <span className="text-content-muted">
                                          Calculating...
                                        </span>
                                      ) : (
                                        `-${discount}`
                                      )}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-content-secondary">
                                    Shipping
                                  </span>
                                  <span className="text-content-primary font-semibold">
                                    <LoadingOrValue>{shipping}</LoadingOrValue>
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-content-secondary">
                                    Tax
                                  </span>
                                  <span className="text-content-primary font-semibold">
                                    <LoadingOrValue>{tax}</LoadingOrValue>
                                  </span>
                                </div>
                                <div className="border-t border-surface-interactive pt-2">
                                  <div className="flex justify-between">
                                    <span className="text-content-primary font-bold">
                                      Total
                                    </span>
                                    <span className="text-content-primary font-bold text-lg">
                                      <LoadingOrValue>{total}</LoadingOrValue>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-center w-full">
                                <Cart.Checkout>
                                  {({
                                    proceedToCheckout,
                                    canCheckout,
                                    error,
                                  }) => (
                                    <>
                                      <button
                                        onClick={proceedToCheckout}
                                        disabled={!canCheckout}
                                        className="w-full bg-gradient-primary bg-gradient-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-content-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center"
                                      >
                                        Proceed to Checkout
                                      </button>
                                      {error && (
                                        <div className="bg-status-danger-light border border-status-danger rounded p-2 mt-2 w-full">
                                          <p className="text-status-danger text-xs">
                                            Failed to checkout. Please contact
                                            support.
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </Cart.Checkout>
                              </div>
                            </div>
                          );
                        }}
                      </Cart.Summary>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </Cart.Content>
    </>
  );
}
