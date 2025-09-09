/**
 * @file Main entry point for the CMS package
 *
 * This file exports all services, components, and types from the CMS package.
 */

// Export services
export * from './legacy/services/index.js';

// Export components
export * from './legacy/react/index.js';

// Export namespaces
import * as services from './legacy/services/index.js';
import * as components from './legacy/react/index.js';

export const cms = {
  services,
  components,
};
