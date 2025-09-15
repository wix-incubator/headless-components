import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { type FaqEntry } from '../services/index.js';
import * as CoreFaq from './core/Faq.js';

enum TestIds {
  // Entity Root
  faqRoot = 'faq-root',
  faqName = 'faq-name',
  faqAnswer = 'faq-answer',
}

/**
 * Props for Faq Root component
 */
export interface FaqRootProps {
  children: React.ReactNode;
  faq: FaqEntry;
}

/**
 * Root component that provides FAQ service context for rendering a single FAQ entry.
 * Follows the services pattern like Product.Root does.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Faq.Root faq={faqEntry}>
 *   <Faq.Name />
 *   <Faq.Answer />
 * </Faq.Root>
 * ```
 */
export function Root(props: FaqRootProps): React.ReactNode {
  const { children, faq, ...attrs } = props;

  const serviceConfig = {
    faqs: [faq],
    categoryId: faq.categoryId,
  };

  return (
    <CoreFaq.Root faqServiceConfig={serviceConfig}>
      <AsChildSlot
        {...attrs}
        data-testid={TestIds.faqRoot}
        data-faq-id={faq._id}
      >
        {children}
      </AsChildSlot>
    </CoreFaq.Root>
  );
}

/**
 * Props for Faq Name component
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ question: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the FAQ question/name.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Faq.Name className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <Faq.Name asChild>
 *   <h3 className="text-lg font-semibold" />
 * </Faq.Name>
 *
 * // asChild with react component
 * <Faq.Name asChild>
 *   {React.forwardRef(({question, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-semibold">
 *       Q: {question}
 *     </h3>
 *   ))}
 * </Faq.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreFaq.Name>
      {({ question }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.faqName}
            customElement={children}
            customElementProps={{ question }}
            content={question}
            {...otherProps}
          >
            <div>{question}</div>
          </AsChildSlot>
        );
      }}
    </CoreFaq.Name>
  );
});

/**
 * Props for Faq Item component
 */
export interface ItemProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ id: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * FAQ item wrapper component that provides access to the FAQ unique identifier.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Faq.Item className="faq-item" />
 *
 * // asChild with AccordionItem
 * <Faq.Item asChild>
 *   <AccordionItem className="border-b border-white/10 last:border-b-0" />
 * </Faq.Item>
 *
 * // asChild with custom render function
 * <Faq.Item asChild>
 *   {React.forwardRef(({id, ...props}, ref) => (
 *     <AccordionItem ref={ref} {...props} value={id}>
 *       {children}
 *     </AccordionItem>
 *   ))}
 * </Faq.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLElement, ItemProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreFaq.Item>
      {({ id }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.faqRoot}
            data-faq-id={id}
            customElement={children}
            customElementProps={{ id }}
            content={id}
            {...otherProps}
          >
            <div>{id}</div>
          </AsChildSlot>
        );
      }}
    </CoreFaq.Item>
  );
});

/**
 * Props for Faq Answer component
 */
export interface AnswerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ answer: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the FAQ answer.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Faq.Answer className="text-base text-content-secondary" />
 *
 * // asChild with primitive
 * <Faq.Answer asChild>
 *   <p className="text-base text-content-secondary" />
 * </Faq.Answer>
 *
 * // asChild with react component
 * <Faq.Answer asChild>
 *   {React.forwardRef(({answer, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-base text-content-secondary">
 *       A: {answer}
 *     </p>
 *   ))}
 * </Faq.Answer>
 * ```
 */
export const Answer = React.forwardRef<HTMLElement, AnswerProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreFaq.Answer>
        {({ answer }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.faqAnswer}
              customElement={children}
              customElementProps={{ answer }}
              content={answer}
              {...otherProps}
            >
              <div>{answer}</div>
            </AsChildSlot>
          );
        }}
      </CoreFaq.Answer>
    );
  },
);
