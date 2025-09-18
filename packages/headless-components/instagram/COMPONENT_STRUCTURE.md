# Instagram Component Structure

This document outlines the refactored file structure of the Instagram headless component, now split into separate files for better maintainability and organization.

## File Structure

```
src/react/
├── index.ts                     # Main export file
├── InstagramFeed.tsx           # Namespace exports (like stores package)
├── types.ts                    # Shared types and utilities
├── contexts.ts                 # All React contexts and hooks
├── InstagramFeedRoot.tsx       # Root component
├── Title.tsx                   # Title component
├── UserName.tsx               # UserName component
├── Hashtag.tsx                # Hashtag component
├── Gallery.tsx                # Gallery container (3-level pattern)
├── GalleryItems.tsx           # Gallery list container
├── GalleryRepeater.tsx        # Gallery repeater
├── GalleryItem.tsx            # Individual gallery item
└── Media.tsx                  # Media component
```

## Component Organization

### 1. **Core Infrastructure**
- `index.ts` - Main export point with InstagramFeed namespace
- `contexts.ts` - All React contexts and their corresponding hooks

### 2. **Main Components**
- `InstagramFeedRoot.tsx` - Service provider and main container
- `Title.tsx` - Feed title display
- `UserName.tsx` - Username/display name
- `Hashtag.tsx` - Hashtag display

### 4. **Gallery Components (3-Level Pattern)**
- `Gallery.tsx` - Container Level (conditional rendering, context provider)
- `GalleryItems.tsx` - List Container Level (empty state support)
- `GalleryRepeater.tsx` - Repeater Level (maps over items)
- `GalleryItem.tsx` - Individual item wrapper
- `Media.tsx` - Media display (image/video)

## Usage Patterns

### Namespace Import (Recommended)
```tsx
import { InstagramFeed } from '@wix/headless-instagram/react';

<InstagramFeed.Root instagramFeedServiceConfig={{ username: 'myaccount' }}>
  <div>
    <InstagramFeed.Title />
    <InstagramFeed.UserName />
    <InstagramFeed.Hashtag />
  </div>

  <InstagramFeed.Gallery>
    <InstagramFeed.GalleryItems>
      <InstagramFeed.GalleryRepeater>
        <InstagramFeed.GalleryItem>
          <InstagramFeed.Media />
        </InstagramFeed.GalleryItem>
      </InstagramFeed.GalleryRepeater>
    </InstagramFeed.GalleryItems>
  </InstagramFeed.Gallery>
</InstagramFeed.Root>
```

### Individual Imports (For Tree Shaking)
```tsx
import {
  Root,
  Title,
  Gallery,
  GalleryItems,
  GalleryRepeater,
  GalleryItem,
  Media
} from '@wix/headless-instagram/react';
```

## Benefits of This Structure

### ✅ **Maintainability**
- Each component is in its own file with focused responsibility
- Easy to locate and modify specific components
- Clear separation of concerns

### ✅ **Developer Experience**
- Better IntelliSense and code navigation
- Clearer import statements
- Easier to understand component relationships

### ✅ **Performance**
- Better tree shaking when importing individual components
- Smaller bundle size for applications that don't use all features

### ✅ **Testing**
- Each component can be unit tested independently
- Mock dependencies more easily
- Better test organization

### ✅ **Code Reuse**
- Shared utilities (types.ts, contexts.ts) can be easily imported
- Components can be composed differently if needed
- Better modularity

## Architecture Compliance

This structure maintains full compliance with the established patterns:

- ✅ **3-Level List Pattern**: Gallery → GalleryItems → GalleryRepeater
- ✅ **Context Pattern**: Proper context organization in separate file
- ✅ **AsChild Support**: Consistent across all applicable components
- ✅ **Simplified Structure**: No test IDs needed
- ✅ **TypeScript**: Full type safety maintained
- ✅ **Stores Package Consistency**: Matches the established patterns

## Migration Notes

The API remains exactly the same - this is purely a structural refactor. Existing code using the Instagram component will continue to work without any changes.

The only difference is that the codebase is now more maintainable and follows best practices for component organization.
