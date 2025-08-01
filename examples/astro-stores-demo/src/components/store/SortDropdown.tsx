import { ProductListSort } from '@wix/headless-stores/react';
import { SortType } from '@wix/headless-stores/services';

export function SortDropdown() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
          Sort by
        </h3>
      </div>
      <ProductListSort.Options>
        {({ selectedSortOption, updateSortOption, sortOptions }) => (
          <select
            value={selectedSortOption}
            onChange={e => updateSortOption(e.target.value as SortType)}
            className="px-3 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none min-w-[160px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(
                'var(--theme-dropdown-arrow-color)'
              )}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 8px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px',
            }}
          >
            {sortOptions.map(option => (
              <option
                key={option}
                value={option}
                className="bg-surface-primary text-content-primary"
              >
                {(() => {
                  switch (option) {
                    case SortType.NAME_ASC:
                      return 'Name (A-Z)';
                    case SortType.NAME_DESC:
                      return 'Name (Z-A)';
                    case SortType.PRICE_ASC:
                      return 'Price (Low to High)';
                    case SortType.PRICE_DESC:
                      return 'Price (High to Low)';
                    case SortType.NEWEST:
                      return 'Latest Arrivals';
                    case SortType.RECOMMENDED:
                      return 'Recommended';
                  }
                })()}
              </option>
            ))}
          </select>
        )}
      </ProductListSort.Options>
    </div>
  );
}
