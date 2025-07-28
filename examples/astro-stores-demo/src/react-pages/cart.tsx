import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';
import { type CurrentCartServiceConfig } from '@wix/headless-ecom/services';

interface CartPageProps {
  currentCartServiceConfig: CurrentCartServiceConfig;
}

export default function CartPage({ currentCartServiceConfig }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <CartContent currentCartServiceConfig={currentCartServiceConfig} />
    </KitchensinkLayout>
  );
}
