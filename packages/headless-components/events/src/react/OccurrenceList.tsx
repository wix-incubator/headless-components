import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type OccurrenceListServiceConfig } from '../services/occurrence-list-service.js';
import * as CoreOccurrenceList from './core/OccurrenceList.js';
import * as Event from './Event.js';

enum TestIds {
  occurrenceListOccurrences = 'occurrence-list-occurrences',
  occurrenceListLoadMore = 'occurrence-list-load-more',
  occurrenceListError = 'occurrence-list-error',
}

/**
 * Props for the OccurrenceList Root component.
 */
export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Configuration for the occurrence list service */
  occurrenceListServiceConfig?: OccurrenceListServiceConfig;
}

/**
 * Root container that provides occurrence list service context to all child components.
 * Must be used as the top-level component for occurrence list functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { OccurrenceList } from '@wix/events/components';
 *
 * function OccurrenceListPage({ occurrenceListServiceConfig }) {
 *   return (
 *     <OccurrenceList.Root occurrenceListServiceConfig={occurrenceListServiceConfig}>
 *       <OccurrenceList.Occurrences>
 *         <OccurrenceList.OccurrenceRepeater>
 *           <Event.Image />
 *           <Event.Title />
 *           <Event.Date />
 *           <Event.Location />
 *           <Event.Description />
 *           <Event.RsvpButton label="RSVP" />
 *         </OccurrenceList.OccurrenceRepeater>
 *       </OccurrenceList.Occurrences>
 *     </OccurrenceList.Root>
 *   );
 * }
 * ```
 */
export const Root = (props: RootProps): React.ReactNode => {
  const { children, occurrenceListServiceConfig } = props;

  return (
    <CoreOccurrenceList.Root
      occurrenceListServiceConfig={occurrenceListServiceConfig}
    >
      {children}
    </CoreOccurrenceList.Root>
  );
};

/**
 * Props for the OccurrenceList Occurrences component.
 */
export interface OccurrencesProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{ occurrences: Event[]; hasOccurrences: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the occurrence list.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <OccurrenceList.Occurrences>
 *   <OccurrenceList.OccurrenceRepeater>
 *     <Event.Image />
 *     <Event.Title />
 *   </OccurrenceList.OccurrenceRepeater>
 * </OccurrenceList.Occurrences>
 * ```
 */
export const Occurrences = React.forwardRef<HTMLElement, OccurrencesProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOccurrenceList.Occurrences>
        {({ occurrences, hasOccurrences }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.occurrenceListOccurrences}
            customElement={children}
            customElementProps={{ occurrences, hasOccurrences }}
            {...otherProps}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
        )}
      </CoreOccurrenceList.Occurrences>
    );
  },
);

/**
 * Props for the OccurrenceList OccurrenceRepeater component.
 */
export interface OccurrenceRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the event element */
  className?: string;
}

/**
 * Repeater component that renders Event.Root for each occurrence.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <OccurrenceList.OccurrenceRepeater>
 *   <Event.Image />
 *   <Event.Title />
 * </OccurrenceList.OccurrenceRepeater>
 * ```
 */
export const OccurrenceRepeater = (
  props: OccurrenceRepeaterProps,
): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreOccurrenceList.OccurrenceRepeater>
      {({ occurrences }) =>
        occurrences.map((occurrence) => (
          <Event.Root
            key={occurrence._id}
            event={occurrence}
            className={className}
          >
            {children}
          </Event.Root>
        ))
      }
    </CoreOccurrenceList.OccurrenceRepeater>
  );
};

/**
 * Props for the OccurrenceList LoadMoreTrigger component.
 */
export interface LoadMoreTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    isLoading: boolean;
    loadMoreOccurrences: () => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: string;
  /** The loading state to display inside the button */
  loadingState?: React.ReactNode;
}

/**
 * Displays a button to load more occurrences. Not rendered if no occurrences are left to load.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <OccurrenceList.LoadMoreTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Load More" loadingState="Loading..." />
 *
 * // asChild with primitive
 * <OccurrenceList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   <button>Load More</button>
 * </OccurrenceList.LoadMoreTrigger>
 *
 * // asChild with react component
 * <OccurrenceList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   {React.forwardRef(({ isLoading, loadMoreOccurrences, ...props }, ref) => (
 *     <button ref={ref} {...props}>
 *       {isLoading ? 'Loading...' : 'Load More'}
 *     </button>
 *   ))}
 * </OccurrenceList.LoadMoreTrigger>
 * ```
 */
export const LoadMoreTrigger = React.forwardRef<
  HTMLElement,
  LoadMoreTriggerProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    label,
    loadingState = label,
    ...otherProps
  } = props;

  return (
    <CoreOccurrenceList.LoadMoreTrigger>
      {({ isLoading, loadMoreOccurrences }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.occurrenceListLoadMore}
          customElement={children}
          customElementProps={{ isLoading, loadMoreOccurrences }}
          disabled={isLoading}
          onClick={loadMoreOccurrences}
          {...otherProps}
        >
          <button>{isLoading ? loadingState : label}</button>
        </AsChildSlot>
      )}
    </CoreOccurrenceList.LoadMoreTrigger>
  );
});

/**
 * Props for the OccurrenceList Error component.
 */
export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ error: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays an error message when the occurrence list fails to load.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <OccurrenceList.Error className="text-red-500" />
 *
 * // asChild with primitive
 * <OccurrenceList.Error asChild className="text-red-500">
 *   <span />
 * </OccurrenceList.Error>
 *
 * // asChild with react component
 * <OccurrenceList.Error asChild className="text-red-500">
 *   {React.forwardRef(({ error, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {error}
 *     </span>
 *   ))}
 * </OccurrenceList.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOccurrenceList.Error>
      {({ error }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.occurrenceListError}
          customElement={children}
          customElementProps={{ error }}
          content={error}
          {...otherProps}
        >
          <span>{error}</span>
        </AsChildSlot>
      )}
    </CoreOccurrenceList.Error>
  );
});
