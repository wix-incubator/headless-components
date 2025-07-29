import { CategoryPage } from '../../components/store/CategoryPage';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import { StoreLayout } from '../../layouts/StoreLayout';
import '../../styles/theme-1.css';

interface StoreCollectionPageProps {
  currentCartServiceConfig: any;
  categoryServiceConfig: any;
  categoriesListConfig: any;
  productsListConfig: any;
  productsListSearchConfig: any;
  slug: string;
}

export default function StoreCollectionPage({
  currentCartServiceConfig,
  categoriesListConfig,
  productsListConfig,
  productsListSearchConfig,
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
            currentCategorySlug={slug}
            productPageRoute=""
          />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
