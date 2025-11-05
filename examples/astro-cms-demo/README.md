# CMS Collection Demo - Astro

A comprehensive demo application showcasing the Wix Headless CMS components with sorting and filtering capabilities.

## Features

- 📊 **Collection Display**: Renders items from a CMS collection
- 🔍 **Filtering**: Multi-select and single-select filters for categories and status
- 🔄 **Sorting**: Sort by title, creation date in ascending/descending order
- 📄 **Pagination**: Navigate through pages with previous/next controls
- ♾️ **Infinite Scroll**: Alternative version with automatic loading as you scroll
- 🎨 **Responsive Design**: Mobile-friendly grid layout
- ⚡ **Server-Side Rendering**: Fast initial page load with Astro
- 🎭 **Loading & Error States**: Proper handling of loading and error scenarios
- 🏷️ **Item Details**: Display title, description, category, status, and creation date

## Pages

- **`/`** - Main collection page with pagination
- **`/infinite-scroll`** - Collection page with infinite scroll
- **`/create`** - Create new items example

## Collection Structure

The demo uses the `Import1` collection with the following fields:

- **title** (string): Item title
- **description** (string): Item description
- **category** (string): Category (Technology, Lifestyle, Business, Health, Travel)
- **status** (string): Status (Published, Draft, Archived)
- **_createdDate** (date): Creation timestamp (system field)

## Project Structure

```
src/
├── components/
│   ├── CollectionPage.tsx                # Main collection (pagination)
│   ├── CollectionPageInfiniteScroll.tsx  # Alternative (infinite scroll)
│   ├── CreateItemExample.tsx             # Create item form example
│   └── layout/
│       └── layout.astro                  # Root layout with navbar
├── pages/
│   ├── index.astro                       # Home page (pagination)
│   ├── infinite-scroll.astro             # Infinite scroll page
│   └── create.astro                      # Create item page
└── styles/
    └── global.css                        # Global styles with Tailwind
```

## Components Used

### CmsCollection Components

- `CmsCollection.Root` - Root container providing collection context
- `CmsCollection.Items` - Main items container with empty state support
- `CmsCollection.ItemRepeater` - Repeats for each item
- `CmsCollection.Sort` - Sort control with predefined options
- `CmsCollection.Filters` - Filter container
- `CmsCollection.FilterResetTrigger` - Clear all filters button
- `CmsCollection.NextAction` / `CmsCollection.PrevAction` - Pagination controls
- `CmsCollection.Totals.Count` - Total items count
- `CmsCollection.Totals.Displayed` - Displayed items count
- `CmsCollection.Loading` - Loading state component
- `CmsCollection.Error` - Error state component

### CmsItem Components

- `CmsItem.Root` - Root container for individual items
- `CmsItem.Field` - Renders individual fields with type safety

### Filter Components

- `Filter.FilterOptions` - Container for filter options
- `Filter.FilterOptionRepeater` - Repeats for each filter
- `Filter.FilterOption.Label` - Filter label
- `Filter.FilterOption.MultiFilter` - Multi-select filter (checkboxes)
- `Filter.FilterOption.SingleFilter` - Single-select filter (radio buttons)

## Running the Demo

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Customization

### Changing the Collection

Update the `collectionId` in `src/pages/index.astro`:

```astro
const collectionId = "YourCollectionId";
```

### Adding More Filters

Modify the `filterOptions` array in `src/components/CollectionPage.tsx`:

```tsx
const filterOptions: FilterOption[] = [
  {
    key: 'yourField',
    label: 'Your Field Label',
    type: 'multi', // or 'single'
    displayType: 'text',
    fieldName: 'yourFieldName',
    validValues: ['value1', 'value2', 'value3'],
  },
  // ... more filters
];
```

### Adding More Sort Options

Modify the `sortOptions` array:

```tsx
const sortOptions = [
  { fieldName: 'yourField', order: 'ASC', label: 'Your Field (A-Z)' },
  { fieldName: 'yourField', order: 'DESC', label: 'Your Field (Z-A)' },
];
```

### Styling

The demo uses Tailwind CSS with a custom theme defined in `tailwind.config.mjs`. Colors follow the color system rules:

- `bg-background` / `text-foreground` - Base colors
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-secondary` / `text-secondary-foreground` - Secondary elements
- `text-destructive` - Errors and warnings
- `bg-green-500` / `text-green-500` - Success states (only exception to color rules)

Fonts use the font system:

- `font-heading` - For headings
- `font-paragraph` - For body text

## Architecture

The application follows the headless component architecture:

1. **Root Component** (`CmsCollection.Root`) - Provides collection context
2. **Container Components** (`Items`, `Filters`, `Sort`) - Manage sections
3. **Repeater Components** (`ItemRepeater`) - Map over collections
4. **Leaf Components** (`CmsItem.Field`) - Render individual data

All components follow the asChild pattern for maximum flexibility and customization.

## Learn More

- [Wix Headless CMS Documentation](https://dev.wix.com/docs/sdk/api-reference/cms)
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
