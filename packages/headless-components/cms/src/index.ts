/**
 * @file Main entry point for the CMS package
 *
 * This file exports all services, components, and types from the CMS package.
 */

// Export services
export * from './services';

// Export components
export * from './react';

// Export namespaces
import * as services from './services';
import * as components from './react';

export const cms = {
  services,
  components,
};
