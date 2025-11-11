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
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Menu Items
            </h1>

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
                          <Filter.FilterOption.MultiFilter className="flex flex-wrap gap-2 [&_button]:rounded-md [&_button]:border [&_button]:border-foreground/20 [&_button]:bg-background [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm [&_button]:font-paragraph [&_button]:text-foreground [&_button]:transition-colors hover:[&_button]:bg-foreground/5 hover:[&_button]:border-foreground/30 [&_button[data-state='on']]:bg-primary [&_button[data-state='on']]:text-primary-foreground [&_button[data-state='on']]:border-primary hover:[&_button[data-state='on']]:bg-primary/90" /> <Filter.FilterOption.SingleFilter className="flex flex-wrap gap-2 [&_button]:rounded-md [&_button]:border [&_button]:border-foreground/20 [&_button]:bg-background [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm [&_button]:font-paragraph [&_button]:text-foreground [&_button]:transition-colors hover:[&_button]:bg-foreground/5 hover:[&_button]:border-foreground/30 [&_button[data-state='on']]:bg-primary [&_button[data-state='on']]:text-primary-foreground [&_button[data-state='on']]:border-primary hover:[&_button[data-state='on']]:bg-primary/90" />
                          { <Filter.FilterOption.MultiFilter asChild>
                            {({ value, onChange, validValues, valueFormatter }) => (
                              <div className="flex flex-wrap gap-2">
                                {validValues?.map((option) => (
                                  <button key={String(option)} onClick={() => onChange([...value, String(option)])} className={value.includes(String(option)) ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}>
                                    {valueFormatter ? valueFormatter(String(option)) : String(option)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </Filter.FilterOption.MultiFilter> }
                          <Filter.FilterOption.SingleFilter asChild>
                            {({ value, onChange, validValues, valueFormatter }) => (
                              <div className="flex flex-wrap gap-2">
                                {validValues?.map((option) => (
                                  <button key={String(option)} onClick={() => onChange(String(option))} className={value === String(option) ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}>
                                    {valueFormatter ? valueFormatter(String(option)) : String(option)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </Filter.FilterOption.SingleFilter>
                        </div>
                      </Filter.FilterOptionRepeater>
                    </Filter.FilterOptions>
                  </CmsCollection.Filters>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
