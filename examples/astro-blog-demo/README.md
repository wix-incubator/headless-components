# Wix Headless Blog Demo

A comprehensive demonstration of Wix headless blog components built with Astro, React, and modern web technologies.

## 🚀 Features

- **Modern Architecture**: Built with Astro for optimal performance and React for interactive components
- **Headless Blog Components**: Utilizes Wix's headless blog components for flexible, reusable functionality
- **Category System**: Support for blog categories with dedicated category pages and filtering
- **SEO Optimized**: Integrated SEO components with proper meta tags and structured data
- **Modern Styling**: Beautiful, responsive design with Tailwind CSS and semantic design system
- **Type Safe**: Full TypeScript support throughout the application
- **Service Manager**: Demonstrates modern service-driven architecture with dependency injection
- **Rich Content**: Wix Ricos integration for rich text content rendering
- **Social Sharing**: Built-in social media sharing for X, Facebook, and LinkedIn
- **Error Handling**: Proper 404 handling and error states

## 📁 Project Structure

```
src/
├── layouts/
│   ├── BaseLayout.astro           # HTML structure and head management
│   └── KitchensinkLayout.tsx      # React navigation and styling
├── pages/
│   ├── index.astro                # Home/Blog feed page (main entry)
│   ├── [slug].astro               # Individual blog post page
│   ├── 404.astro                  # 404 error page
│   └── category/
│       └── [slug].astro           # Category-filtered blog feed
├── react-pages/
│   ├── index.tsx                  # Home page React component
│   ├── 404.tsx                    # 404 React component
│   └── blog/
│       ├── index.tsx              # Blog feed React component
│       └── [slug].tsx             # Blog post React component
└── styles/
    ├── global.css                 # Semantic CSS classes with Tailwind
    ├── theme-blog.css             # Blog-specific theme variables
    └── global-loader.css          # Loading animations
```

## 🎨 Architecture Patterns

### Headless Components Usage

This demo showcases the comprehensive usage of Wix headless blog components:

#### Blog Feed Components

- **BlogFeed.Root**: Container component that provides blog feed context
- **BlogFeed.Posts**: List container with empty state support
- **BlogFeed.PostRepeater**: Maps over posts and renders individual post cards
- **BlogFeed.LoadMore**: Pagination component with loading states
- **BlogFeed.Sort**: Sorting controls for the post feed
- **BlogFeed.Post\***: Individual post components (Title, Excerpt, CoverImage, etc.)

#### Blog Post Components

- **BlogPost.Root**: Individual post context provider
- **BlogPost.Title**: Post title with customizable rendering
- **BlogPost.Content**: Rich content rendering with Wix Ricos
- **BlogPost.Categories**: Post category management
- **BlogPost.Tags**: Post tag system
- **BlogPost.Author\***: Author information components (Name, Avatar)
- **BlogPost.ShareUrl\***: Social sharing for X, Facebook, LinkedIn
- **BlogPost.ReadingTime**: Estimated reading time calculation

#### Blog Categories Components

- **BlogCategories.Root**: Category system container
- **BlogCategories.Categories**: List of available categories
- **BlogCategories.CategoryRepeater**: Maps over categories
- **BlogCategories.ActiveCategory**: Current category display
- **BlogCategories.CategoryLink**: Navigation to category pages

### Service-Driven Architecture

The application demonstrates modern client-side service architecture:

- **BlogFeedService**: Manages blog feed state, pagination, category filtering, and data loading
- **BlogPostService**: Handles individual post data and metadata
- **BlogCategoriesService**: Manages category data and filtering logic
- **SEOTagsService**: Handles dynamic SEO tag generation
- **ServicesManager**: Provides dependency injection and service orchestration
- **ServicesManagerProvider**: React context provider for service access

### SEO Integration

- **Automatic SEO Tags**: Dynamic generation of meta tags based on content
- **Structured Data**: Proper schema.org markup for search engines
- **OpenGraph**: Social media sharing optimization
- **Sitemap**: Automatic sitemap generation via Astro integration

## 🛠 Technology Stack

### Core Technologies

