# Platform Components

Platform-agnostic utility components that serve as building blocks for verticals. These components provide common functionality like sorting and filtering without being tied to any specific business domain.

## Components

### Sort Components

Provides flexible sort controls with both declarative and programmatic APIs. Uses `@radix-ui/react-select` for accessible dropdown functionality while maintaining a simple interface.

**AsChild Pattern**: All components support the `asChild` prop which follows the Radix UI pattern. When `asChild` is true, the component renders its child element instead of its default element, forwarding all props and refs.

#### Basic Usage

```tsx
import { Sort } from '@wix/headless-components/react';

// Declarative API with Radix Select (default styling)
function SortDropdown({ sort, onChange }) {
  const sortOptions = [
    { fieldName: 'price', label: 'Price: Low to High', order: 'ASC' },
    { fieldName: 'price', label: 'Price: High to Low', order: 'DESC' },
    { fieldName: 'name', label: 'Name: A to Z', order: 'ASC' },
    { fieldName: 'name', label: 'Name: Z to A', order: 'DESC' },
  ];

  return (
    <Sort.Root
      value={sort}
      onChange={onChange}
      sortOptions={sortOptions}
      as="select"
      placeholder="Choose sort order"
      className="w-full"
    />
  );
}

// Custom Radix Select trigger with asChild
function CustomTriggerSort({ sort, onChange, sortOptions }) {
  return (
    <Sort.Root
      value={sort}
      onChange={onChange}
      sortOptions={sortOptions}
      as="select"
      asChild
    >
      <button className="flex items-center justify-between w-full p-3 border rounded-lg bg-white hover:bg-gray-50">
        <span>Sort: {sort.fieldName} {sort.order === 'ASC' ? '↑' : '↓'}</span>
        <span>▼</span>
      </button>
    </Sort.Root>
  );
}

// Advanced Radix Select customization
function AdvancedRadixSort({ sort, onChange, sortOptions }) {
  return (
    <Sort.Root value={sort} onChange={onChange} sortOptions={sortOptions}>
      <Sort.RadixSelect.Root>
        <Sort.RadixSelect.Trigger className="inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Sort.RadixSelect.Value placeholder="Select sort option..." />
          <Sort.RadixSelect.Icon className="ml-2">
            <ChevronDownIcon />
          </Sort.RadixSelect.Icon>
        </Sort.RadixSelect.Trigger>

        <Sort.RadixSelect.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200">
          <Sort.RadixSelect.Viewport className="p-1">
            <Sort.RadixSelect.Options>
              {/* Automatically renders all sort options */}
            </Sort.RadixSelect.Options>

            {/* Or manually create items */}
            <Sort.RadixSelect.Item value="custom-value" className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
              <Sort.RadixSelect.ItemText>Custom Option</Sort.RadixSelect.ItemText>
            </Sort.RadixSelect.Item>
          </Sort.RadixSelect.Viewport>
        </Sort.RadixSelect.Content>
      </Sort.RadixSelect.Root>
    </Sort.Root>
  );
}

// Programmatic API with custom button controls (no Radix Select)
function ButtonSort({ sort, onChange }) {
  return (
    <Sort.Root value={sort} onChange={onChange} className="flex gap-2">
      <Sort.Option fieldName="price" order="asc" label="Price ↑" className="btn btn-outline" />
      <Sort.Option fieldName="price" order="desc" label="Price ↓" className="btn btn-outline" />
      <Sort.Option fieldName="name" order="asc" label="Name ↑" className="btn btn-outline" />
      <Sort.Option fieldName="name" order="desc" label="Name ↓" className="btn btn-outline" />
    </Sort.Root>
  );
}

// Enhanced usage with Radix UI components
function EnhancedFilterExample({ filter, onChange, onFilterChange, filterOptions }) {
  return (
    <Filter.Root
      value={filter}
      onChange={onChange}
      onFilterChange={onFilterChange}
      filterOptions={filterOptions}
      className="p-6 border rounded-lg"
    >
      <Filter.Filtered>
        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="text-sm text-blue-800 mb-2">Active filters:</p>
          <Filter.Action.Clear
            label="Clear All"
            className="text-blue-600 underline hover:text-blue-800"
          />
        </div>
      </Filter.Filtered>

      <Filter.FilterOptions>
        <Filter.FilterOptionRepeater>
          <div className="mb-6">
            <Filter.FilterOption.Label className="block font-medium mb-3" />

            {/* Enhanced SingleFilter with Radix ToggleGroup (default) */}
            <Filter.FilterOption.SingleFilter className="flex gap-2" />

            {/* Custom SingleFilter with asChild */}
            <Filter.FilterOption.SingleFilter asChild>
              {({ value, onChange, validValues, valueFormatter }) => (
                <div className="flex flex-wrap gap-2">
                  {validValues?.map(option => (
                    <button
                      key={option}
                      onClick={() => onChange(String(option))}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        value === String(option)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {valueFormatter ? valueFormatter(option) : option}
                    </button>
                  ))}
                </div>
              )}
            </Filter.FilterOption.SingleFilter>

            {/* Enhanced MultiFilter with Radix ToggleGroup (default) */}
            <Filter.FilterOption.MultiFilter className="flex flex-wrap gap-2" />

            {/* Enhanced RangeFilter with Radix Slider (default) - smooth interaction */}
            <Filter.FilterOption.RangeFilter className="space-y-2" />

            {/* Custom RangeFilter with asChild */}
            <Filter.FilterOption.RangeFilter asChild>
              {({ value, onChange, validValues, valueFormatter }) => (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={validValues?.[0] || 0}
                    max={validValues?.[1] || 100}
                    value={value[0] || 0}
                    onChange={(e) => onChange([Number(e.target.value), value[1] || 100])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{valueFormatter ? valueFormatter(value[0] || 0) : (value[0] || 0)}</span>
                    <span>{valueFormatter ? valueFormatter(value[1] || 100) : (value[1] || 100)}</span>
                  </div>
                </div>
              )}
            </Filter.FilterOption.RangeFilter>
          </div>
        </Filter.FilterOptionRepeater>
      </Filter.FilterOptions>
    </Filter.Root>
  );
}

// AsChild pattern examples (following Radix UI/MediaGallery pattern)
function AsChildExamples({ sort, onChange, sortOptions }) {
  return (
    <div className="space-y-4">
      {/* Root with asChild - renders as custom div */}
      <Sort.Root value={sort} onChange={onChange} asChild>
        <div className="custom-sort-container p-4 border rounded">
          <Sort.Option fieldName="price" order="asc" label="Price ↑" />
          <Sort.Option fieldName="price" order="desc" label="Price ↓" />
        </div>
      </Sort.Root>

      {/* Option with asChild - renders as custom button */}
      <Sort.Root value={sort} onChange={onChange}>
        <Sort.Option fieldName="price" order="asc" asChild>
          <button className="custom-btn bg-blue-500 text-white px-4 py-2 rounded">
            Price: Low to High
          </button>
        </Sort.Option>
      </Sort.Root>

      {/* Select trigger with asChild */}
      <Sort.Root value={sort} onChange={onChange} sortOptions={sortOptions} as="select" asChild>
        <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
          Sort: {sort.fieldName} {sort.order === 'ASC' ? '↑' : '↓'}
        </button>
      </Sort.Root>
    </div>
  );
}

// Mixed approach - Radix Select for some options, buttons for others
function MixedSort({ sort, onChange, sortOptions }) {
  return (
    <div className="flex items-center gap-4">
      {/* Radix Select for field selection */}
      <Sort.Root value={sort} onChange={onChange} sortOptions={sortOptions} as="select" placeholder="Sort by..." />

      {/* Buttons for order selection */}
      <Sort.Root value={sort} onChange={onChange} className="flex">
        <Sort.Option order="asc" label="↑" className="btn btn-sm" />
        <Sort.Option order="desc" label="↓" className="btn btn-sm" />
      </Sort.Root>
    </div>
  );
}
```

