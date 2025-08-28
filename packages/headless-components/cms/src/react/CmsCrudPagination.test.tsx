import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as CmsCrudPagination from './CmsCrudPagination.js';

// Mock the services manager
vi.mock('@wix/services-manager-react', () => ({
  useService: vi.fn(() => ({
    paginationSignal: { get: () => ({
      currentPage: 1,
      pageSize: 10,
      totalItems: 100,
      totalPages: 10,
      hasPrevPage: false,
      hasNextPage: true,
      loadedItems: 10,
      hasMoreItems: true,
    }) },
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    loadMore: vi.fn(),
    loadingMoreSignal: { get: () => false },
  })),
}));

describe('CmsCrudPagination Components', () => {
  it('should render without crashing', () => {
    render(
      <CmsCrudPagination.Root>
        {() => (
          <div>
            <CmsCrudPagination.NextPage>
              {() => <div>Next</div>}
            </CmsCrudPagination.NextPage>
            <CmsCrudPagination.PreviousPage>
              {() => <div>Previous</div>}
            </CmsCrudPagination.PreviousPage>
            <CmsCrudPagination.PageInfo>
              {() => <div>Page Info</div>}
            </CmsCrudPagination.PageInfo>
            <CmsCrudPagination.LoadMore>
              {() => <div>Load More</div>}
            </CmsCrudPagination.LoadMore>
          </div>
        )}
      </CmsCrudPagination.Root>
    );
  });
});
