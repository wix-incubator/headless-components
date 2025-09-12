import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { instructors } from '@wix/online-programs';

import {
  ProgramServiceDefinition,
  ProgramServiceConfig,
  ProgramService,
} from '../../services/program-service.js';
import { InstructorsService, InstructorsServiceConfig, InstructorsServiceDefinition } from '../../services/instructors-service.js';

export interface RootProps {
  /** Child components that will have access to the Program service */
  children: React.ReactNode;
  /** Configuration for the Program service */
  programServiceConfig: ProgramServiceConfig;
  /** Configuration for the Instructors service */
  instructorsServiceConfig: InstructorsServiceConfig;
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
 *      instructorsServiceConfig={{ instructors: myInstructors }}
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
      )
      .addService(
        InstructorsServiceDefinition,
        InstructorsService,
        props.instructorsServiceConfig,
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
 * Props for ProgramInstructors headless component
 */
export interface ProgramInstructorsProps {
  /** Render prop function that receives instructors data */
  children: (props: ProgramInstructorsRenderProps) => React.ReactNode;
  /** Optional instructors data to use instead of fetching */
  instructors?: instructors.Instructor[];
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
 * Headless component for program instructors display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramInstructors() {
 *   return (
 *     <Program.Instructors>
 *       {({ instructors, hasInstructors }) => (
 *         <div>
 *           {hasInstructors ? (
 *             instructors.map(instructor => (
 *               <div key={instructor._id}>{instructor.name}</div>
 *             ))
 *           ) : (
 *             <div>No instructors</div>
 *           )}
 *         </div>
 *       )}
 *     </Program.Instructors>
 *   );
 * }
 * ```
 */
export function Instructors(props: ProgramInstructorsProps) {
  const providedInstructors = props.instructors || [];
  return props.children({
    instructors: providedInstructors,
    hasInstructors: providedInstructors?.length > 0,
  });
}
