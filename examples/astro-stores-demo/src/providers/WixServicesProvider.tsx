import { createServicesMap } from '@wix/services-manager';
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from '@wix/headless-ecom/services';
import {
  ProductService,
  ProductServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '@wix/headless-stores/services';
import type { ReactNode } from 'react';
import { WixServices } from '@wix/services-manager-react';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '@wix/headless-stores/services';
import { StoreLayout } from '../layouts/StoreLayout';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '@wix/headless-media/services';
import {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SocialSharingService,
  SocialSharingServiceDefinition,
} from '@wix/headless-stores/services';

export interface WixServicesProviderProps {
  children: ReactNode;
  // whether to show the cart icon in the header allowing the user to view the mini cart
  showCartIcon?: boolean;
}

export default function WixServicesProvider({
  children,
  showCartIcon = false,
}: WixServicesProviderProps) {
  let servicesMap = createServicesMap()
    .addService(SocialSharingServiceDefinition, SocialSharingService)
    .addService(ProductServiceDefinition, ProductService)
    .addService(CurrentCartServiceDefinition, CurrentCartService)
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService)
    .addService(CategoryServiceDefinition, CategoryService)
    .addService(ProductModifiersServiceDefinition, ProductModifiersService);

  return (
    <>
      {showCartIcon ? (
        <StoreLayout currentCartServiceConfig={null} servicesMap={servicesMap}>
          {children}
        </StoreLayout>
      ) : (
        <WixServices servicesMap={servicesMap}>{children}</WixServices>
      )}
    </>
  );
}
