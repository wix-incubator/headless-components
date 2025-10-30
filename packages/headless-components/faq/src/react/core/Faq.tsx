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
 * Root component that provides the FAQ service context to its children.
 * This component sets up the necessary services for rendering and managing a single FAQ entry's data.
 *
 * @component
 * @example
 * ```tsx
 * import { Faq } from '@wix/faq/components';
 *
 * function FaqPage() {
 *   return (
 *     <Faq.Root faqServiceConfig={{ faqs: [myFaq], categoryId: 'cat-1' }}>
 *       <Faq.Name>
 *         {({ question }) => (
 *           <h1 className="text-4xl font-bold">{question}</h1>
 *         )}
 *       </Faq.Name>
 *     </Faq.Root>
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
 * Props for FaqName headless component
 */
export interface FaqNameProps {
  /** Render prop function that receives FAQ question data */
  children: (props: FaqNameRenderProps) => React.ReactNode;
}

/**
 * Render props for FaqName component
 */
export interface FaqNameRenderProps {
  /** FAQ question */
  question: string;
}

/**
 * Headless component for FAQ question display
 *
 * @component
 * @example
 * ```tsx
 * import { Faq } from '@wix/faq/components';
 *
 * function FaqHeader() {
 *   return (
 *     <Faq.Name>
 *       {({ question }) => (
 *         <h1>{question}</h1>
 *       )}
 *     </Faq.Name>
 *   );
 * }
 * ```
 */
export function Name(props: FaqNameProps) {
  const service = useService(FaqServiceDefinition) as ServiceAPI<
    typeof FaqServiceDefinition
  >;

  const faqs = service.faqs.get();
  const faq = faqs[0]; // For single FAQ display, take the first FAQ
  const question = faq?.question || '';

  return props.children({
    question,
  });
}

/**
 * Props for FaqItem headless component
 */
export interface FaqItemProps {
  /** Render prop function that receives FAQ item data */
  children: (props: FaqItemRenderProps) => React.ReactNode;
}

/**
 * Render props for FaqItem component
 */
export interface FaqItemRenderProps {
  /** FAQ unique identifier */
  id: string;
}

/**
 * Headless component for FAQ item wrapper
 *
 * @component
 * @example
 * ```tsx
 * import { Faq } from '@wix/faq/components';
 *
 * function FaqItem() {
 *   return (
 *     <Faq.Item>
 *       {({ id }) => (
 *         <AccordionItem value={id}>
 *           {children}
 *         </AccordionItem>
 *       )}
 *     </Faq.Item>
 *   );
 * }
 * ```
 */
export function Item(props: FaqItemProps) {
  const service = useService(FaqServiceDefinition) as ServiceAPI<
    typeof FaqServiceDefinition
  >;

  const faqs = service.faqs.get();
  const faq = faqs[0]; // For single FAQ display, take the first FAQ
  const id = faq?._id || `faq-${Math.random()}`;

  return props.children({
    id,
  });
}

/**
 * Props for FaqAnswer headless component
 */
export interface FaqAnswerProps {
  /** Render prop function that receives FAQ answer data */
  children: (props: FaqAnswerRenderProps) => React.ReactNode;
}

/**
 * Render props for FaqAnswer component
 */
export interface FaqAnswerRenderProps {
  /** FAQ answer */
  answer: string;
}

/**
 * Headless component for FAQ answer display
 *
 * @component
 * @example
 * ```tsx
 * import { Faq } from '@wix/faq/components';
 *
 * function FaqContent() {
 *   return (
 *     <Faq.Answer>
 *       {({ answer }) => (
 *         <p>{answer}</p>
 *       )}
 *     </Faq.Answer>
 *   );
 * }
 * ```
 */
export function Answer(props: FaqAnswerProps) {
  const service = useService(FaqServiceDefinition) as ServiceAPI<
    typeof FaqServiceDefinition
  >;

  const faqs = service.faqs.get();
  const faq = faqs[0]; // For single FAQ display, take the first FAQ
  const answer = faq?.plainText || faq?.draftjs || '';

  return props.children({
    answer,
  });
}
