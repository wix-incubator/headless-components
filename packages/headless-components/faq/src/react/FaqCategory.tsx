import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import {
  type FaqServiceConfig,
  type FaqCategory,
  type FaqEntry,
  FaqServiceDefinition,
} from '../services/index.js';
import * as CoreFaqCategory from './core/FaqCategory.js';
import * as Faq from './Faq.js';

enum TestIds {
  // Entity Root
  faqCategoryRoot = 'faq-category-root',
  faqCategoryName = 'faq-category-name',

  // List Container Level
  faqCategoryFaqs = 'faq-category-faqs',

  // Repeater Level (individual items)
  faqCategoryFaq = 'faq-category-faq',
}

/**
 * Props for FaqCategory Root component
 */
export interface FaqCategoryRootProps {
  children: React.ReactNode;
  category: FaqCategory;
  className?: string;
  /** FAQ service config for this category's FAQs */
  faqConfig?: FaqServiceConfig;
}

/**
 * Root component that provides service context for a FAQ category and its FAQs.
 * Automatically loads FAQs for the category.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <FaqCategory.Root category={category}>
 *   <FaqCategory.Name />
 *   <FaqCategory.Faqs>
 *     <FaqCategory.FaqRepeater>
 *       <Faq.Name />
 *       <Faq.Answer />
 *     </FaqCategory.FaqRepeater>
 *   </FaqCategory.Faqs>
 * </FaqCategory.Root>
 * ```
 */
export function Root(props: FaqCategoryRootProps): React.ReactNode {
  const { children, category, className, faqConfig, ...attrs } = props;

  // Default FAQ config for this category
  const defaultFaqConfig: FaqServiceConfig = React.useMemo(
    () =>
      faqConfig || {
        faqs: [],
        categoryId: category._id,
      },
    [faqConfig, category._id],
  );

  return (
    <CoreFaqCategory.Root faqServiceConfig={defaultFaqConfig}>
      <div
        {...attrs}
        className={className}
        data-testid={TestIds.faqCategoryRoot}
        data-category-id={category._id}
        data-category-name={category.title}
      >
        <CategoryContext category={category}>{children}</CategoryContext>
      </div>
    </CoreFaqCategory.Root>
  );
}

/**
 * Internal context to provide category data without using React Context for FAQ data
 */
interface CategoryContextProps {
  category: FaqCategory;
  children: React.ReactNode;
}

const CategoryDataContext = React.createContext<FaqCategory | null>(null);

function CategoryContext({ category, children }: CategoryContextProps) {
  return (
    <CategoryDataContext.Provider value={category}>
      {children}
    </CategoryDataContext.Provider>
  );
}

function useCategoryData(): FaqCategory {
  const category = React.useContext(CategoryDataContext);
  if (!category) {
    throw new Error(
      'useCategoryData must be used within a FaqCategory.Root component',
    );
  }
  return category;
}

/**
 * Props for FaqCategory Name component
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the FAQ category name.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <FaqCategory.Name className="text-2xl font-bold" />
 *
 * // asChild with primitive
 * <FaqCategory.Name asChild>
 *   <h2 className="text-2xl font-bold" />
 * </FaqCategory.Name>
 *
 * // asChild with react component
 * <FaqCategory.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h2 ref={ref} {...props} className="text-2xl font-bold">
 *       {name}
 *     </h2>
 *   ))}
 * </FaqCategory.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const category = useCategoryData();

  const name = category.title || '';

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.faqCategoryName}
      customElement={children}
      customElementProps={{ name }}
      content={name}
      {...otherProps}
    >
      <div>{name}</div>
    </AsChildSlot>
  );
});

/**
 * Props for FaqCategory Faqs component
 */
export interface FaqsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for the list of FAQs with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <FaqCategory.Faqs emptyState={<div>No FAQs available</div>}>
 *   <FaqCategory.FaqRepeater>
 *     <Faq.Name />
 *     <Faq.Answer />
 *   </FaqCategory.FaqRepeater>
 * </FaqCategory.Faqs>
 *
 * // Simple container usage
 * <FaqCategory.Faqs emptyState={<div>No FAQs</div>}>
 *   <div className="faqs-container">
 *     <FaqCategory.FaqRepeater>
 *       <Faq.Name />
 *       <Faq.Answer />
 *     </FaqCategory.FaqRepeater>
 *   </div>
 * </FaqCategory.Faqs>
 * ```
 */
export const Faqs = React.forwardRef<HTMLDivElement, FaqsProps>(
  (props, ref) => {
    const { children, emptyState } = props;

    return (
      <CoreFaqCategory.Faqs>
        {({ hasFaqs, faqs }) => {
          if (!hasFaqs) {
            return emptyState || null;
          }

          const attributes = {
            'data-testid': TestIds.faqCategoryFaqs,
          };

          return (
            <div {...attributes} ref={ref}>
              {children}
            </div>
          );
        }}
      </CoreFaqCategory.Faqs>
    );
  },
);

/**
 * Props for FaqCategory FaqRepeater component
 */
export interface FaqRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Faq.Root for each FAQ entry.
 * Follows Repeater Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <FaqCategory.FaqRepeater>
 *   <Faq.Name />
 *   <Faq.Answer />
 * </FaqCategory.FaqRepeater>
 * ```
 */
export const FaqRepeater = React.forwardRef<HTMLElement, FaqRepeaterProps>(
  (props, _ref) => {
    const { children } = props;

    return (
      <CoreFaqCategory.Faqs>
        {({ hasFaqs, faqs }) => {
          if (!hasFaqs) return null;
          console.log('faqs in FaqRepeater', faqs);

          return (
            <>
              {faqs.map((faq: FaqEntry) => (
                <Faq.Root
                  key={faq._id}
                  faq={faq}
                  data-testid={TestIds.faqCategoryFaq}
                >
                  {children}
                </Faq.Root>
              ))}
            </>
          );
        }}
      </CoreFaqCategory.Faqs>
    );
  },
);
