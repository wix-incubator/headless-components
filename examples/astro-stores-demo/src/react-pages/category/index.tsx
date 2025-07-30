import type {
  CategoriesListServiceConfig,
  CategoryServiceConfig,
  ProductsListSearchServiceConfig,
  ProductsListServiceConfig,
} from '@wix/headless-stores/services';
import { CategoryPage } from '../../components/store/CategoryPage';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import { StoreLayout } from '../../layouts/StoreLayout';
import '../../styles/theme-1.css';
import type { CurrentCartServiceConfig } from '@wix/headless-ecom/services';

interface StoreCollectionPageProps {
  currentCartServiceConfig: CurrentCartServiceConfig;
  categoryServiceConfig: CategoryServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  productsListConfig: ProductsListServiceConfig;
  productsListSearchConfig: ProductsListSearchServiceConfig;
}

export default function StoreCollectionPage({
  currentCartServiceConfig,
  categoriesListConfig,
  productsListConfig,
  productsListSearchConfig,
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

          <CategoryPage
            productsListConfig={productsListConfig}
            productsListSearchConfig={productsListSearchConfig}
            categoriesListConfig={categoriesListConfig}
            productPageRoute=""
          />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
