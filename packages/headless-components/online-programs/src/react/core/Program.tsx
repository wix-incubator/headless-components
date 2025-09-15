import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { instructors } from '@wix/online-programs';

import {
  ProgramServiceDefinition,
  ProgramServiceConfig,
  ProgramService,
} from '../../services/program-service.js';
import {
  InstructorsService,
  InstructorsServiceConfig,
  InstructorsServiceDefinition,
} from '../../services/instructors-service.js';

export interface RootProps {
  /** Child components that will have access to the Program service */
  children: React.ReactNode;
  /** Configuration for the Program service */
  programServiceConfig: ProgramServiceConfig;
}

/**
 * Root component that provides the Program service context to its children.
 * This component sets up the necessary services for rendering and managing a single program's data.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramPage() {
 *   return (
 *     <Program.Root
 *      programServiceConfig={{ program: myProgram }}
 *     >
 *       <div>
 *         <Program.Title>
 *           {({ title }) => (
 *             <h1
 *               className="text-4xl font-bold text-content-primary mb-4"
 *               data-testid="program-title"
 *             >
 *               {title}
 *             </h1>
 *           )}
 *         </Program.Title>
 *       </div>
 *     </Program.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProgramServiceDefinition,
        ProgramService,
        props.programServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for ProgramTitle headless component
 */
