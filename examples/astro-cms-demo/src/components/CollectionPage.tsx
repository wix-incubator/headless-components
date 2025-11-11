import React from 'react';
import { CmsCollection, CmsItem } from '@wix/headless-cms/react';
import { Filter } from '@wix/headless-components/react';
import type { FilterOption } from '@wix/headless-components/react';

interface CollectionPageProps {
  collectionId: string;
  queryResult?: any;
}

export default function CollectionPage({
  collectionId,
  queryResult,
}: CollectionPageProps) {
  // Define filter options for the collection
  const filterOptions: FilterOption[] = [
    {
      key: 'dietaryRestrictions',
      label: 'Dietary Restrictions',
      type: 'multi',
      fieldType: 'array', // REQUIRED for multi filters
      displayType: 'text',
      fieldName: 'dietaryRestrictions',
      validValues: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    },
    {
      key: 'isAvailable',
      label: 'Availability',
      type: 'single',
      displayType: 'text',
      fieldName: 'isAvailable',
      validValues: [true, false],
    },
  ];

  // Define sort options
  const sortOptions = [
    { fieldName: 'dishName', order: 'ASC' as const, label: 'Name (A-Z)' },
    { fieldName: 'dishName', order: 'DESC' as const, label: 'Name (Z-A)' },
    { fieldName: 'price', order: 'ASC' as const, label: 'Price (Low to High)' },
    { fieldName: 'price', order: 'DESC' as const, label: 'Price (High to Low)' },
    { fieldName: '_createdDate', order: 'DESC' as const, label: 'Newest First' },
    { fieldName: '_createdDate', order: 'ASC' as const, label: 'Oldest First' },
  ];

  return (
    <CmsCollection.Root
      collection={{
        id: collectionId,
        queryResult,
        queryOptions: {
          limit: 6,
          returnTotalCount: true,
        },
      }}
    >
      {({
        queryResult,
        loading,
        error,
        collectionId,
        resetFilter,
        isFiltered,
        loadItems,
      }) => {
        const items = queryResult?.items || [];
        const currentPage = queryResult?.currentPage ?? 0;
        const totalCount = queryResult?.totalCount ?? 0;
        const pageSize = queryResult?.pageSize ?? 0;
        const totalPages = queryResult?.totalPages ?? 0;
        const hasNext = queryResult?.hasNext() ?? false;
        const hasPrev = queryResult?.hasPrev() ?? false;
        const displayed =
          pageSize > 0 ? currentPage * pageSize + items.length : items.length;

        const loadNext = async () => {
          if (hasNext && queryResult) {
            await loadItems({
              skip: (currentPage + 1) * pageSize,
              limit: pageSize,
              returnTotalCount: true,
            });
          }
        };

        const loadPrev = async () => {
          if (hasPrev && queryResult) {
            await loadItems({
              skip: (currentPage - 1) * pageSize,
              limit: pageSize,
              returnTotalCount: true,
            });
          }
        };
        return (
          <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                  Menu Items
                </h1>
                <div className="flex items-center gap-4 text-foreground">
                  <span className="font-paragraph text-sm">
                    Total items:{' '}
                    <span className="font-semibold">{totalCount}</span>
                  </span>
                  <span className="font-paragraph text-sm">
                    Showing:{' '}
                    <span className="font-semibold">{displayed}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar - Filters and Sort */}
                <aside className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    {/* Sort Section */}
                    <div className="rounded-lg bg-background border border-foreground/10 p-4">
                      <h2 className="font-heading mb-3 text-lg font-semibold text-foreground">
                        Sort By
                      </h2>
                      <CmsCollection.Sort
                        as="select"
                        sortOptions={sortOptions}
                        className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 font-paragraph text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Filters Section */}
                    <div className="rounded-lg bg-background border border-foreground/10 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-heading text-lg font-semibold text-foreground">
                          Filters
                        </h2>
                        {isFiltered() && (
                          <button
                            onClick={resetFilter}
                            className="font-paragraph text-sm text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <CmsCollection.Filters
                        filterOptions={filterOptions}
                        className="space-y-4"
                      >
                        <Filter.FilterOptions>
                          <Filter.FilterOptionRepeater>
                            <div className="space-y-2">
                              <Filter.FilterOption.Label className="font-paragraph block text-sm font-medium text-foreground" />
                              <Filter.FilterOption.MultiFilter className="flex flex-wrap gap-2 [&_button]:rounded-md [&_button]:border [&_button]:border-foreground/20 [&_button]:bg-background [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm [&_button]:font-paragraph [&_button]:text-foreground [&_button]:transition-colors hover:[&_button]:bg-foreground/5 hover:[&_button]:border-foreground/30 [&_button[data-state='on']]:bg-primary [&_button[data-state='on']]:text-primary-foreground [&_button[data-state='on']]:border-primary hover:[&_button[data-state='on']]:bg-primary/90" />
                              <Filter.FilterOption.SingleFilter className="flex flex-wrap gap-2 [&_button]:rounded-md [&_button]:border [&_button]:border-foreground/20 [&_button]:bg-background [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm [&_button]:font-paragraph [&_button]:text-foreground [&_button]:transition-colors hover:[&_button]:bg-foreground/5 hover:[&_button]:border-foreground/30 [&_button[data-state='on']]:bg-primary [&_button[data-state='on']]:text-primary-foreground [&_button[data-state='on']]:border-primary hover:[&_button[data-state='on']]:bg-primary/90" />
                            </div>
                          </Filter.FilterOptionRepeater>
                        </Filter.FilterOptions>
                      </CmsCollection.Filters>
                    </div>
                  </div>
                </aside>

                {/* Main Content - Items Grid */}
                <div className="lg:col-span-3">
                  {/* Loading State */}
                  {loading && items.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                      <div className="font-paragraph text-foreground">
                        Loading collection...
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {error && items.length === 0 && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-6">
                      <h3 className="font-heading mb-2 text-lg font-semibold text-destructive">
                        Error Loading Collection
                      </h3>
                      <p className="font-paragraph text-sm text-destructive/80">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Items Grid */}
                  {items.length === 0 && !loading ? (
                    <div className="rounded-lg bg-background border border-foreground/10 p-12 text-center">
                      <p className="font-paragraph text-foreground/60">
                        No items found. Try adjusting your filters.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item: any) => (
                        <CmsItem.Root
                          key={item._id}
                          item={{
                            collectionId,
                            id: item._id,
                            item: item,
                          }}
                        >
                          {({ item: itemData, loading: itemLoading, error: itemError }) => (
                            /* Item Card */
                            <div className="group overflow-hidden rounded-lg bg-background border border-foreground/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20 p-6 flex flex-col h-full">
                              {/* Dish Name */}
                              <h3 className="font-heading mb-2 text-xl font-semibold text-foreground line-clamp-2">
                                {itemLoading
                                  ? 'Loading...'
                                  : itemError
                                    ? 'Error'
                                    : itemData?.dishName || 'Untitled'}
                              </h3>

                              {/* Price */}
                              {!itemLoading && !itemError && itemData?.price && (
                                <div className="font-heading mb-3 text-2xl font-bold text-primary">
                                  ${itemData.price}
                                </div>
                              )}

                              {/* Description */}
                              <p className="font-paragraph mb-3 text-sm text-foreground/70 line-clamp-3 flex-grow">
                                {itemLoading
                                  ? 'Loading...'
                                  : itemError
                                    ? ''
                                    : itemData?.description || 'No description available.'}
                              </p>

                              {/* Bottom Section - Dietary Restrictions and Availability */}
                              <div className="mt-auto space-y-3">
                                {/* Dietary Restrictions */}
                                {!itemLoading && !itemError && itemData?.dietaryRestrictions && (
                                  <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(itemData.dietaryRestrictions)
                                      ? itemData.dietaryRestrictions
                                      : [itemData.dietaryRestrictions]
                                    ).map((restriction: string, index: number) => (
                                      <span
                                        key={index}
                                        className="inline-block rounded-full bg-primary/10 px-3 py-1 font-paragraph text-xs font-medium text-primary"
                                      >
                                        {restriction}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Availability Status */}
                                {!itemLoading &&
                                  !itemError &&
                                  itemData?.isAvailable !== undefined && (
                                    <div
                                      className={`rounded-full px-3 py-1 font-paragraph text-xs font-medium text-center ${
                                        itemData.isAvailable === true ||
                                        itemData.isAvailable === 'true'
                                          ? 'bg-green-500/10 text-green-500'
                                          : 'bg-red-500/10 text-red-500'
                                      }`}
                                    >
                                      {itemData.isAvailable === true ||
                                      itemData.isAvailable === 'true'
                                        ? 'Available'
                                        : 'Unavailable'}
                                    </div>
                                  )}
                              </div>

                              {/* Created Date */}
                              {!itemLoading && !itemError && itemData?._createdDate && (
                                <div className="mt-4 border-t border-foreground/10 pt-3 font-paragraph text-xs text-foreground/50">
                                  Created: {new Date(itemData._createdDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </CmsItem.Root>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="mt-8 flex items-center justify-center gap-4">
                    {hasPrev && (
                      <button
                        onClick={loadPrev}
                        disabled={loading}
                        className="rounded-md bg-primary px-4 py-2 font-paragraph text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                    )}

                    <div className="font-paragraph text-sm text-foreground">
                      Page <span className="font-semibold">{currentPage + 1}</span> of{' '}
                      <span className="font-semibold">{totalPages}</span>
                    </div>

                    {hasNext && (
                      <button
                        onClick={loadNext}
                        disabled={loading}
                        className="rounded-md bg-primary px-4 py-2 font-paragraph text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </CmsCollection.Root>
  );
}
