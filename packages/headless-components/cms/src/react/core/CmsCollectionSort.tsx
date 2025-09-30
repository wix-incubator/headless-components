import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { CmsCollectionServiceDefinition } from '../../services/cms-collection-service.js';
import type { SortValue } from '@wix/headless-components/react';

/**
 * Props for CmsCollectionSort headless component
 */
export interface CmsCollectionSortProps {
  /** Render prop function that receives sort controls */
  children: (props: CmsCollectionSortRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollectionSort component
 */
export interface CmsCollectionSortRenderProps {
  /** Current sort value */
  currentSort: SortValue;
  /** Function to update the sort */
  setSort: (sort: SortValue) => void;
}

/**
 * Core headless component for CMS collection sorting
 */
export function CmsCollectionSort(props: CmsCollectionSortProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const currentSort = service.sortSignal.get();
  const setSort = service.setSort;

  return props.children({
    currentSort,
    setSort,
  });
}
