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
  CollectionService,
  CollectionServiceDefinition,
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
  currentCartServiceConfig,
}: StoreCollectionPageProps) {
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

          <ProductList productPageRoute="" />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
