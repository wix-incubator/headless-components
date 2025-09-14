# Core Components

This directory contains the core context-based components for the restaurants-menus headless components.

## Components

### App

The root component that provides the entire app context. This should wrap your entire application.

```tsx
import { App } from './core';

function App() {
  return (
    <App
      menus={menus}
      sections={sections}
      items={items}
      variants={variants}
      labels={labels}
      modifierGroups={modifierGroups}
      modifiers={modifiers}
    >
      {/* Your app content */}
    </App>
  );
}
```

### Menu

Provides context for a specific menu and its related data.

```tsx
import { Menu } from './core';

function MenuPage({ menu }) {
  return <Menu menu={menu}>{/* Menu content */}</Menu>;
}
```

### Section

Provides context for a specific section and its items.

```tsx
import { Section } from './core';

function SectionComponent({ section }) {
  return <Section section={section}>{/* Section content */}</Section>;
}
```

### Item

Provides context for a specific item and its related data.

```tsx
import { Item } from './core';

function ItemComponent({ item }) {
  return <Item item={item}>{/* Item content */}</Item>;
}
```

## Usage Pattern

The components follow a hierarchical pattern where each root component provides context to its children:

```
App
  └── Menu
      └── Section
          └── Item
```

Each component can access its own context and all parent contexts through the provided hooks:

- `useAppContext()` - Access to all app data
- `useMenuContext()` - Access to menu and related data
- `useSectionContext()` - Access to section and related data
- `useItemContext()` - Access to item and related data
