import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';
import { type CurrentCartServiceConfig } from '@wix/headless-ecom/services';
import { CurrentCart } from '@wix/headless-ecom/react';
import { MiniCartModalProvider } from '../components/MiniCartModal';

interface CartPageProps {
  currentCartServiceConfig: CurrentCartServiceConfig;
}

export default function CartPage({ currentCartServiceConfig }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <MiniCartModalProvider>
        <CurrentCart.Root currentCartServiceConfig={currentCartServiceConfig}>
          <CartContent />
        </CurrentCart.Root>
      </MiniCartModalProvider>
    </KitchensinkLayout>
  );
}
