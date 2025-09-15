import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import {
  type FaqServiceConfig,
  type FaqCategory,
  type FaqEntry,
} from '../services/index.js';
import * as CoreFaqList from './core/FaqList.js';
import * as Faq from './Faq.js';

enum TestIds {
  // Entity Root
  faqListRoot = 'faq-list-root',
  faqListName = 'faq-list-name',

  // List Container Level
  faqListFaqs = 'faq-list-faqs',

  // Repeater Level (individual items)
  faqListFaq = 'faq-list-faq',
}

/**
 * Props for FaqList Root component
 */
export interface FaqListRootProps {
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
 * <FaqList.Root category={category}>
 *   <FaqList.Name />
 *   <FaqList.Faqs>
 *     <FaqList.FaqRepeater>
 *       <Faq.Name />
 *       <Faq.Answer />
 *     </FaqList.FaqRepeater>
 *   </FaqList.Faqs>
 * </FaqList.Root>
 * ```
 */
export function Root(props: FaqListRootProps): React.ReactNode {
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
    <CoreFaqList.Root faqServiceConfig={defaultFaqConfig}>
      <CategoryContext category={category}>
        <div
          {...attrs}
          className={className}
          data-testid={TestIds.faqListRoot}
          data-category-id={category._id}
          data-category-name={category.title}
        >
          {children}
        </div>
      </CategoryContext>
    </CoreFaqList.Root>
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
      'useCategoryData must be used within a FaqList.Root component',
    );
  }
  return category;
}

/**
 * Props for FaqList Name component
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
 * <FaqList.Name className="text-2xl font-bold" />
 *
 * // asChild with primitive
 * <FaqList.Name asChild>
 *   <h2 className="text-2xl font-bold" />
 * </FaqList.Name>
 *
 * // asChild with react component
 * <FaqList.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h2 ref={ref} {...props} className="text-2xl font-bold">
 *       {name}
 *     </h2>
 *   ))}
 * </FaqList.Name>
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
      data-testid={TestIds.faqListName}
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
 * Props for FaqList Faqs component
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
 * <FaqList.Faqs emptyState={<div>No FAQs available</div>}>
 *   <FaqList.FaqRepeater>
 *     <Faq.Name />
 *     <Faq.Answer />
 *   </FaqList.FaqRepeater>
 * </FaqList.Faqs>
 *
 * // Simple container usage
 * <FaqList.Faqs emptyState={<div>No FAQs</div>}>
 *   <div className="faqs-container">
 *     <FaqList.FaqRepeater>
 *       <Faq.Name />
 *       <Faq.Answer />
 *     </FaqList.FaqRepeater>
 *   </div>
 * </FaqList.Faqs>
 * ```
 */
export const Faqs = React.forwardRef<HTMLDivElement, FaqsProps>(
  (props, ref) => {
    const { children, emptyState } = props;

    return (
      <CoreFaqList.Items>
        {({ hasFaqs, faqs }) => {
          if (!hasFaqs) {
            return emptyState || null;
          }

          const attributes = {
            'data-testid': TestIds.faqListFaqs,
          };

          return (
            <div {...attributes} ref={ref}>
              {children}
            </div>
          );
        }}
      </CoreFaqList.Items>
    );
  },
);

/**
 * Props for FaqList FaqRepeater component
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
 * <FaqList.FaqRepeater>
 *   <Faq.Name />
 *   <Faq.Answer />
 * </FaqList.FaqRepeater>
 * ```
 */
export const FaqRepeater = React.forwardRef<HTMLElement, FaqRepeaterProps>(
  (props, _ref) => {
    const { children } = props;

    return (
      <CoreFaqList.Items>
        {({ hasFaqs, faqs }) => {
          if (!hasFaqs) return null;

          return (
            <>
              {faqs.map((faq: FaqEntry) => (
                <Faq.Root
                  key={faq._id}
                  faq={faq}
                  data-testid={TestIds.faqListFaq}
                >
                  {children}
                </Faq.Root>
              ))}
            </>
          );
        }}
      </CoreFaqList.Items>
    );
  },
);
