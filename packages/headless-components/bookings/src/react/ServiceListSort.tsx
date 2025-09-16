import React from 'react';
import { useService } from '@wix/services-manager-react';
import { ServicesListServiceDefinition } from '../services/services-list-service.js';
import { Sort as SortPrimitive } from '@wix/headless-components/react';

export interface ServiceListSortProps {
  children: (props: {
    currentSort: { fieldName: string; order: 'ASC' | 'DESC' }[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: { fieldName: string; order: 'ASC' | 'DESC' }[]) => void;
  }) => React.ReactNode;
}

export const ServiceListSort = (props: ServiceListSortProps) => {
  const servicesListService = useService(ServicesListServiceDefinition);
  const currentSort = servicesListService.sort.get();

  // Define sort options
  const sortOptions = [
    { fieldName: 'name', order: 'ASC' as const, label: 'Name (A-Z)' },
    { fieldName: 'name', order: 'DESC' as const, label: 'Name (Z-A)' },
  ];

  return props.children({
    currentSort,
    sortOptions,
    setSort: (sort: { fieldName: string; order: 'ASC' | 'DESC' }[]) => {
      servicesListService.setSort(sort);
    },
  });
};

export interface ServiceListSeparateSortProps {
  children: (props: {
    currentSort: { fieldName: string; order: 'ASC' | 'DESC' }[];
    sortFieldOptions: Array<{
      fieldName: string;
      label: string;
    }>;
    sortOrderOptions: Array<{
      order: 'ASC' | 'DESC';
      label: string;
    }>;
    setSort: (sort: { fieldName: string; order: 'ASC' | 'DESC' }[]) => void;
  }) => React.ReactNode;
}

export function ServiceListSeparateSort(props: ServiceListSeparateSortProps) {
  const servicesListService = useService(ServicesListServiceDefinition);
  const currentSort = servicesListService.sort.get();

  const sortFieldOptions = [{ fieldName: 'name', label: 'Name' }];

  const sortOrderOptions = [
    { order: 'ASC' as const, label: 'Ascending' },
    { order: 'DESC' as const, label: 'Descending' },
  ];

  return props.children({
    currentSort,
    sortFieldOptions,
    sortOrderOptions,
    setSort: (sort: { fieldName: string; order: 'ASC' | 'DESC' }[]) => {
      servicesListService.setSort(sort);
    },
  });
}
