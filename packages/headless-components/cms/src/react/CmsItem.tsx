import React from 'react';
import * as CoreCmsItem from './core/CmsItem.js';
import {
  type CmsItemServiceConfig,
} from '../services/cms-item-service.js';
import { AsChildSlot } from '@wix/headless-utils/react';

enum TestIds {
  cmsItemRoot = 'collection-item',
}

/**
 * Props for CmsItem.Root component
 */
export interface RootProps {
  children: React.ReactNode;
  item: {
    collectionId: string;
    id: string;
    item?: any;
  };
}

/**
 * Root component that provides the CMS Item service context to its children.
 * This component sets up the necessary services for rendering and managing individual item data.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsItem } from '@wix/cms/components';
 *
 * function ItemPage() {
 *   return (
 *     <CmsItem.Root item={{ collectionId: 'MyCollection', id: 'item-123' }}>
 *       <CmsItem.Field fieldId="title" />
 *       <CmsItem.Field fieldId="image" />
 *       <CmsItem.Field fieldId="price" />
 *     </CmsItem.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, item } = props;

    const itemServiceConfig: CmsItemServiceConfig = {
      collectionId: item.collectionId,
      itemId: item.id,
      item: item.item,
    };

    const attributes = {
      'data-testid': TestIds.cmsItemRoot,
      'data-collection-item-id': item.id,
    };

    return (
      <CoreCmsItem.Root itemServiceConfig={itemServiceConfig}>
        <div {...attributes} ref={ref}>
          {children}
        </div>
      </CoreCmsItem.Root>
    );
  },
);

export interface FieldProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: React.ForwardRefRenderFunction<HTMLElement, FieldRenderProps>;
  /** ID of the field to extract from the item */
  fieldId: string;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface FieldRenderProps {
  /** The raw field value */
  fieldValue: any;
  /** Data attribute for testing */
  'data-testid'?: string;
  /** Data attribute for field identification */
  'data-collection-item-field'?: string;
}

/**
 * Displays a CMS item field with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Simple text field
 * <CmsItem.Field fieldId="title" asChild>
 *   {({ fieldValue, ...props }, ref) => (
 *     <h1 ref={ref} {...props} className="text-4xl font-bold">
 *       {fieldValue}
 *     </h1>
 *   )}
 * </CmsItem.Field>
 *
 * // Image field
 * <CmsItem.Field fieldId="heroImage" asChild>
 *   {({ fieldValue, ...props }, ref) => (
 *     <img
 *       ref={ref}
 *       {...props}
 *       src={fieldValue?.url}
 *       alt={fieldValue?.alt}
 *       className="w-full h-auto rounded-lg"
 *     />
 *   )}
 * </CmsItem.Field>
 *
 * // Complex field with custom logic
 * <CmsItem.Field fieldId="rating" asChild>
 *   {({ fieldValue, ...props }, ref) => (
 *     <div ref={ref} {...props} className="flex items-center gap-1">
 *       <StarRating value={fieldValue?.rating} />
 *       <span className="text-sm text-content-secondary">
 *         ({fieldValue?.rating}/5)
 *       </span>
 *     </div>
 *   )}
 * </CmsItem.Field>
 * ```
 */
export const Field = React.forwardRef<HTMLElement, FieldProps>((props, ref) => {
  const { asChild, children, fieldId, className, ...otherProps } = props;

  return (
    <CoreCmsItem.Field fieldId={fieldId}>
      {({ fieldValue }) => {
        const dataAttributes = {
          'data-testid': fieldId,
          'data-collection-item-field': fieldId,
        };

        // If no children provided and not asChild, render nothing (similar to Product.Raw)
        if (!asChild || !children) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            {...dataAttributes}
            customElement={children}
            customElementProps={{
              fieldValue,
              ...dataAttributes,
            }}
            {...otherProps}
          />
        );
      }}
    </CoreCmsItem.Field>
  );
});
