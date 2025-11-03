import { loadCurrentCartServiceConfig } from '@wix/ecom/services';
import CartContent from '../../ecom/Cart';

export async function rootRouteLoader() {
    const [currentCartServiceConfig] = await Promise.all([
      loadCurrentCartServiceConfig(),
    ]);
  
    return {
      currentCartServiceConfig,
    };
  }

export default function CartPage() {
  return (      
    <CartContent />          
  );
}
