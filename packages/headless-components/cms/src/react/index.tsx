/**
 * @file React components index file for CMS package
 *
 * This file exports all React components from the CMS package.
 */

import { CmsCrud } from './CmsCrud';

export { CmsCrud };
export * from './CmsCrud';

// Export as a namespace for easier consumption
export const CmsCrudComponents = {
  CmsCrud,
};
