import { useService } from '@wix/services-manager-react';
import {
  EventListServiceDefinition,
  type Category,
} from '../../services/event-list-service.js';
import { type FilterOption } from '@wix/headless-components/react';

export interface CategoriesFilterRootProps {
  /** Render prop function */
  children: (props: CategoriesFilterRootRenderProps) => React.ReactNode;
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
}

/**
 * EventList Events core component that provides event list data.
 *
 * @component
 */
export function CategoriesFilterRoot(
  props: CategoriesFilterRootProps,
): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);
  const categories = eventListService.categories.get();

  return props.children({
    filterOptions: buildFilterOptions(categories),
    categories,
    selectedCategory: eventListService.selectedCategory.get(),
    setSelectedCategory: eventListService.setSelectedCategory,
  });
}

const buildFilterOptions = (categories: Category[]) => [
  {
    key: 'categories',
    label: '',
    type: 'single' as const,
    displayType: 'text' as const,
    fieldName: 'category.id',
    validValues: ['All', ...categories.map((category) => category._id!)],
    valueFormatter: (value: string | number) =>
      categories.find((category) => category._id === value)?.name || 'All',
  },
];
