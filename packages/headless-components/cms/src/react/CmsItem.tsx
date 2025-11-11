import React from 'react';
import * as CoreCmsItem from './core/CmsItem.js';
import { type CmsItemServiceConfig } from '../services/cms-item-service.js';

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
    /** List of field IDs for single reference fields to include */
    singleRefFieldIds?: string[];
    /** List of field IDs for multi reference fields to include */
    multiRefFieldIds?: string[];
  };
}

/**
 * Root component that provides the CMS Item service context to its children.
 * This component exposes all item service properties via render props pattern.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsItem } from '@wix/cms/components';
 *
 * // Basic usage - provides item context
 * function ItemPage() {
 *   return (
 *     <CmsItem.Root item={{ collectionId: 'MyCollection', id: 'item-123' }}>
 *       Custom rendering logic here
 *     </CmsItem.Root>
 *   );
 * }
 *
 * // With reference fields included
 * function ItemWithReferences() {
 *   return (
 *     <CmsItem.Root
 *       item={{
 *         collectionId: 'MyCollection',
 *         id: 'item-123',
 *         singleRefFieldIds: ['author', 'category'],
 *         multiRefFieldIds: ['tags', 'relatedItems']
 *       }}
 *     >
 *       Custom rendering logic here
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
      singleRefFieldIds: item.singleRefFieldIds,
      multiRefFieldIds: item.multiRefFieldIds,
    };

    const attributes = {
      'data-testid': TestIds.cmsItemRoot,
      'data-collection-id': item.collectionId,
      'data-collection-item-id': item.id,
    };

    return (
      <CoreCmsItem.Root itemServiceConfig={itemServiceConfig}>
        {() => (
          <div {...attributes} ref={ref}>
            {children}
          </div>
        )}
      </CoreCmsItem.Root>
    );
  },
);