- **[Astro](https://astro.build/)**: Static site generator with islands architecture
- **[React](https://react.dev/)**: UI component library
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework

### Wix Technologies

- **[@wix/headless-blog](https://github.com/wix-incubator/headless-components)**: Headless blog components
- **[@wix/headless-seo](https://github.com/wix-incubator/headless-components)**: SEO management
- **[@wix/services-manager](https://github.com/wix-incubator/headless-components)**: Service architecture
- **[@wix/ricos](https://github.com/wix/ricos)**: Rich content editor and renderer
- **[@wix/astro](https://github.com/wix/wix-astro)**: Astro integration for Wix

### Build Tools

- **[@wix/cli](https://github.com/wix/cli)**: Wix development and deployment CLI
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)**: Automatic sitemap generation
- **[Prettier](https://prettier.io/)**: Code formatting

## 🛠 Development

### Prerequisites

- Node.js 18+
- Yarn or npm
- Wix site with blog content
- Wix CLI (`@wix/cli`) for development and deployment

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   yarn install
   ```

3. Configure your Wix site:

   ```json
   // wix.config.json
   {
     "siteId": "your-site-id",
     "appId": "your-app-id"
   }
   ```

4. Start development server:
   ```bash
   yarn dev
   ```

### Building for Production

```bash
yarn build
```

### Available Scripts

```bash
yarn dev        # Start development server with Wix CLI
yarn build      # Build for production
yarn preview    # Preview production build
yarn release    # Release the application
yarn format     # Format code with Prettier
yarn lint       # Check formatting and Astro syntax
yarn clean      # Clean build artifacts and dependencies
```

## 🎯 Key Implementation Details

### Category System

The demo includes a comprehensive category system:

- **Category Pages**: Dedicated routes at `/category/[slug]` for filtered blog feeds
- **Category Navigation**: Visual category picker with active state indication
- **Category Filtering**: Server-side filtering of posts by category
- **Category SEO**: Dynamic SEO tags for category pages
- **Custom Categories**: Support for custom "All Posts" category

```typescript
// Category-specific blog feed configuration
const blogFeedServiceConfig = await loadBlogFeedServiceConfig({
  categorySlug: slug,
  pageSize: 3,
  sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
});
```

### Data Loading

The application uses discriminated union results for proper 404 handling:

```typescript
const blogPostServiceConfigResult = await loadBlogPostServiceConfig({
  postSlug: Astro.params.slug,
});

if (blogPostServiceConfigResult.type === 'notFound') {
  return Astro.rewrite('/404');
}
```

### Service Configuration

Services are properly configured with server-side data loading:

```typescript
const [servicesManager] = useState(() =>
  createServicesManager(
    createServicesMap()
      .addService(
        BlogFeedServiceDefinition,
        BlogFeedService,
        blogFeedServiceConfig,
      )
      .addService(
        BlogCategoriesServiceDefinition,
        BlogCategoriesService,
        blogCategoriesServiceConfig,
      )
      .addService(
        BlogPostServiceDefinition,
        BlogPostService,
        blogPostServiceConfig,
      ),
  ),
);
```

Server-side configuration loading:

```typescript
const [blogFeedServiceConfig, blogCategoriesServiceConfig] = await Promise.all([
  loadBlogFeedServiceConfig({
    pageSize: 3,
    sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
  }),
  loadBlogCategoriesServiceConfig(),
]);
```

### Modern Styling Architecture

The application combines Tailwind CSS with a semantic design system for maintainable theming:

#### CSS Custom Properties

```css
:root {
  --theme-blog-title: #111827;
  --theme-blog-excerpt: #4b5563;
  --theme-blog-author: #374151;
  --theme-blog-category: #7c3aed;
}
```

#### Semantic CSS Classes

```css
.text-blog-title {
  color: var(--theme-blog-title);
}
.badge-category {
  background: var(--theme-blog-category-badge);
  color: var(--theme-blog-category);
}
.card-blog-post {
  background: var(--theme-blog-post-card);
  border: 1px solid var(--theme-border-primary);
}
```

#### Tailwind Integration

The design system works seamlessly with Tailwind utility classes for layout and spacing while maintaining theme consistency through CSS custom properties.

## 📚 Related Documentation

- [Wix Headless Components](https://github.com/wix-incubator/headless-components)
- [Implementation Status](https://github.com/wix-incubator/headless-components/blob/main/docs/IMPLEMENTATION_STATUS.md)
- [Astro Documentation](https://docs.astro.build/)
- [Wix Developer Platform](https://wix.dev)

## 🤝 Contributing

This demo is part of the Wix Headless Components project. See the main repository for contribution guidelines.

## 📄 License

This project is licensed under the same terms as the Wix Headless Components project.