#### API Reference

**Sort.Root**
- `value: Sort` - Current sort state
- `onChange: (value: Sort) => void` - Sort change handler
- `sortOptions?: SortOption[]` - Predefined options for declarative API
- `as?: 'select' | 'list'` - Render mode ('select' uses Radix UI, 'list' provides render props)
- `placeholder?: string` - Placeholder text for select mode
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Sort.Option**
- `fieldName?: string` - Field to sort by
- `order?: 'ASC' | 'DESC'` - Sort order
- `label?: string` - Display label
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Sort.RadixSelect.*** - Radix UI Select Primitives

When using advanced customization, you can access all Radix Select primitives:

- `Sort.RadixSelect.Root` - Root select container (automatically handles Sort context)
- `Sort.RadixSelect.Trigger` - Select trigger button
- `Sort.RadixSelect.Value` - Selected value display
- `Sort.RadixSelect.Icon` - Trigger icon
- `Sort.RadixSelect.Content` - Dropdown content (includes Portal)
- `Sort.RadixSelect.Viewport` - Scrollable viewport
- `Sort.RadixSelect.Options` - Auto-generates options from sortOptions
- `Sort.RadixSelect.Item` - Individual option item
- `Sort.RadixSelect.ItemText` - Option text content

All Radix Select components support their standard props and can be styled as needed.

