import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sort } from '@wix/headless-components/react';
import type { SortValue } from '@wix/headless-components/react';
import './MySort.css';

const meta: Meta<typeof Sort.Root> = {
  title: 'Components/Sort',
  component: Sort.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Sort.Root>;

// Define sort options used across all stories
const sortOptions = [
  { fieldName: 'name', label: 'Name: A to Z', order: 'ASC' as const },
  { fieldName: 'name', label: 'Name: Z to A', order: 'DESC' as const },
  { fieldName: 'price', label: 'Price: Low to High', order: 'ASC' as const },
  { fieldName: 'price', label: 'Price: High to Low', order: 'DESC' as const },
  { fieldName: 'date', label: 'Date: Newest First', order: 'DESC' as const },
  { fieldName: 'date', label: 'Date: Oldest First', order: 'ASC' as const },
];

/**
 * Sort component rendered as a select dropdown.
 * This is the simplest way to use the Sort component.
 */
export const SelectDropdown: Story = {
  render: () => {
    const [sortValue, setSortValue] = useState<SortValue>([
      { fieldName: 'name', order: 'ASC' },
    ]);
    const currentSort = sortValue[0];

    return (
      <div className="sort-example">
        <h3 className="font-heading text-foreground mb-4">Select Dropdown</h3>
        <div className="current-sort mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Sort: <strong>{currentSort?.fieldName}</strong> -{' '}
            <strong>{currentSort?.order}</strong>
          </p>
        </div>
        <Sort.Root
          value={sortValue}
          onChange={setSortValue}
          sortOptions={sortOptions}
          as="select"
          className="sort-select"
        />
      </div>
    );
  },
};

/**
 * Sort component rendered as a list of buttons.
 * Each option is rendered as a button that can be clicked to select it.
 */
export const ButtonList: Story = {
  render: () => {
    const [sortValue, setSortValue] = useState<SortValue>([
      { fieldName: 'name', order: 'ASC' },
    ]);
    const currentSort = sortValue[0];

    return (
      <div className="sort-example">
        <h3 className="font-heading text-foreground mb-4">Button List</h3>
        <div className="current-sort mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Sort: <strong>{currentSort?.fieldName}</strong> -{' '}
            <strong>{currentSort?.order}</strong>
          </p>
        </div>
        <Sort.Root
          value={sortValue}
          onChange={setSortValue}
          as="list"
          className="sort-list"
        >
          {sortOptions.map((option) => (
            <Sort.Option
              key={`${option.fieldName}-${option.order}`}
              fieldName={option.fieldName}
              order={option.order}
              label={option.label}
              asChild
            >
              {({ isSelected, onSelect, label }) => (
                <button
                  onClick={onSelect}
                  className={`sort-button ${isSelected ? 'selected' : ''}`}
                >
                  {label} {isSelected && '✓'}
                </button>
              )}
            </Sort.Option>
          ))}
        </Sort.Root>
      </div>
    );
  },
};

/**
 * Sort component with custom styled options in a grid layout.
 * Demonstrates how to fully customize the appearance of sort options.
 */
export const CustomStyledOptions: Story = {
  render: () => {
    const [sortValue, setSortValue] = useState<SortValue>([
      { fieldName: 'name', order: 'ASC' },
    ]);
    const currentSort = sortValue[0];

    return (
      <div className="sort-example">
        <h3 className="font-heading text-foreground mb-4">
          Custom Styled Options
        </h3>
        <div className="current-sort mb-4">
          <p className="font-paragraph text-secondary-foreground">
            Current Sort: <strong>{currentSort?.fieldName}</strong> -{' '}
            <strong>{currentSort?.order}</strong>
          </p>
        </div>
        <div className="custom-sort-grid">
          <Sort.Root value={sortValue} onChange={setSortValue} as="list">
            {sortOptions.map((option) => (
              <Sort.Option
                key={`${option.fieldName}-${option.order}`}
                fieldName={option.fieldName}
                order={option.order}
                label={option.label}
                asChild
              >
                {({ isSelected, onSelect, label }) => (
                  <div
                    onClick={onSelect}
                    className={`custom-option ${isSelected ? 'active' : ''}`}
                  >
                    <span className="option-label">{label}</span>
                    <span className="option-indicator">
                      {isSelected ? '●' : '○'}
                    </span>
                  </div>
                )}
              </Sort.Option>
            ))}
          </Sort.Root>
        </div>
      </div>
    );
  },
};