export interface ProgramTitleProps {
  /** Render prop function that receives program title data */
  children: (props: ProgramTitleRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramTitle component
 */
export interface ProgramTitleRenderProps {
  /** Program title */
  title: string;
}

/**
 * Headless component for program title display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramHeader() {
 *   return (
 *     <Program.Title>
 *       {({ title }) => (
 *         <h1>{title}</h1>
 *       )}
 *     </Program.Title>
 *   );
 * }
 * ```
 */
export function Title(props: ProgramTitleProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const title = program.description?.title || '';

  return props.children({
    title,
  });
}

/**
 * Props for ProgramImage headless component
 */
export interface ProgramImageProps {
  /** Render prop function that receives program image data */
  children: (props: ProgramImageRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramImage component
 */
export interface ProgramImageRenderProps {
  /** Program image URL */
  src: string;
  /** Program image alt text */
  alt: string;
}

/**
 * Headless component for program image display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramImage() {
 *   return (
 *     <Program.Image>
 *       {({ src, alt }) => (
 *         <img src={src} alt={alt} />
 *       )}
 *     </Program.Image>
 *   );
 * }
 * ```
 */
export function Image(props: ProgramImageProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const src = program.description?.image || '';
  const alt = program.description?.title || 'Program image';

  return props.children({
    src,
    alt,
  });
}

/**
 * Props for ProgramDurationInDays headless component
 */
export interface ProgramDurationInDaysProps {
  /** Render prop function that receives program duration data */
  children: (props: ProgramDurationInDaysRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramDurationInDays component
 */
export interface ProgramDurationInDaysRenderProps {
  /** Program duration in days, null if self-paced */
  durationInDays: number | null;
  /** Whether the program is self-paced (no time limit) */
  isSelfPaced: boolean;
}

/**
 * Headless component for program duration display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramDurationInDays() {
 *   return (
 *     <Program.DurationInDays>
 *       {({ durationInDays, isSelfPaced }) => (
 *         <p>
 *           {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
 *         </p>
 *       )}
 *     </Program.DurationInDays>
 *   );
 * }
 * ```
 */
export function DurationInDays(props: ProgramDurationInDaysProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();

  const timeline = program.timeline;
  const durationInDays = timeline?.durationInDays || null;
  const isSelfPaced = timeline?.selfPaced || false;

  return props.children({
    durationInDays,
    isSelfPaced,
  });
}

/**
 * Props for ProgramPrice headless component
 */
export interface ProgramPriceProps {
  /** Render prop function that receives program price data */
  children: (props: ProgramPriceRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramPrice component
 */
export interface ProgramPriceRenderProps {
  /** Program price */
  price: string | null;
  /** Combined price and currency */
  formattedPrice: string;
  /** Currency code */
  currency: string;
}

/**
 * Headless component for program price display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramPrice() {
 *   return (
 *     <Program.Price>
 *       {({ price, formattedPrice }) => (
 *         <div>
 *           {price ? (
 *             <span>{formattedPrice}</span>
 *           ) : (
 *             <span>Free</span>
 *           )}
 *         </div>
 *       )}
 *     </Program.Price>
 *   );
 * }
 * ```
 */
export function Price(props: ProgramPriceProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const price = program.price?.value || null;
  const currency = program.price?.currency || '';
  // TODO: use formatCurrency from stores
  const formattedPrice = price && currency ? `${price} ${currency}` : '';

  return props.children({
    price,
    formattedPrice,
    currency,
  });
}

/**
 * Props for ProgramDescription headless component
 */
export interface ProgramDescriptionProps {
  /** Render prop function that receives program description data */
  children: (props: ProgramDescriptionRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramDescription component
 */
export interface ProgramDescriptionRenderProps {
  /** Program description text */
  description: string;
}

/**
 * Headless component for program description display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramDescription() {
 *   return (
 *     <Program.Description>
 *       {({ description }) => (
 *         <p>{description}</p>
 *       )}
 *     </Program.Description>
 *   );
 * }
 * ```
 */
export function Description(props: ProgramDescriptionProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const description = program.description?.details || '';

  return props.children({
    description,
  });
}

/**
 * Props for ProgramStepCount headless component
 */
export interface ProgramStepCountProps {
  /** Render prop function that receives program steps count data */
  children: (props: ProgramStepCountRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramStepCount component
 */
export interface ProgramStepCountRenderProps {
  /** Number of steps in the program */
  stepCount: number;
}

/**
 * Headless component for program steps count display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramStepCount() {
 *   return (
 *     <Program.StepCount>
 *       {({ stepCount }) => (
 *         <p>{stepCount} Steps</p>
 *       )}
 *     </Program.StepCount>
 *   );
 * }
 * ```
 */
export function StepCount(props: ProgramStepCountProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const stepCount = program.contentSummary?.stepCount || 0;

  return props.children({
    stepCount,
  });
}

/**
 * Props for ProgramSectionCount headless component
 */
export interface ProgramSectionCountProps {
  /** Render prop function that receives program section count data */
  children: (props: ProgramSectionCountRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramSectionCount component
 */
export interface ProgramSectionCountRenderProps {
  /** Number of sections in the program */
  sectionCount: number;
}

/**
 * Headless component for program section count display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramSectionCount() {
 *   return (
 *     <Program.SectionCount>
 *       {({ sectionCount }) => (
 *         <p>{sectionCount} Sections</p>
 *       )}
 *     </Program.SectionCount>
 *   );
 * }
 * ```
 */
export function SectionCount(props: ProgramSectionCountProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const sectionCount = program.contentSummary?.sectionCount || 0;

  return props.children({
    sectionCount,
  });
}

/**
 * Props for ProgramInstructors headless component
 */
export interface ProgramInstructorsRootProps {
  /** Render prop function that receives instructors data */
  children: React.ReactNode;
  /** Optional instructors data to use instead of fetching */
  instructorsServiceConfig: InstructorsServiceConfig;
}

/**
 * Render props for ProgramInstructors component
 */
export interface ProgramInstructorsRenderProps {
  /** List of instructors */
  instructors: instructors.Instructor[];
  /** Whether there are instructors */
  hasInstructors: boolean;
}

/**
 * Props for ProgramInstructors headless component
 */
export interface ProgramInstructorsProps {
  /** Render prop function that receives instructors data */
  children: (props: ProgramInstructorsRenderProps) => React.ReactNode;
  /** Optional instructors data to use instead of fetching */
  instructorsServiceConfig?: InstructorsServiceConfig;
}
export function Instructors(props: ProgramInstructorsProps) {
  const instructors = props.instructorsServiceConfig?.instructors || [];
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        InstructorsServiceDefinition,
        InstructorsService,
        props.instructorsServiceConfig,
      )}
    >
      {props.children({
        instructors,
        hasInstructors: instructors.length > 0,
      })}
    </WixServices>
  );
}
