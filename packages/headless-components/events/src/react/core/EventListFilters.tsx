import { useService } from '@wix/services-manager-react';
import {
  EventListServiceDefinition,
  type Category,
} from '../../services/event-list-service.js';
import { type FilterOption } from '@wix/headless-components/react';
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
  /** All available categories */
  categories: Category[];
  /** Selected category */
  selectedCategory: Category | null;
  /** Function to set the selected category */
  setSelectedCategory: (category: Category | null) => void;
  /** Function to load events by category */
  loadEventsByCategory: (categoryId: string) => Promise<void>;
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

  if (!categories.length) {
    return null;
  }

  return props.children({
    filterOptions: buildFilterOptions(categories, props.allCategoriesLabel),
    categories,
    selectedCategory: eventListService.selectedCategory.get(),
    setSelectedCategory: eventListService.setSelectedCategory,
    loadEventsByCategory: eventListService.loadEventsByCategory,
  });
}

const buildFilterOptions = (
  categories: Category[],
  allCategoriesLabel: string,
) => [
  {
    key: CATEGORIES_FILTER_KEY,
    label: '',
    type: 'single' as const,
    displayType: 'text' as const,
    fieldName: 'categoryId',
    validValues: [
      ALL_CATEGORIES,
      ...categories.map((category) => category._id!),
    ],
    valueFormatter: (value: string | number) =>
      categories.find((category) => category._id === value)?.name ||
      allCategoriesLabel,
  },
];
