import React from 'react';
import { ServiceListSort } from '@wix/headless-services/react';

interface SortProps {
  className?: string;
}

export function Sort({ className }: SortProps) {
  return (
    <ServiceListSort>
      {({ currentSort, sortOptions, setSort }) => (
        <div className={className}>
          <select
            className="bg-surface-primary text-content-primary border-surface-primary rounded-md border px-4 py-2"
            value={`${currentSort[0]?.fieldName}-${currentSort[0]?.order}`}
            onChange={(e) => {
              const [fieldName, order] = e.target.value.split('-') as [
                string,
                'ASC' | 'DESC'
              ];
              setSort([{ fieldName, order }]);
            }}
          >
            <option value="">Sort by...</option>
            {sortOptions.map((option) => (
              <option
                key={`${option.fieldName}-${option.order}`}
                value={`${option.fieldName}-${option.order}`}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </ServiceListSort>
  );
}
