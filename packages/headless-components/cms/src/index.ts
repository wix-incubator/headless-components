/**
 * @file Main entry point for the CMS package
 *
 * This file exports all services, components, and types from the CMS package.
 */

// Export services
export * from './services/index.js';

// Export components
export * from './react/index.js';

// Export namespaces
import * as services from './services/index.js';
import * as components from './react/index.js';

export const cms = {
  services,
  components,
};
