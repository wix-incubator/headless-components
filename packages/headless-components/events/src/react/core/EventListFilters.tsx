import { useService } from '@wix/services-manager-react';
import {
  type FilterOption,
  Filter as FilterPrimitive,
} from '@wix/headless-components/react';
import {
  type Category,
  EventListServiceDefinition,
} from '../../services/event-list-service.js';
import { ALL_CATEGORIES, CATEGORIES_FILTER_KEY } from '../../constants.js';

export interface RootProps {
  /** Render prop function */
  children: (props: RootRenderProps) => React.ReactNode;
  /** All categories label*/
  allCategoriesLabel: string;
}

export interface RootRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  value: FilterPrimitive.Filter;
  /** Function to handle category change */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

/**
 * EventList Filters core component that provides event list filters data.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);
  const categories = eventListService.categories.get();
  const selectedCategoryId =
    eventListService.selectedCategoryId.get() || ALL_CATEGORIES;

  if (!categories.length) {
    return null;
  }

  const handleCategoryChange = async (value: FilterPrimitive.Filter) => {
    const categoryId = value?.['categoryId'];

    await eventListService.loadEvents(
      categoryId === ALL_CATEGORIES ? null : categoryId,
    );
  };

  const { filterOptions, value } = buildFilterProps(
    categories,
    props.allCategoriesLabel,
    selectedCategoryId,
  );

  return props.children({
    filterOptions,
    value,
    onChange: handleCategoryChange,
  });
}

const buildFilterProps = (
  categories: Category[],
  allCategoriesLabel: string,
  selectedCategoryId: string,
) => {
  const FILTER_BASE = {
    key: CATEGORIES_FILTER_KEY,
    label: '',
    type: 'single' as const,
    displayType: 'text' as const,
    fieldName: 'categoryId',
  };

  const filterOptions = [
    {
      ...FILTER_BASE,
      validValues: [
        ALL_CATEGORIES,
        ...categories.map((category) => category._id!),
      ],
      valueFormatter: (value: string | number) =>
        value === ALL_CATEGORIES
          ? allCategoriesLabel
          : categories.find((category) => category._id === value)!.name!,
    },
  ];

  const value = {
    ...FILTER_BASE,
    categoryId: selectedCategoryId,
  };

  return { filterOptions, value };
};
