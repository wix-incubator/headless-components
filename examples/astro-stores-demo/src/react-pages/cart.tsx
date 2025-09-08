import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';
import { type CurrentCartServiceConfig } from '@wix/headless-ecom/services';
import { CurrentCart, Commerce } from '@wix/headless-ecom/react';
import { MiniCartModalProvider } from '../components/MiniCartModal';

interface CartPageProps {
  currentCartServiceConfig: CurrentCartServiceConfig;
}

export default function CartPage({ currentCartServiceConfig }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <MiniCartModalProvider>
        <Commerce.Root checkoutServiceConfig={{}}>
          <CurrentCart.Root currentCartServiceConfig={currentCartServiceConfig}>
            <CartContent />
          </CurrentCart.Root>
        </Commerce.Root>
      </MiniCartModalProvider>
    </KitchensinkLayout>
  );
}
