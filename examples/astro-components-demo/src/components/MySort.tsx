import React, { useState } from 'react';
import { Sort } from '@wix/headless-components/react';
import type { SortValue } from '@wix/headless-components/react';
import './MySort.css';

/**
 * Custom Sort component demonstrating the Sort primitive with custom options
 */
export function MySort() {
  const [sortValue, setSortValue] = useState<SortValue>([
    { fieldName: 'name', order: 'ASC' },
  ]);
  const [showExamples, setShowExamples] = useState(false);

  // Define custom sort options
  const sortOptions = [
    { fieldName: 'name', label: 'Name: A to Z', order: 'ASC' as const },
    { fieldName: 'name', label: 'Name: Z to A', order: 'DESC' as const },
    { fieldName: 'price', label: 'Price: Low to High', order: 'ASC' as const },
    { fieldName: 'price', label: 'Price: High to Low', order: 'DESC' as const },
    { fieldName: 'date', label: 'Date: Newest First', order: 'DESC' as const },
    { fieldName: 'date', label: 'Date: Oldest First', order: 'ASC' as const },
  ];

  const currentSort = sortValue[0];

  return (
    <div className="my-container">
      {/* Toggle button */}
      <div className="toggle-section">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="toggle-button"
        >
          {showExamples ? 'Hide Sort Examples' : 'Show Sort Examples'}
        </button>
      </div>

      {showExamples && (
        <>
          <h2 className="font-heading text-foreground">Sort Component Demo</h2>

          {/* Display current sort value */}
          <div className="current-sort">
            <p className="font-paragraph text-secondary-foreground">
              Current Sort: <strong>{currentSort?.fieldName}</strong> -{' '}
              <strong>{currentSort?.order}</strong>
            </p>
          </div>

          {/* Example 1: Select dropdown */}
          <div className="sort-example">
            <h3 className="font-heading text-foreground">Select Dropdown</h3>
            <Sort.Root
              value={sortValue}
              onChange={setSortValue}
              sortOptions={sortOptions}
              as="select"
              className="sort-select"
            />
          </div>

          {/* Example 2: List of buttons */}
          <div className="sort-example">
            <h3 className="font-heading text-foreground">Button List</h3>
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

          {/* Example 3: Custom styled options */}
          <div className="sort-example">
            <h3 className="font-heading text-foreground">
              Custom Styled Options
            </h3>
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
        </>
      )}
    </div>
  );
}

export default MySort;
