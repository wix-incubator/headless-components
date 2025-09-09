// V1 exports (core - service-connected components)
// export * as BlogFeedCore from './core/BlogFeed.js';
// export * as BlogCategoriesCore from './core/BlogCategories.js';
// export * as BlogPostCore from './core/BlogPost.js';

// V2 exports (composite API - high-level components)
import * as Feed from './Feed.js';
import * as Categories from './Categories.js';
import * as Post from './Post.js';
import * as Category from './Category.js';
import * as Tag from './Tag.js';

export const Blog = {
  Feed,
  Categories,
  Post,
  Category,
  Tag,
};

// CSS exports - consumers must import this alongside components
// import '@wix/headless-blog/react/styles.css';

// Utility exports
export { createCustomCategory } from './Categories.js';
