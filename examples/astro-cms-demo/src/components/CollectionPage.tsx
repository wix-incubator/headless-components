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
      validValues: ['true', 'false'],
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
                <CmsCollection.Totals.Count className="font-semibold" />
              </span>
              <span className="font-paragraph text-sm">
                Showing:{' '}
                <CmsCollection.Totals.Displayed
                  displayType="displayed"
                  className="font-semibold"
                />
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
                    <CmsCollection.FilterResetTrigger
                      label="Clear"
                      className="font-paragraph text-sm text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
                    />
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
              <CmsCollection.Loading>
                <div className="flex items-center justify-center py-12">
                  <div className="font-paragraph text-foreground">
                    Loading collection...
                  </div>
                </div>
              </CmsCollection.Loading>

              {/* Error State */}
              <CmsCollection.Error>
                {({ error }) => (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-6">
                    <h3 className="font-heading mb-2 text-lg font-semibold text-destructive">
                      Error Loading Collection
                    </h3>
                    <p className="font-paragraph text-sm text-destructive/80">
                      {error}
                    </p>
                  </div>
                )}
              </CmsCollection.Error>

              {/* Items Grid */}
              <CmsCollection.Items
                emptyState={
                  <div className="rounded-lg bg-background border border-foreground/10 p-12 text-center">
                    <p className="font-paragraph text-foreground/60">
                      No items found. Try adjusting your filters.
                    </p>
                  </div>
                }
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <CmsCollection.ItemRepeater>
                    {/* Item Card */}
                    <div className="group overflow-hidden rounded-lg bg-background border border-foreground/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20 p-6 flex flex-col h-full">
                    {/* Dish Name */}
                    <CmsItem.Field fieldId="dishName" asChild>
                      {({ fieldValue, isLoading, error, ...props }, ref) => (
                        <h3
                          ref={ref as any}
                          {...props}
                          className="font-heading mb-2 text-xl font-semibold text-foreground line-clamp-2"
                        >
                          {isLoading
                            ? 'Loading...'
                            : error
                              ? 'Error'
                              : fieldValue || 'Untitled'}
                        </h3>
                      )}
                    </CmsItem.Field>

                    {/* Price */}
                    <CmsItem.Field fieldId="price" asChild>
                      {({ fieldValue, isLoading, error, ...props }, ref) => {
                        if (isLoading || error || !fieldValue) return null;
                        return (
                          <div
                            ref={ref as any}
                            {...props}
                            className="font-heading mb-3 text-2xl font-bold text-primary"
                          >
                            ${fieldValue}
                          </div>
                        );
                      }}
                    </CmsItem.Field>

                    {/* Description */}
                    <CmsItem.Field fieldId="description" asChild>
                      {({ fieldValue, isLoading, error, ...props }, ref) => (
                        <p
                          ref={ref as any}
                          {...props}
                          className="font-paragraph mb-3 text-sm text-foreground/70 line-clamp-3 flex-grow"
                        >
                          {isLoading
                            ? 'Loading...'
                            : error
                              ? ''
                              : fieldValue || 'No description available.'}
                        </p>
                      )}
                    </CmsItem.Field>

                    {/* Bottom Section - Dietary Restrictions and Availability */}
                    <div className="mt-auto space-y-3">
                      {/* Dietary Restrictions */}
                      <CmsItem.Field fieldId="dietaryRestrictions" asChild>
                        {({ fieldValue, isLoading, error, ...props }, ref) => {
                          if (isLoading || error || !fieldValue) return null;
                          const restrictions = Array.isArray(fieldValue)
                            ? fieldValue
                            : [fieldValue];
                          return (
                            <div
                              ref={ref as any}
                              {...props}
                              className="flex flex-wrap gap-2"
                            >
                              {restrictions.map((restriction: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-block rounded-full bg-primary/10 px-3 py-1 font-paragraph text-xs font-medium text-primary"
                                >
                                  {restriction}
                                </span>
                              ))}
                            </div>
                          );
                        }}
                      </CmsItem.Field>

                      {/* Availability Status */}
                      <CmsItem.Field fieldId="isAvailable" asChild>
                        {({ fieldValue, isLoading, error, ...props }, ref) => {
                          if (isLoading || error || fieldValue === undefined) return null;
                          const isAvailable = fieldValue === true || fieldValue === 'true';
                          return (
                            <div
                              ref={ref as any}
                              {...props}
                              className={`rounded-full px-3 py-1 font-paragraph text-xs font-medium text-center ${
                                isAvailable
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {isAvailable ? 'Available' : 'Unavailable'}
                            </div>
                          );
                        }}
                      </CmsItem.Field>
                    </div>

                    {/* Created Date */}
                    <CmsItem.Field fieldId="_createdDate" asChild>
                      {({ fieldValue, isLoading, error, ...props }, ref) => {
                        if (isLoading || error || !fieldValue) return null;
                        const date = new Date(fieldValue as string);
                        return (
                          <div
                            ref={ref as any}
                            {...props}
                            className="mt-4 border-t border-foreground/10 pt-3 font-paragraph text-xs text-foreground/50"
                          >
                            Created: {date.toLocaleDateString()}
                          </div>
                        );
                      }}
                    </CmsItem.Field>
                    </div>
                  </CmsCollection.ItemRepeater>
                </div>
              </CmsCollection.Items>

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <CmsCollection.PrevAction className="rounded-md bg-primary px-4 py-2 font-paragraph text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50">
                  Previous
                </CmsCollection.PrevAction>

                <div className="font-paragraph text-sm text-foreground">
                  Page{' '}
                  <CmsCollection.Totals.Displayed
                    displayType="currentPageNum"
                    className="font-semibold"
                  />{' '}
                  of{' '}
                  <CmsCollection.Totals.Displayed
                    displayType="totalPages"
                    className="font-semibold"
                  />
                </div>

                <CmsCollection.NextAction className="rounded-md bg-primary px-4 py-2 font-paragraph text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50">
                  Next
                </CmsCollection.NextAction>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
