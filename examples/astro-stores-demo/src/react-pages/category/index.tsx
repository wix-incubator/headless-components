import { StoreLayout } from '../../layouts/StoreLayout';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import { createServicesMap } from '@wix/services-manager';
import { useState } from 'react';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '@wix/headless-stores/services';
import { WixServices } from '@wix/services-manager-react';
import '../../styles/theme-1.css';
import { CategoryPage } from '../../components/store/CategoryPage';

interface StoreCollectionPageProps {
  currentCartServiceConfig: any;
  categoryServiceConfig: any;
  categoriesListConfig: any;
  productsListConfig: any;
  productsListFiltersConfig: any;
  slug: string;
}

export default function StoreCollectionPage({
  currentCartServiceConfig,
  categoryServiceConfig,
  categoriesListConfig,
  productsListConfig,
  productsListFiltersConfig,
  slug,
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

  // const [servicesMap] = useState(() =>
  //   createServicesMap()
  //     .addService(
  //       CollectionServiceDefinition,
  //       CollectionService,
  //       filteredCollectionServiceConfig
  //     )
  //     .addService(
  //       FilterServiceDefinition,
  //       FilterService,
  //       filteredCollectionServiceConfig
  //     )
  //     .addService(CategoryServiceDefinition, CategoryService, {
  //       ...categoriesConfig,
  //       onCategoryChange: handleCategoryChange,
  //     })
  //     .addService(SortServiceDefinition, SortService, {
  //       initialSort: filteredCollectionServiceConfig.initialSort,
  //     })
  //     .addService(CatalogServiceDefinition, CatalogService, {})
  // );

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

          <CategoryPage
            productsListConfig={productsListConfig}
            productsListFiltersConfig={productsListFiltersConfig}
            categoriesListConfig={categoriesListConfig}
            currentCategorySlug={slug}
            productPageRoute=""
          />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
