import React from 'react';
import { AsChildSlot } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import {
  FaqCategoriesServiceDefinition,
  type FaqCategoriesServiceConfig,
  type FaqCategory,
  type FaqServiceConfig,
} from '../services/index.js';
import * as CoreFaqCategories from './core/FaqCategories.js';
import * as FaqCategoryComponents from './FaqCategory.js';

enum TestIds {
  // Container Level
  faqCategoriesRoot = 'faq-categories-root',

  // List Container Level
  faqCategories = 'faq-categories',

  // Repeater Level (individual items)
  faqCategory = 'faq-category',
}


/**
 * Props for the FaqCategories root component
 */
export interface FaqCategoriesRootProps {
  children: React.ReactNode;
  faqCategoriesConfig: FaqCategoriesServiceConfig;
  className?: string;
}

/**
 * Root component that provides FAQ categories service context and conditional rendering.
 * Does not render if there are no categories.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <FaqCategories.Root faqCategoriesConfig={faqCategoriesConfig}>
 *   <FaqCategories.Categories>
 *     <FaqCategories.CategoryRepeater>
 *       <FaqCategory.Name />
 *       <FaqCategory.Faqs>
 *         <FaqCategory.FaqRepeater>
 *           <Faq.Name />
 *           <Faq.Answer />
 *         </FaqCategory.FaqRepeater>
 *       </FaqCategory.Faqs>
 *     </FaqCategories.CategoryRepeater>
 *   </FaqCategories.Categories>
 * </FaqCategories.Root>
 * ```
 */
export function Root(props: FaqCategoriesRootProps): React.ReactNode {
  const { children, faqCategoriesConfig, className, ...attrs } = props;

  const hasCategories = faqCategoriesConfig.categories.length > 0;

  // Don't render if no categories (following Container Level pattern)
  if (!hasCategories) return null;

  return (
    <CoreFaqCategories.Root faqCategoriesServiceConfig={faqCategoriesConfig}>
      <AsChildSlot
        {...attrs}
        className={className}
        data-testid={TestIds.faqCategoriesRoot}
        data-categories-count={faqCategoriesConfig.categories.length}
      >
        {children}
      </AsChildSlot>
    </CoreFaqCategories.Root>
  );
}

/**
 * Props for FaqCategories Categories component
 */
export interface CategoriesProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for the list of categories with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <FaqCategories.Categories emptyState={<div>No categories available</div>}>
 *   <FaqCategories.CategoryRepeater>
 *     <FaqCategory.Name />
 *     <FaqCategory.Faqs>
 *       <FaqCategory.FaqRepeater>
 *         <Faq.Name />
 *         <Faq.Answer />
 *       </FaqCategory.FaqRepeater>
 *     </FaqCategory.Faqs>
 *   </FaqCategories.CategoryRepeater>
 * </FaqCategories.Categories>
 *
 * // Simple container usage
 * <FaqCategories.Categories emptyState={<div>No categories</div>}>
 *   <div className="categories-container">
 *     <FaqCategories.CategoryRepeater>
 *       <FaqCategory.Name />
 *     </FaqCategories.CategoryRepeater>
 *   </div>
 * </FaqCategories.Categories>
 * ```
 */
export const Categories = React.forwardRef<HTMLDivElement, CategoriesProps>(
  (props, ref) => {
    const { children, emptyState } = props;

    return (
      <CoreFaqCategories.Categories>
        {({ hasCategories, categories }) => {
          if (!hasCategories) {
            return emptyState || null;
          }

          const attributes = {
            'data-testid': TestIds.faqCategories,
          };

          return (
            <div {...attributes} ref={ref}>
              {children}
            </div>
          );
        }}
      </CoreFaqCategories.Categories>
    );
  },
);

/**
 * Props for FaqCategories CategoryRepeater component
 */
export interface CategoryRepeaterProps {
  children: React.ReactNode;
  /** Optional FAQ configurations by category ID */
  faqConfigsByCategory?: Record<string, FaqServiceConfig>;
}

/**
 * Repeater component that renders FaqCategory.Root for each category.
 * Follows Repeater Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <FaqCategories.CategoryRepeater>
 *   <FaqCategory.Name />
 *   <FaqCategory.Faqs>
 *     <FaqCategory.FaqRepeater>
 *       <Faq.Name />
 *       <Faq.Answer />
 *     </FaqCategory.FaqRepeater>
 *   </FaqCategory.Faqs>
 * </FaqCategories.CategoryRepeater>
 *
 * // With FAQ configurations per category
 * <FaqCategories.CategoryRepeater faqConfigsByCategory={faqConfigsByCategory}>
 *   <FaqCategory.Name />
 *   <FaqCategory.Faqs>
 *     <FaqCategory.FaqRepeater>
 *       <Faq.Name />
 *       <Faq.Answer />
 *     </FaqCategory.FaqRepeater>
 *   </FaqCategory.Faqs>
 * </FaqCategories.CategoryRepeater>
 * ```
 */
export const CategoryRepeater = React.forwardRef<HTMLElement, CategoryRepeaterProps>(
  (props, _ref) => {
    const { children, faqConfigsByCategory } = props;

    return (
      <CoreFaqCategories.Categories>
        {({ hasCategories, categories }) => {
          if (!hasCategories) return null;

          return (
            <>
              {categories.map((category: FaqCategory) => (
                <FaqCategoryComponents.Root
                  key={category._id}
                  category={category}
                  faqConfig={faqConfigsByCategory?.[category._id || ''] || { faqs: [], categoryId: category._id }}
                  data-testid={TestIds.faqCategory}
                >
                  {children}
                </FaqCategoryComponents.Root>
              ))}
            </>
          );
        }}
      </CoreFaqCategories.Categories>
    );
  },
);
