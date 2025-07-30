import { CategoryList } from '@wix/headless-stores/react';
import type {
  CategoriesListServiceConfig,
  Category,
} from '@wix/headless-stores/services';
import { Category as CategoryComponent } from '@wix/headless-stores/react';
import { useService } from '@wix/services-manager-react';
import { ProductsListSearchServiceDefinition } from '@wix/headless-stores/services';

interface CategoryPickerProps {
  onCategorySelect: (category: Category) => void;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
}

export function CategoryPicker({
  onCategorySelect,
  categoriesListConfig,
  currentCategorySlug,
}: CategoryPickerProps) {
  return (
    <CategoryList.Root categoriesListConfig={categoriesListConfig}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
            Shop by Category
          </h3>
        </div>

        {/* Category Navigation - Horizontal scrollable for mobile */}
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
          <CategoryList.ItemContent>
            {({ category }) => (
              <CategoryComponent.Slug>
                {({ slug }) => (
                  <button
                    onClick={() => onCategorySelect(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      currentCategorySlug === slug
                        ? 'text-content-primary shadow-lg transform scale-105 btn-primary'
                        : 'bg-surface-primary text-content-secondary hover:bg-brand-light hover:text-content-primary'
                    }`}
                  >
                    <CategoryComponent.Name>
                      {({ name }) => name}
                    </CategoryComponent.Name>
                  </button>
                )}
              </CategoryComponent.Slug>
            )}
          </CategoryList.ItemContent>
        </div>
      </div>
    </CategoryList.Root>
  );
}
