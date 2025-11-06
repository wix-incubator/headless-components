# CMS Collection Demo - Restaurant Menu

A comprehensive demo application showcasing the Wix Headless CMS components with a restaurant menu use case, featuring sorting, filtering, and item creation.

## Features

- 🍽️ **Restaurant Menu Display**: Renders menu items from a CMS collection
- 🔍 **Filtering**: Multi-select dietary restrictions and availability status
- 🔄 **Sorting**: Sort by name, price, or creation date
- 📄 **Pagination**: Navigate through pages with 9 items per page (3x3 grid)
- ➕ **Create Items**: Form to add new menu items with validation
- 📏 **Equal-Height Cards**: Flexbox layout ensures consistent card heights
- 🎨 **Responsive Design**: Mobile-friendly grid (1→2→3 columns)
- ⚡ **Server-Side Rendering**: Fast initial page load with Astro
- 🎭 **Loading & Error States**: Proper handling of loading and error scenarios
- 🏷️ **Item Details**: Display dish name, price, description, dietary info, and availability

## Pages

- **`/`** - Menu items page with pagination
- **`/create`** - Create new menu item form

## Collection Structure

The demo uses the `Import1` collection with restaurant menu fields:

- **dishName** (string): Name of the dish *(required)*
- **price** (number): Dish price *(required)*
- **description** (string): Dish description
- **ingredients** (string): List of ingredients
- **dietaryRestrictions** (array): Dietary information (Vegetarian, Vegan, Gluten-Free, Dairy-Free, Nut-Free)
- **isAvailable** (boolean): Availability status
- **dishImage** (image): Photo of the dish
- **_createdDate** (date): Creation timestamp (system field)

## Project Structure

```
src/
├── components/
│   ├── CollectionPage.tsx          # Menu items collection (pagination)
│   ├── CreateItemExample.tsx       # Create dish form
│   ├── logo-square.astro           # Logo component
│   └── layout/
│       ├── layout.astro            # Root layout
│       └── navbar/
│           └── index.astro         # Navigation bar
├── pages/
│   ├── index.astro                 # Home page (menu items)
│   └── create.astro                # Create item page
└── styles/
    └── global.css                  # Global styles with Tailwind
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

- `CmsItem.Field` - Renders individual fields with type safety and asChild pattern
- Supports loading, error, and value states
- Can handle arrays (e.g., dietary restrictions)

### Filter Components

- `Filter.FilterOptions` - Container for filter options
- `Filter.FilterOptionRepeater` - Repeats for each filter
- `Filter.FilterOption.Label` - Filter label
- `Filter.FilterOption.MultiFilter` - Multi-select filter with array support (checkboxes)
- `Filter.FilterOption.SingleFilter` - Single-select filter (radio buttons)

### CmsCollection.CreateItemAction

- Form-based item creation
- Supports controlled inputs with validation
- Provides loading and error states
- Uses asChild pattern for custom implementations

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
    fieldType: 'array', // REQUIRED for array fields with multi filters
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
  { fieldName: 'dishName', order: 'ASC', label: 'Name (A-Z)' },
  { fieldName: 'price', order: 'DESC', label: 'Price (High to Low)' },
  // ... more sort options
];
```

### Adjusting Pagination

Modify the `queryOptions` in `CmsCollection.Root`:

```tsx
queryOptions: {
  limit: 9,                    // Items per page
  returnTotalCount: true,      // Required for pagination
}
```

### Styling

The demo uses Tailwind CSS with a custom theme defined in `tailwind.config.mjs`. Colors follow the color system rules:

- `bg-background` / `text-foreground` - Base colors
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-secondary` / `text-secondary-foreground` - Secondary elements
- `text-destructive` - Errors and warnings
- `bg-green-500` / `text-green-500` - Available status (success)
- `bg-red-500` / `text-red-500` - Unavailable status (error)

Fonts use the font system:

- `font-heading` - For headings
- `font-paragraph` - For body text

Layout patterns:

- **Equal-height cards**: `flex flex-col h-full` on cards
- **Bottom alignment**: `mt-auto` to push content to bottom
- **Flexible content**: `flex-grow` on expanding sections
- **Grid spacing**: `gap-8` for consistent spacing

## Architecture

The application follows the headless component architecture:

1. **Root Component** (`CmsCollection.Root`) - Provides collection context with queryOptions
2. **Container Components** (`Items`, `Filters`, `Sort`) - Manage sections with empty states
3. **Repeater Components** (`ItemRepeater`) - Map over collections
4. **Field Components** (`CmsItem.Field`) - Render individual data with type safety

Key patterns:

- **AsChild Pattern**: Full control over rendering with custom props
- **Render Props**: Access to internal state (loading, error, data)
- **Array Handling**: Proper support for multi-value fields
- **Equal Heights**: Flexbox layout for consistent card sizes
- **Type Safety**: TypeScript generics for field types

## Learn More

- [Wix Headless CMS Documentation](https://dev.wix.com/docs/sdk/api-reference/cms)
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
