import { useService } from '@wix/services-manager-react';
import {
  EventListServiceDefinition,
  type Category,
} from '../../services/event-list-service.js';
import {
  type FilterOption,
  Filter as FilterPrimitive,
} from '@wix/headless-components/react';
import { ALL_CATEGORIES, CATEGORIES_FILTER_KEY } from '../../constants.js';

export interface CategoriesFilterRootProps {
  /** Render prop function */
  children: (props: CategoriesFilterRootRenderProps) => React.ReactNode;
  /** All categories label*/
  allCategoriesLabel: string;
}

export interface CategoriesFilterRootRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  filterValue: FilterPrimitive.Filter;
  /** Function to load events by category */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

/**
 * EventList Filters core component that provides event list filters data.
 *
 * @component
 */
export function CategoriesFilterRoot(
  props: CategoriesFilterRootProps,
): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);
  const categories = eventListService.categories.get();
  const selectedCategory = eventListService.selectedCategory.get();
  const setSelectedCategory = eventListService.setSelectedCategory;
  const loadEventsByCategory = eventListService.loadEventsByCategory;

  if (!categories.length) {
    return null;
  }

  const handleCategoryChange = async (value: FilterPrimitive.Filter) => {
    const categoryId = value?.['categoryId'];
    if (!categoryId || categoryId === ALL_CATEGORIES) {
      setSelectedCategory(null);
      await loadEventsByCategory(null);
      return;
    }

    const category = categories.find((cat) => cat._id === categoryId) ?? null;
    setSelectedCategory(category);
    await loadEventsByCategory(categoryId);
  };

  const selectedCategoryId = selectedCategory?._id || ALL_CATEGORIES;

  const { filterOptions, filterValue } = buildFilterProps(
    categories,
    props.allCategoriesLabel,
    selectedCategoryId,
  );

  return props.children({
    filterOptions,
    filterValue,
    onChange: handleCategoryChange,
  });
}

const buildFilterProps = (
  categories: Category[],
  allCategoriesLabel: string,
  selectedCategoryId: string,
) => {
  const filterBase = {
    key: CATEGORIES_FILTER_KEY,
    label: '',
    type: 'single' as const,
    displayType: 'text' as const,
    fieldName: 'categoryId',
  };

  const filterOptions = [
    {
      ...filterBase,
      validValues: [
        ALL_CATEGORIES,
        ...categories.map((category) => category._id!),
      ],
      valueFormatter: (value: string | number) =>
        categories.find((category) => category._id === value)?.name ||
        allCategoriesLabel,
    },
  ];

  const filterValue = {
    ...filterBase,
    categoryId: selectedCategoryId,
  };

  return { filterOptions, filterValue };
};
