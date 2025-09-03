// V1 exports (core - service-connected components)
export * as BlogFeedCore from './core/BlogFeed.js';
export * as BlogCategoriesCore from './core/BlogCategories.js';
export * as BlogPostCore from './core/BlogPost.js';

// V2 exports (composite API - high-level components)
export * as BlogFeed from './BlogFeed.js';
export * as BlogCategories from './BlogCategories.js';
export * as BlogPost from './BlogPost.js';

// CSS exports - consumers must import this alongside components
// import '@wix/headless-blog/react/styles.css';

// Utility exports
export { createCustomCategory } from './BlogCategories.js';
