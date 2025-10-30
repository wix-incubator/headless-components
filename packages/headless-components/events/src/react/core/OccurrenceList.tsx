import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  OccurrenceListService,
  OccurrenceListServiceDefinition,
  type OccurrenceListServiceConfig,
} from '../../services/occurrence-list-service.js';
import { type Event } from '../../services/event-service.js';

export interface RootProps {
  /** Child components that will have access to the occurrence list service */
  children: React.ReactNode;
  /** Configuration for the occurrence list service */
  occurrenceListServiceConfig: OccurrenceListServiceConfig;
}

/**
 * OccurrenceList Root core component that provides occurrence list service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, occurrenceListServiceConfig } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        OccurrenceListServiceDefinition,
        OccurrenceListService,
        occurrenceListServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface OccurrencesProps {
  /** Render prop function */
  children: (props: OccurrencesRenderProps) => React.ReactNode;
}

export interface OccurrencesRenderProps {
  /** List of occurrences */
  occurrences: Event[];
  /** Indicates whether there are any occurrences in the list */
  hasOccurrences: boolean;
}

/**
 * OccurrenceList Occurrences core component that provides occurrence list data.
 *
 * @component
 */
export function Occurrences(props: OccurrencesProps): React.ReactNode {
  const occurrenceListService = useService(OccurrenceListServiceDefinition);

  const occurrences = occurrenceListService.occurrences.get();
  const hasOccurrences = !!occurrences.length;

  return props.children({ occurrences, hasOccurrences });
}

export interface OccurrenceRepeaterProps {
  /** Render prop function */
  children: (props: OccurrenceRepeaterRenderProps) => React.ReactNode;
}

export interface OccurrenceRepeaterRenderProps {
  /** List of occurrences */
  occurrences: Event[];
}

/**
 * OccurrenceList OccurrenceRepeater core component that provides occurrence list. Not rendered if there are no occurrences.
 *
 * @component
 */
export function OccurrenceRepeater(
  props: OccurrenceRepeaterProps,
): React.ReactNode {
  const occurrenceListService = useService(OccurrenceListServiceDefinition);

  const occurrences = occurrenceListService.occurrences.get();
  const hasOccurrences = !!occurrences.length;

  if (!hasOccurrences) {
    return null;
  }

  return props.children({ occurrences });
}

export interface LoadMoreTriggerProps {
  /** Render prop function */
  children: (props: LoadMoreTriggerRenderProps) => React.ReactNode;
}

export interface LoadMoreTriggerRenderProps {
  /** Indicates whether more occurrences are currently being loaded */
  isLoading: boolean;
  /** Function to load more occurrences */
  loadMoreOccurrences: () => void;
}

/**
 * OccurrenceList LoadMoreTrigger core component that provides load more trigger data.
 *
 * @component
 */
export function LoadMoreTrigger(props: LoadMoreTriggerProps): React.ReactNode {
  const occurrenceListService = useService(OccurrenceListServiceDefinition);

  const isLoading = occurrenceListService.isLoadingMore.get();
  const hasMoreOccurrences = occurrenceListService.hasMoreOccurrences.get();

  if (!hasMoreOccurrences) {
    return null;
  }

  return props.children({
    isLoading,
    loadMoreOccurrences: occurrenceListService.loadMoreOccurrences,
  });
}

export interface ErrorProps {
  /** Render prop function */
  children: (props: ErrorRenderProps) => React.ReactNode;
}

export interface ErrorRenderProps {
  /** Occurrence list error message */
  error: string;
}

/**
 * OccurrenceList Error core component that provides occurrence list error. Not rendered if there is no error.
 *
 * @component
 */
export function Error(props: ErrorProps): React.ReactNode {
  const occurrenceListService = useService(OccurrenceListServiceDefinition);

  const error = occurrenceListService.error.get();

  if (!error) {
    return null;
  }

  return props.children({ error });
}
