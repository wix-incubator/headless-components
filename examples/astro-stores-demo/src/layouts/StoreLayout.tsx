import { useEffect, useState, type ReactNode } from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { MiniCartContent, MiniCartIcon } from '../components/ecom/MiniCart';
import { CurrentCart } from '@wix/headless-ecom/react';

interface StoreLayoutProps {
  children: ReactNode;
  currentCartServiceConfig: any;
  servicesMap?: any;
  showSuccessMessage?: boolean;
  onSuccessMessageChange?: (show: boolean) => void;
}

export function StoreLayout({
  children,
  currentCartServiceConfig,
}: StoreLayoutProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <CurrentCart.Root currentCartServiceConfig={currentCartServiceConfig}>
      <StoreLayoutContent
        children={children}
        showSuccessMessage={showSuccessMessage}
        setShowSuccessMessage={setShowSuccessMessage}
      />
    </CurrentCart.Root>
  );
}

function StoreLayoutContent({
  children,
  showSuccessMessage,
  setShowSuccessMessage,
}: {
  children: ReactNode;
  showSuccessMessage: boolean;
  setShowSuccessMessage: (show: boolean) => void;
}) {
  return (
    <>
      <CurrentCart.Trigger>
        {({ onOpen }) => (
          <CurrentCart.LineItemAdded>
            {({ onAddedToCart }) => {
              useEffect(
                () =>
                  onAddedToCart(() => {
                    setShowSuccessMessage(true);
                    setTimeout(() => {
                      setShowSuccessMessage(false);
                      onOpen();
                    }, 3000);
                  }),
                [onAddedToCart]
              );

              return null;
            }}
          </CurrentCart.LineItemAdded>
        )}
      </CurrentCart.Trigger>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to cart successfully!
          </div>
        </div>
      )}

      <MiniCartIcon />

      {/* Main Content */}
      {children}

      <MiniCartContent />
    </>
  );
}