### Filter Components

Provides flexible filter controls supporting single selection, multi-selection, and range filters. Uses `@radix-ui/react-toggle-group` for selections and `@radix-ui/react-slider` for ranges while maintaining a simple, platform-agnostic interface.

**AsChild Pattern**: All components support the `asChild` prop which follows the Radix UI pattern. When `asChild` is true, the component renders its child element instead of its default element, forwarding all props and refs.

**Enhanced Default Components**: The filter components now include enhanced default implementations:
- **SingleFilter**: Uses Radix ToggleGroup (single mode) by default
- **MultiFilter**: Uses Radix ToggleGroup (multiple mode) by default
- **RangeFilter**: Uses Radix Slider by default with value formatting

#### Basic Usage

```tsx
import { Filter } from '@wix/headless-components/react';

function ProductFilters({ filter, onChange, onFilterChange }) {
  const filterOptions = [
    {
      key: 'category',
      label: 'Category',
      type: 'single',
      displayType: 'text',
      validValues: ['electronics', 'clothing', 'books'],
    },
    {
      key: 'brand',
      label: 'Brand',
      type: 'multi',
      displayType: 'text',
      validValues: ['apple', 'samsung', 'nike', 'adidas'],
    },
    {
      key: 'price',
      label: 'Price Range',
      type: 'range',
      displayType: 'range',
      validValues: [0, 1000],
      valueFormatter: (value) => `$${value}`,
    },
  ];

  return (
    <Filter.Root
      value={filter}
      onChange={onChange}
      onFilterChange={onFilterChange}
      filterOptions={filterOptions}
      className="space-y-4"
    >
      <Filter.Filtered>
        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="text-sm text-blue-800 mb-2">Active filters:</p>
          <Filter.Action.Clear
            label="Clear All"
            className="text-blue-600 underline hover:text-blue-800"
          />
        </div>
      </Filter.Filtered>

      <Filter.FilterOptions>
        <Filter.FilterOptionRepeater>
          <div className="mb-4">
            <Filter.FilterOption.Label className="block font-medium mb-2" />
            <Filter.FilterOption.SingleFilter className="w-full p-2 border rounded" />
            <Filter.FilterOption.MultiFilter className="space-y-1" />
            <Filter.FilterOption.RangeFilter className="flex items-center gap-2" />
          </div>
        </Filter.FilterOptionRepeater>
      </Filter.FilterOptions>
    </Filter.Root>
  );
}

// Custom filter rendering with asChild
function CustomFilters({ filter, onChange, onFilterChange, filterOptions }) {
  return (
    <Filter.Root
      value={filter}
      onChange={onChange}
      onFilterChange={onFilterChange}
      filterOptions={filterOptions}
    >
      <Filter.FilterOptions>
        <Filter.FilterOptionRepeater>
          <Filter.FilterOption.Label asChild>
            {({ label }) => <h3 className="text-lg font-bold">{label}</h3>}
          </Filter.FilterOption.Label>

          <Filter.FilterOption.SingleFilter asChild>
            {({ value, onChange, validValues, valueFormatter }) => (
              <div className="flex flex-wrap gap-2">
                {validValues?.map(option => (
                  <button
                    key={option}
                    onClick={() => onChange(String(option))}
                    className={`px-3 py-1 rounded ${
                      value === String(option) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {valueFormatter ? valueFormatter(option) : option}
                  </button>
                ))}
              </div>
            )}
          </Filter.FilterOption.SingleFilter>

          <Filter.FilterOption.MultiFilter asChild>
            {({ values, onChange, validValues, valueFormatter }) => (
              <div className="grid grid-cols-2 gap-2">
                {validValues?.map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={values.includes(String(option))}
                      onChange={(e) => {
                        const stringValue = String(option);
                        const newValue = e.target.checked
                          ? [...values, stringValue]
                          : values.filter(v => v !== stringValue);
                        onChange(newValue);
                      }}
                      className="rounded"
                    />
                    <span>{valueFormatter ? valueFormatter(option) : option}</span>
                  </label>
                ))}
              </div>
            )}
          </Filter.FilterOption.MultiFilter>

          <Filter.FilterOption.RangeFilter asChild>
            {({ value, onChange, validValues, valueFormatter }) => (
              <div className="space-y-2">
                <input
                  type="range"
                  min={validValues?.[0] || 0}
                  max={validValues?.[1] || 100}
                  value={value[0] || validValues?.[0] || 0}
                  onChange={(e) => onChange([Number(e.target.value), value[1] || validValues?.[1] || 100])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>
                    {valueFormatter ? valueFormatter(value[0] || validValues?.[0] || 0) : (value[0] || validValues?.[0] || 0)}
                  </span>
                  <span>
                    {valueFormatter ? valueFormatter(value[1] || validValues?.[1] || 100) : (value[1] || validValues?.[1] || 100)}
                  </span>
                </div>
              </div>
            )}
          </Filter.FilterOption.RangeFilter>
        </Filter.FilterOptionRepeater>
      </Filter.FilterOptions>
    </Filter.Root>
  );
}
```

#### API Reference

**Filter.Root**
- `value: Filter` - Current filter state
- `onChange: (value: Filter) => void` - Filter change handler
- `onFilterChange: ({ value, key }) => Filter` - Single field update handler
- `filterOptions: FilterOption[]` - Available filter configurations
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Filter.Filtered**
- `children: React.ReactNode` - Content to show when filters are active

**Filter.Action.Clear**
- `label: string` - Button label
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Filter.FilterOptions**
- `children: React.ReactNode` - Filter option components

**Filter.FilterOptionRepeater**
- `children: React.ReactNode` - Template for each filter option

**Filter.FilterOption.Label**
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Filter.FilterOption.SingleFilter**
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Filter.FilterOption.MultiFilter**
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

**Filter.FilterOption.RangeFilter**
- `asChild?: boolean` - Enable render prop pattern
- `children?: React.ReactNode | RenderFunction` - Children or render function

## Architecture

These components follow the headless UI pattern:

1. **Unstyled**: No default styling, only functional behavior
2. **Composable**: Support for the `asChild` pattern for flexible DOM structure
3. **Accessible**: Built-in keyboard navigation and ARIA attributes
4. **Flexible**: Render props pattern for maximum customization

The components are designed to be platform-agnostic and can be used across different verticals within the Wix ecosystem.

## Integration with Stores

While these are platform components, they integrate seamlessly with the stores package:

```tsx
import { Sort, Filter } from '@wix/headless-components/react';
import { ProductListSort } from '@wix/stores/react';

// Bridge platform components with store-specific logic
function ProductSortControls() {
  return (
    <ProductListSort.Options>
      {({ selectedSortOption, updateSortOption, sortOptions }) => {
        // Convert store sort options to platform format
        const platformSortOptions = sortOptions.map(option => ({
          fieldName: option.includes('price') ? 'price' : 'name',
          order: option.includes('desc') ? 'DESC' : 'ASC',
          label: formatSortLabel(option),
        }));

        const currentSort = {
          fieldName: selectedSortOption.includes('price') ? 'price' : 'name',
          order: selectedSortOption.includes('desc') ? 'DESC' : 'ASC',
        };

        return (
          <Sort.Root
            value={currentSort}
            onChange={(sort) => {
              const storeFormat = `${sort.fieldName}_${sort.order}`;
              updateSortOption(storeFormat);
            }}
            sortOptions={platformSortOptions}
            as="select"
          />
        );
      }}
    </ProductListSort.Options>
  );
}
```
