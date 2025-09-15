import { useService } from '@wix/services-manager-react';
import type { ServiceAPI } from '@wix/services-definitions';
import { CmsCollectionServiceDefinition, type SortValue } from '../../services/cms-collection-service.js';
import { Sort as SortPrimitive } from '@wix/headless-components/react';

export interface CmsCollectionSortProps {
  children: (props: {
    currentSort: SortValue;
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: SortValue) => void;
  }) => React.ReactNode;
}

export const CmsCollectionSort = (props: CmsCollectionSortProps) => {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const currentSort = service.sortSignal.get();

  // TODO: what options should we support? should we receive them from the parent? or should we limit and define them here?
  // Define CMS-specific sort options - primitive handles all conversion logic
  const sortOptions: SortPrimitive.SortOption[] = [
    { fieldName: 'title', order: 'ASC', label: 'Title (A-Z)' },
    { fieldName: 'title', order: 'DESC', label: 'Title (Z-A)' },
    { fieldName: '_createdDate', order: 'DESC', label: 'Newest First' },
    { fieldName: '_createdDate', order: 'ASC', label: 'Oldest First' },
    { fieldName: '_updatedDate', order: 'DESC', label: 'Recently Modified' },
    { fieldName: '_updatedDate', order: 'ASC', label: 'Least Recently Modified' },
  ];

  return props.children({
    currentSort,
    sortOptions,
    setSort: (sort: SortValue) => {
      service.setSort(sort);
    },
  });
};

export interface CmsCollectionSeparateSortProps {
  children: (props: {
    currentSort: SortValue;
    sortFieldOptions: SortPrimitive.SortOption[];
    sortOrderOptions: SortPrimitive.SortOption[];
    setSort: (sort: SortValue) => void;
  }) => React.ReactNode;
}

export function CmsCollectionSeparateSort(props: CmsCollectionSeparateSortProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const currentSort = service.sortSignal.get();

  // Define separate field and order options for more granular control
  const sortFieldOptions: SortPrimitive.SortOption[] = [
    { fieldName: 'title', label: 'Title' },
    { fieldName: '_createdDate', label: 'Date Created' },
    { fieldName: '_updatedDate', label: 'Date Modified' },
  ];

  const sortOrderOptions: SortPrimitive.SortOption[] = [
    { order: 'ASC', label: 'Ascending' },
    { order: 'DESC', label: 'Descending' },
  ];

  return props.children({
    currentSort,
    sortFieldOptions,
    sortOrderOptions,
    setSort: (sort: SortValue) => {
      service.setSort(sort);
    },
  });
}
