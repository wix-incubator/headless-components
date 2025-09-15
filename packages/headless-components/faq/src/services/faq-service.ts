import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { questionEntry } from '@wix/faq';
// Enhanced FAQ question entry interface based on the actual API structure
export interface FaqEntry {
  _id?: string | null;
  question?: string | null;
  plainText?: string | null;
  draftjs?: string | null;
  categoryId?: string | null;
  sortOrder?: number | null;
  labels?: string[];
  visible?: boolean;
}

/**
 * Configuration interface for the FAQ service.
 * Contains FAQ entry data for a specific category.
 *
 * @interface FaqServiceConfig
 */
export type FaqServiceConfig = {
  /** Array of FAQ entry objects for a category */
  faqs: FaqEntry[];
  /** Category ID these FAQs belong to */
  categoryId?: string | null;
};

/**
 * Service definition for the FAQ service.
 * This defines the reactive API contract for managing FAQ entries within a category.
 *
 * @constant
 */
export const FaqServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of FAQ entries */
    faqs: Signal<FaqEntry[]>;
    /** Reactive signal indicating if FAQs are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
    /** Reactive signal indicating if there are FAQs to display */
    hasFaqs: Signal<boolean>;
    /** Category ID these FAQs belong to */
    categoryId: Signal<string | null | undefined>;
  },
  FaqServiceConfig
>('faq');

/**
 * Implementation of the FAQ service that manages reactive FAQ entries data.
 * This service provides signals for FAQ data, loading state, and error handling.
 * The service is initialized with pre-loaded FAQ entries and maintains them in reactive signals.
 *
 * @example
 * ```tsx
 * import { FaqService, FaqServiceDefinition } from '@wix/faq/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function FaqComponent({ faqConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [FaqServiceDefinition, FaqService.withConfig(faqConfig)]
 *     ])}>
 *       <FaqDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function FaqDisplay() {
 *   const faqService = useService(FaqServiceDefinition);
 *   const faqs = faqService.faqs.get();
 *   const isLoading = faqService.isLoading.get();
 *   const error = faqService.error.get();
 *   const hasFaqs = faqService.hasFaqs.get();
 *
 *   if (isLoading) return <div>Loading FAQs...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!hasFaqs) return <div>No FAQs found.</div>;
 *
 *   return (
 *     <ul>
 *       {faqs.map(faq => (
 *         <li key={faq._id}>
 *           <h3>{faq.question}</h3>
 *           <p>{faq.answer}</p>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const FaqService = implementService.withConfig<FaqServiceConfig>()(
  FaqServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const faqsSignal = signalsService.signal<FaqEntry[]>(config.faqs);
    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);
    const hasFaqsSignal = signalsService.signal<boolean>(
      config.faqs.length > 0,
    );
    const categoryIdSignal = signalsService.signal<string | null | undefined>(
      config.categoryId,
    );

    return {
      faqs: faqsSignal,
      isLoading: isLoadingSignal,
      error: errorSignal,
      hasFaqs: hasFaqsSignal,
      categoryId: categoryIdSignal,
    };
  },
);

/**
 * Loads FAQ service configuration from the Wix FAQ API for a specific category for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * FAQ entries for a specific category.
 *
 * @param categoryId - The ID of the category to load FAQs for
 * @returns {Promise<FaqServiceConfig>} Promise that resolves to the FAQ configuration
 *
 * @example
 * ```tsx
 * // Load FAQ data for a specific category during SSR
 * const faqConfig = await loadFaqServiceConfig('category-id');
 * ```
 */
export async function loadFaqServiceConfig(
  categoryId?: string,
): Promise<FaqServiceConfig> {
  try {
    // Use query-based approach like the reference
    let questionQuery = questionEntry.queryQuestionEntries({contentFormat: questionEntry.QueryQuestionEntriesRequestContentFormat.PLAIN_TEXT});

    // Filter by category if specified
    if (categoryId) {
      questionQuery = questionQuery.eq('categoryId', categoryId);
    }

    const questionResult = await questionQuery.find();
    const rawFaqs = questionResult.items || [];

    // Transform and sort by sort order
    const transformedFaqs: FaqEntry[] = rawFaqs
      .map(q => ({
        _id: q._id,
        question: q.question,
        plainText: q.plainText,
        draftjs: q.draftjs,
        categoryId: q.categoryId,
        sortOrder: q.sortOrder,
        labels: q.labels?.map((label: any) => label.title || '').filter(Boolean) || [],
        visible: true, // Default to visible
      }))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return {
      faqs: transformedFaqs,
      categoryId,
    };
  } catch (error) {
    console.warn(`Failed to load FAQ entries for category ${categoryId}:`, error);
    // Return empty FAQs in case of error - graceful fallback
    return {
      faqs: [],
      categoryId,
    };
  }
}

/**
 * Loads all FAQ entries grouped by category for SSR initialization.
 * This function is useful when you want to preload all FAQ data at once.
 *
 * @returns {Promise<Record<string, FaqEntry[]>>} Promise that resolves to FAQs grouped by category ID
 *
 * @example
 * ```tsx
 * // Load all FAQ data grouped by category during SSR
 * const allFaqsByCategory = await loadAllFaqsByCategory();
 * ```
 */
export async function loadAllFaqsByCategory(): Promise<
  Record<string, FaqEntry[]>
> {
  try {
    // Use query-based approach
    let questionQuery = questionEntry.queryQuestionEntries({contentFormat: questionEntry.QueryQuestionEntriesRequestContentFormat.PLAIN_TEXT});
    const questionResult = await questionQuery.find();
    const rawFaqs = questionResult.items || [];

    // Transform questions
    const allQuestions: FaqEntry[] = rawFaqs.map(q => ({
      _id: q._id,
      question: q.question,
      plainText: q.plainText,
      draftjs: q.draftjs,
      categoryId: q.categoryId,
      sortOrder: q.sortOrder,
      labels: q.labels?.map((label: any) => label.title || '').filter(Boolean) || [],
      visible: true, // Default to visible
    }));

    // Group questions by category and sort within each category
    const faqsByCategory: Record<string, FaqEntry[]> = {};
    allQuestions.forEach(faq => {
      const categoryId = faq.categoryId || 'uncategorized';
      if (!faqsByCategory[categoryId]) {
        faqsByCategory[categoryId] = [];
      }
      faqsByCategory[categoryId].push(faq);
    });

    // Sort questions within each category
    Object.keys(faqsByCategory).forEach(categoryId => {
      faqsByCategory[categoryId].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    });

    return faqsByCategory;
  } catch (error) {
    console.warn('Failed to load all FAQs by category:', error);
    // Return empty object in case of error - graceful fallback
    return {};
  }
}
