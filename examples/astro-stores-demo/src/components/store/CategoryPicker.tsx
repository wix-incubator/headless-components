import { CategoryList, Category } from '@wix/headless-stores/react';
import type {
  CategoriesListServiceConfig,
  Category as CategoryType,
} from '@wix/headless-stores/services';

interface CategoryPickerProps {
  onCategorySelect: (category: CategoryType) => void;
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
          <CategoryList.CategoryRepeater>
            <Category.Trigger asChild onSelect={(category) => onCategorySelect(category)}>
                {({ category }) => (
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      currentCategorySlug === category.slug
                        ? 'text-content-primary shadow-lg transform scale-105 btn-primary'
                        : 'bg-surface-primary text-content-secondary hover:bg-brand-light hover:text-content-primary'
                    }`}
                  >
                    <Category.Label></Category.Label>
                  </button>
                )}
            </Category.Trigger>
          </CategoryList.CategoryRepeater>
        </div>
      </div>
    </CategoryList.Root>
  );
}
