import { CurrentCartService } from '@wix/headless-ecom/services';
import {
  ProductService,
  ProductServiceDefinition,
  ProductModifiersService,
  ProductModifiersServiceDefinition,
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '@wix/headless-stores/services';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '@wix/headless-media/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { StoreLayout } from '../layouts/StoreLayout';
import ProductDetails from '../components/store/ProductDetails';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
import '../styles/theme-1.css';
import type { ServiceFactoryConfig } from '@wix/services-definitions';

interface ProductDetailPageProps {
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
  currentCartServiceConfig: ServiceFactoryConfig<typeof CurrentCartService>;
}

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
}: ProductDetailPageProps) {
  // Create services manager with all required services
  const servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, productServiceConfig)
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(ProductModifiersServiceDefinition, ProductModifiersService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService, {
      media: productServiceConfig.product?.media?.itemsInfo?.items ?? [],
    });

  return (
    <>
      <KitchensinkLayout>
        <StoreLayout currentCartServiceConfig={currentCartServiceConfig}>
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              {/* Back to Store */}
              <div className="mb-8">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-[var(--theme-text-content-60)] hover:text-[var(--theme-text-content)] transition-colors"
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
                  Back to Store
                </a>
              </div>

              <WixServices servicesMap={servicesMap}>
                <ProductDetails product={productServiceConfig.product} />
              </WixServices>
            </div>
          </div>
        </StoreLayout>
      </KitchensinkLayout>
    </>
  );
}
