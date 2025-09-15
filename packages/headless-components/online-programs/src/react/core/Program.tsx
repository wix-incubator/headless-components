import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { programs, instructors } from '@wix/online-programs';

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
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramPage() {
 *  return (
 *    <Program.Root programServiceConfig={{ program: myProgram }}>
 *      <Program.Title />
 *    </Program.Root>
 *  );
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
 * Props for Program.Raw headless component
 */
export interface ProgramRawProps {
  /** Render prop function that receives program data */
  children: (props: ProgramRawRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.Raw component
 */
export interface ProgramRawRenderProps {
  /** Complete program data */
  program: programs.Program;
}

/**
 * Headless component that provides access to the complete program data
 *
 * @component
 * @example
 * ```tsx
 * <Program.Root programServiceConfig={{ program: myProgram }}>
 *  <Program.Raw asChild>
 *    {({ program }) => (
 *      <div>
 *        <p>Program ID: {program._id}</p>
 *        <p>Title: {program.description?.title}</p>
 *      </div>
 *    )}
 *  </Program.Raw>
 * </Program.Root>
 * ```
 */
export function Raw(props: ProgramRawProps) {
  const service = useService(ProgramServiceDefinition);

  const program = service.program.get();

  return props.children({
    program,
  });
}

/**
 * Props for Program.Title headless component
 */
export interface ProgramTitleProps {
  /** Render prop function that receives program title data */
  children: (props: ProgramTitleRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.Title component
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
 *  <Program.Title asChild>
 *    {({ title }) => (
 *      <h1>{title}</h1>
 *    )}
 *  </Program.Title>
 * ```
 */
export function Title(props: ProgramTitleProps) {
  const service = useService(ProgramServiceDefinition);

  const program = service.program.get();
  const title = program.description?.title || '';

  return props.children({
    title,
  });
}

/**
 * Props for Program.Description headless component
 */
export interface ProgramDescriptionProps {
  /** Render prop function that receives program description data */
  children: (props: ProgramDescriptionRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.Description component
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
 * <Program.Description>
 *  {({ description }) => (
 *    <p>{description}</p>
 *  )}
 * </Program.Description>
 * ```
 */
export function Description(props: ProgramDescriptionProps) {
  const service = useService(ProgramServiceDefinition);

  const program = service.program.get();
  const description = program.description?.details || '';

  return props.children({
    description,
  });
}

/**
 * Props for Program.Image headless component
 */
export interface ProgramImageProps {
  /** Render prop function that receives program image data */
  children: (props: ProgramImageRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.Image component
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
 * <Program.Image asChild>
 *  {({ src, alt }) => (
 *    <img src={src} alt={alt} />
 *  )}
 * </Program.Image>
 * ```
 */
export function Image(props: ProgramImageProps) {
  const service = useService(ProgramServiceDefinition);

  const program = service.program.get();

  const src = program.description?.image || '';
  const alt = program.description?.title || '';

  return props.children({
    src,
    alt,
  });
}

/**
 * Props for Program.DurationInDays headless component
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
 * <Program.DurationInDays asChild>
 *  {({ durationInDays, isSelfPaced }) => (
 *    <p>
 *      {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
 *    </p>
 *  )}
 * </Program.DurationInDays>
 * ```
 */
export function DurationInDays(props: ProgramDurationInDaysProps) {
  const service = useService(ProgramServiceDefinition);

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
 * Props for Program.Price headless component
 */
export interface ProgramPriceProps {
  /** Render prop function that receives program price data */
  children: (props: ProgramPriceRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.Price component
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
 * <Program.Price asChild>
 *  {({ price, formattedPrice }) => (
 *    <div>
 *      {price ? (
 *        <span>{formattedPrice}</span>
 *      ) : (
 *        <span>Free</span>
 *      )}
 *    </div>
 *  )}
 * </Program.Price>
 * ```
 */
export function Price(props: ProgramPriceProps) {
  const service = useService(ProgramServiceDefinition);

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
 * Props for Program.StepCount headless component
 */
export interface ProgramStepCountProps {
  /** Render prop function that receives program steps count data */
  children: (props: ProgramStepCountRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.StepCount component
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
 * <Program.StepCount asChild>
 *  {({ stepCount }) => (
 *    <p>{stepCount} Steps</p>
 *  )}
 * </Program.StepCount>
 * ```
 */
export function StepCount(props: ProgramStepCountProps) {
  const service = useService(ProgramServiceDefinition);

  const program = service.program.get();

  const stepCount = program.contentSummary?.stepCount || 0;

  return props.children({
    stepCount,
  });
}

/**
 * Props for Program.SectionCount headless component
 */
export interface ProgramSectionCountProps {
  /** Render prop function that receives program section count data */
  children: (props: ProgramSectionCountRenderProps) => React.ReactNode;
}

/**
 * Render props for Program.SectionCount component
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
 * <Program.SectionCount asChild>
 *  {({ sectionCount }) => (
 *    <p>{sectionCount} Sections</p>
 *  )}
 * </Program.SectionCount>
 * ```
 */
export function SectionCount(props: ProgramSectionCountProps) {
  const service = useService(ProgramServiceDefinition);

  const program = service.program.get();

  const sectionCount = program.contentSummary?.sectionCount || 0;

  return props.children({
    sectionCount,
  });
}

/**
 * Props for ProgramInstructors headless component
 */
export interface ProgramInstructorsProps {
  /** Render prop function that receives instructors data */
  children:
    | React.ReactNode
    | ((props: ProgramInstructorsRenderProps) => React.ReactNode);
  /** Optional instructors data to use instead of fetching */
  instructorsServiceConfig?: InstructorsServiceConfig;
}

/**
 * Render props for ProgramInstructors component
 */
export interface ProgramInstructorsRenderProps {
  /** List of instructors */
  instructors: instructors.Instructor[];
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
      {typeof props.children === 'function'
        ? props.children({
            instructors,
          })
        : props.children}
    </WixServices>
  );
}
