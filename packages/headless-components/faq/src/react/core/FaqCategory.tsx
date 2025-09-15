import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  FaqServiceDefinition,
  FaqService,
  type FaqServiceConfig,
  type FaqCategory,
  type FaqEntry,
} from '../../services/index.js';

export interface RootProps {
  children: React.ReactNode;
  faqServiceConfig: FaqServiceConfig;
}

/**
 * Root component that provides the FAQ service context to its children for a category's FAQs.
 * This component sets up the necessary services for rendering and managing FAQ entries within a category.
 *
 * @component
 * @example
 * ```tsx
 * import { FaqCategory } from '@wix/faq/components';
 *
 * function FaqCategoryPage() {
 *   return (
 *     <FaqCategory.Root faqServiceConfig={{ faqs: categoryFaqs, categoryId: 'cat-1' }}>
 *       <FaqCategory.Faqs>
 *         {({ hasFaqs, faqs }) => (
 *           <div>{hasFaqs ? `${faqs.length} FAQs` : 'No FAQs'}</div>
 *         )}
 *       </FaqCategory.Faqs>
 *     </FaqCategory.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        FaqServiceDefinition,
        FaqService,
        props.faqServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for FaqCategoryFaqs headless component
 */
export interface FaqCategoryFaqsProps {
  /** Render prop function that receives FAQ data */
  children: (props: FaqCategoryFaqsRenderProps) => React.ReactNode;
}

/**
 * Render props for FaqCategoryFaqs component
 */
export interface FaqCategoryFaqsRenderProps {
  /** Whether there are FAQs to display */
  hasFaqs: boolean;
  /** Array of FAQ entries */
  faqs: FaqEntry[];
}

/**
 * Headless component for FAQ category's FAQs list display
 *
 * @component
 * @example
 * ```tsx
 * import { FaqCategory } from '@wix/faq/components';
 *
 * function FaqCategoryFaqsList() {
 *   return (
 *     <FaqCategory.Faqs>
 *       {({ hasFaqs, faqs }) => (
 *         <div>
 *           {hasFaqs ? (
 *             <ul>
 *               {faqs.map(faq => (
 *                 <li key={faq._id}>{faq.question}</li>
 *               ))}
 *             </ul>
 *           ) : (
 *             <p>No FAQs found</p>
 *           )}
 *         </div>
 *       )}
 *     </FaqCategory.Faqs>
 *   );
 * }
 * ```
 */
export function Faqs(props: FaqCategoryFaqsProps) {
  const service = useService(FaqServiceDefinition) as ServiceAPI<
    typeof FaqServiceDefinition
  >;

  const faqs = service.faqs.get();
  const hasFaqs = faqs.length > 0;

  return props.children({
    hasFaqs,
    faqs,
  });
}
