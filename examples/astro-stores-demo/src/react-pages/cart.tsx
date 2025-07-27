import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';

interface CartPageProps {
  data?: any;
}

export default function CartPage({ data }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <CartContent />
    </KitchensinkLayout>
  );
}
