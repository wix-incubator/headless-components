import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Filter, type FilterValue } from '@wix/headless-components/react';
import './MyFilter.css';

const meta: Meta<typeof Filter.Root> = {
  title: 'Components/Filter',
  component: Filter.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Filter.Root>;

// Define filter options used across all stories
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

/**
 * Single selection filter component.
 * Allows users to select one value from a list of options.
 */
export const SingleFilter: Story = {
  render: () => {
    const [filterValue, setFilterValue] = useState<FilterValue>(null);

    return (
      <div className="filter-example">
        <h3 className="font-heading text-foreground mb-4">Single Filter</h3>
        <div className="current-filter mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Filter:{' '}
            <strong>
              {filterValue
                ? JSON.stringify(filterValue, null, 2)
                : 'No filters applied'}
            </strong>
          </p>
        </div>
        <Filter.Root
          value={filterValue}
          onChange={setFilterValue}
          filterOptions={filterOptions}
        >
          <Filter.FilterOptions>
            <Filter.FilterOptionRepeater>
              <Filter.FilterOption.Label className="filter-label" />
              <Filter.FilterOption.SingleFilter className="filter-single" />
            </Filter.FilterOptionRepeater>
          </Filter.FilterOptions>
        </Filter.Root>
      </div>
    );
  },
};

/**
 * Multi-selection filter component with text options.
 * Allows users to select multiple values from a list of text options.
 */
export const MultiFilterText: Story = {
  render: () => {
    const [filterValue, setFilterValue] = useState<FilterValue>(null);

    return (
      <div className="filter-example">
        <h3 className="font-heading text-foreground mb-4">
          Multi Filter (Text)
        </h3>
        <div className="current-filter mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Filter:{' '}
            <strong>
              {filterValue
                ? JSON.stringify(filterValue, null, 2)
                : 'No filters applied'}
            </strong>
          </p>
        </div>
        <Filter.Root
          value={filterValue}
          onChange={setFilterValue}
          filterOptions={filterOptions}
        >
          <Filter.FilterOptions>
            <Filter.FilterOptionRepeater>
              <Filter.FilterOption.Label className="filter-label" />
              <Filter.FilterOption.MultiFilter className="filter-multi" />
            </Filter.FilterOptionRepeater>
          </Filter.FilterOptions>
        </Filter.Root>
      </div>
    );
  },
};

/**
 * Multi-selection filter component with color swatches.
 * Demonstrates color-based filtering with visual color indicators..
 */
export const MultiFilterColor: Story = {
  render: () => {
    const [filterValue, setFilterValue] = useState<FilterValue>(null);

    return (
      <div className="filter-example">
        <h3 className="font-heading text-foreground mb-4">
          Multi Filter (Color)
        </h3>
        <div className="current-filter mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Filter:{' '}
            <strong>
              {filterValue
                ? JSON.stringify(filterValue, null, 2)
                : 'No filters applied'}
            </strong>
          </p>
        </div>
        <Filter.Root
          value={filterValue}
          onChange={setFilterValue}
          filterOptions={filterOptions}
        >
          <Filter.FilterOptions>
            <Filter.FilterOptionRepeater>
              <Filter.FilterOption.Label className="filter-label" />
              <Filter.FilterOption.MultiFilter className="filter-multi-color" />
            </Filter.FilterOptionRepeater>
          </Filter.FilterOptions>
        </Filter.Root>
      </div>
    );
  },
};



/**
 * Custom styled filter component.
 * Demonstrates how to fully customize the appearance of filter options using the asChild pattern.
 */
export const CustomStyledFilters: Story = {
  render: () => {
    const [filterValue, setFilterValue] = useState<FilterValue>(null);

    return (
      <div className="filter-example">
        <h3 className="font-heading text-foreground mb-4">
          Custom Styled Filters
        </h3>
        <div className="current-filter mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Filter:{' '}
            <strong>
              {filterValue
                ? JSON.stringify(filterValue, null, 2)
                : 'No filters applied'}
            </strong>
          </p>
        </div>
        <Filter.Root
          value={filterValue}
          onChange={setFilterValue}
          filterOptions={filterOptions}
        >
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
        </Filter.Root>
      </div>
    );
  },
};

/**
 * Complete filter example with all filter types and clear action.
 * Shows how to combine multiple filter types in a single filter component.
 */
export const CompleteExample: Story = {
  render: () => {
    const [filterValue, setFilterValue] = useState<FilterValue>(null);

    return (
      <div className="filter-example">
        <h3 className="font-heading text-foreground mb-4">Complete Example</h3>
        <div className="current-filter mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Filter:{' '}
            <strong>
              {filterValue
                ? JSON.stringify(filterValue, null, 2)
                : 'No filters applied'}
            </strong>
          </p>
        </div>
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
          <Filter.FilterOptions>
            <Filter.FilterOptionRepeater>
              <Filter.FilterOption.Label className="filter-label" />
              <Filter.FilterOption.SingleFilter className="filter-single" />
              <Filter.FilterOption.MultiFilter className="filter-multi" />
            </Filter.FilterOptionRepeater>
          </Filter.FilterOptions>
        </Filter.Root>
      </div>
    );
  },
};

