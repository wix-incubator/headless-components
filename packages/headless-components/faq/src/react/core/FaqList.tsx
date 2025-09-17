import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  FaqServiceDefinition,
  FaqService,
  type FaqServiceConfig,
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
 * import { FaqList } from '@wix/faq/components';
 *
 * function FaqListPage() {
 *   return (
 *     <FaqList.Root faqServiceConfig={{ faqs: categoryFaqs, categoryId: 'cat-1' }}>
 *       <FaqList.Items>
 *         {({ hasFaqs, faqs }) => (
 *           <div>{hasFaqs ? `${faqs.length} FAQs` : 'No FAQs'}</div>
 *         )}
 *       </FaqList.Items>
 *     </FaqList.Root>
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
 * Props for FaqListFaqs headless component
 */
export interface FaqListFaqsProps {
  /** Render prop function that receives FAQ data */
  children: (props: FaqListFaqsRenderProps) => React.ReactNode;
}

/**
 * Render props for FaqListFaqs component
 */
export interface FaqListFaqsRenderProps {
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
 * import { FaqList } from '@wix/faq/components';
 *
 * function FaqsListItems() {
 *   return (
 *     <FaqList.Items>
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
 *     </FaqList.Items>
 *   );
 * }
 * ```
 */
export function Items(props: FaqListFaqsProps) {
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
