import { StoreLayout } from '../../layouts/StoreLayout';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import { createServicesMap } from '@wix/services-manager';
import { useState } from 'react';
import {
  CatalogService,
  CatalogServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '@wix/headless-stores/services';
import {
  ProductsListService,
  ProductsListServiceDefinition,
} from '@wix/headless-stores/services';
import {
  FilterService,
  FilterServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SortService,
  SortServiceDefinition,
} from '@wix/headless-stores/services';
import ProductList from '../../components/store/ProductList';
import { WixServices } from '@wix/services-manager-react';
import '../../styles/theme-1.css';

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

export default function StoreCollectionPage({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreCollectionPageProps) {
  // Create navigation handler for category URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== 'undefined') {
      let newPath: string = '/category';

      if (categoryId !== null) {
        // Use category slug for URL
        if (!category?.slug) {
          console.warn(
            `Category ${categoryId} has no slug, using category ID as fallback`
          );
        }
        const categorySlug = category?.slug || categoryId;
        newPath = `/category/${categorySlug}`;
      }

      window.history.pushState(
        null,
        'Showing Category ' + category?.name,
        newPath
      );
    }
  };

  const [servicesMap] = useState(() =>
    createServicesMap()
      .addService(
        ProductsListServiceDefinition,
        ProductsListService,
        filteredCollectionServiceConfig
      )
      .addService(
        FilterServiceDefinition,
        FilterService,
        filteredCollectionServiceConfig
      )
      .addService(CategoryServiceDefinition, CategoryService, {
        ...categoriesConfig,
        onCategoryChange: handleCategoryChange,
      })
      .addService(SortServiceDefinition, SortService, {
        initialSort: filteredCollectionServiceConfig.initialSort,
      })
      .addService(CatalogServiceDefinition, CatalogService, {})
  );

  return (
    <KitchensinkLayout>
      <StoreLayout currentCartServiceConfig={currentCartServiceConfig}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--theme-text-content)] mb-4">
              Product Collection
            </h1>
            <p className="text-[var(--theme-text-content-70)] text-lg">
              Browse our collection of amazing products with advanced filtering
            </p>
          </div>

          <WixServices servicesMap={servicesMap}>
            <ProductList productPageRoute="" />
          </WixServices>
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
