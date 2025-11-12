import React, { useState } from 'react';
import { Filter, type FilterValue } from '@wix/headless-components/react';
import './MyFilter.css';

/**
 * Custom Filter component demonstrating the Filter primitive with custom options
 */
export function MyFilter() {
  const [filterValue, setFilterValue] = useState<FilterValue>(null);
  const [showExamples, setShowExamples] = useState(false);

  // Define filter options
  const filterOptions = [
    {
      key: 'category',
      label: 'Category',
      type: 'single' as const,
      displayType: 'text' as const,
      fieldName: 'category',
      validValues: ['Electronics', 'Clothing', 'Books', 'Home'],
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'multi' as const,
      displayType: 'text' as const,
      fieldName: 'tags',
      fieldType: 'singular' as const,
      validValues: ['New', 'Sale', 'Featured', 'Popular'],
    },
    {
      key: 'colors',
      label: 'Colors',
      type: 'multi' as const,
      displayType: 'color' as const,
      fieldName: 'color',
      fieldType: 'singular' as const,
      validValues: ['red', 'blue', 'green', 'yellow'],
      valueFormatter: (value: string | number) => String(value).toUpperCase(),
      valueBgColorFormatter: (value: string | number) => {
        const colorMap: Record<string, string> = {
          red: '#ef4444',
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
        };
        return colorMap[String(value).toLowerCase()] || null;
      },
    },
  ];

  return (
    <div className="my-container">
      {/* Toggle button */}
      <div className="toggle-section">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="toggle-button"
        >
          {showExamples ? 'Hide Filter Examples' : 'Show Filter Examples'}
        </button>
      </div>

      {showExamples && (
        <>
          <h2 className="font-heading text-foreground">Filter Component Demo</h2>

          {/* Display current filter value */}
          <div className="current-filter">
            <p className="font-paragraph text-secondary-foreground">
              Current Filter:{' '}
              <strong>
                {filterValue
                  ? JSON.stringify(filterValue, null, 2)
                  : 'No filters applied'}
              </strong>
            </p>
          </div>

          {/* Clear filters button */}
          <Filter.Root
            value={filterValue}
            onChange={setFilterValue}
            filterOptions={filterOptions}
          >
            <Filter.Filtered>
              <div className="filter-actions">
                <Filter.Action.Clear label="Clear All Filters" />
              </div>
            </Filter.Filtered>

            {/* Example 1: Single Filter */}
            <div className="filter-example">
              <h3 className="font-heading text-foreground">Single Filter</h3>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.FilterOption.Label className="filter-label" />
                  <Filter.FilterOption.SingleFilter className="filter-single" />
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </div>

            {/* Example 2: Multi Filter (Text) */}
            <div className="filter-example">
              <h3 className="font-heading text-foreground">Multi Filter (Text)</h3>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.FilterOption.Label className="filter-label" />
                  <Filter.FilterOption.MultiFilter className="filter-multi" />
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </div>

            {/* Example 3: Multi Filter (Color) */}
            <div className="filter-example">
              <h3 className="font-heading text-foreground">Multi Filter (Color)</h3>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.FilterOption.Label className="filter-label" />
                  <Filter.FilterOption.MultiFilter className="filter-multi-color" />
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </div>

            {/* Example 4: Custom Styled Filters */}
            <div className="filter-example">
              <h3 className="font-heading text-foreground">
                Custom Styled Filters
              </h3>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.FilterOption.Label
                    className="filter-label"
                    asChild
                  >
                    <h4 className="custom-filter-label" />
                  </Filter.FilterOption.Label>
                  <Filter.FilterOption.MultiFilter
                    className="custom-filter-multi"
                    asChild
                  >
                    {({ values, onChange, validValues, valueFormatter }) => (
                      <div className="custom-filter-grid">
                        {validValues?.map((value) => {
                          const stringValue = String(value);
                          const isSelected = values.includes(stringValue);
                          const displayValue = valueFormatter
                            ? valueFormatter(value as any)
                            : stringValue;
                          return (
                            <button
                              key={stringValue}
                              onClick={() => {
                                const newValues = isSelected
                                  ? values.filter((v) => v !== stringValue)
                                  : [...values, stringValue];
                                onChange(newValues);
                              }}
                              className={`custom-filter-button ${
                                isSelected ? 'selected' : ''
                              }`}
                            >
                              {displayValue}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </Filter.FilterOption.MultiFilter>
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </div>
          </Filter.Root>
        </>
      )}
    </div>
  );
}

export default MyFilter;

