import React from 'react';
import { programs, instructors } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { WixMediaImage } from '@wix/headless-media/react';

import * as CoreProgram from './core/Program.js';
import { Instructor } from './Instructor.js';
import { InstructorsServiceDefinition } from '../services/instructors-service.js';
import { useService } from '@wix/services-manager-react';

enum TestIds {
  programTitle = 'program-title',
  programImage = 'program-image',
  programDuration = 'program-duration',
  programDescription = 'program-description',
  programPrice = 'program-price',
  programStepCount = 'program-step-count',
  programSectionCount = 'program-section-count',
  programInstructors = 'program-instructors',
  programInstructorRepeater = 'program-instructor-repeater',
}

/**
 * Props for the Program root component following the documented API
 */
interface ProgramRootProps {
  children: React.ReactNode;
  program: programs.Program;
}

/**
 * Root component that provides all necessary service contexts for a complete program experience.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramPage({ program }) {
 *   return (
 *     <Program.Root program={program}>
 *       <Program.Title className="text-4xl font-bold" />
 *     </Program.Root>
 *   );
 * }
 * ```
 */
function Root(props: ProgramRootProps): React.ReactNode {
  const { children, program, ...attrs } = props;

  return (
    <CoreProgram.Root programServiceConfig={{ program }}>
      <AsChildSlot {...attrs}>{children}</AsChildSlot>
    </CoreProgram.Root>
  );
}

/**
 * Props for Program Title component
 */
interface TitleProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ title: string }>;
}

/**
 * Displays the program title with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Title className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Program.Title asChild>
 *   <h1 className="text-4xl font-bold" />
 * </Program.Title>
 *
 * // asChild with react component
 * <Program.Title asChild>
 *   {React.forwardRef(({ title, ...props }, ref) => (
 *     <h1 ref={ref} { ...props } className="text-4xl font-bold">
 *       {title}
 *     </h1>
 *   ))}
 * </Program.Title>
 * ```
 */
const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;

  return (
    <CoreProgram.Title>
      {({ title }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            data-testid={TestIds.programTitle}
            customElement={children}
            customElementProps={{ title }}
            content={title}
            {...otherProps}
          >
            <h1>{title}</h1>
          </AsChildSlot>
        );
      }}
    </CoreProgram.Title>
  );
});

Title.displayName = 'Program.Title';

/**
 * Props for Program Image component
 */
interface ImageProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ src: string; alt: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the program image using WixMediaImage for optimization.
 * Supports custom rendering via asChild pattern with specific src/alt props.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with WixMediaImage
 * <Program.Image className="w-full h-48 object-cover rounded-lg" />
 *
 * // Custom rendering with specific props
 * <Program.Image asChild>
 *   {React.forwardRef(({ src, alt }, ref) => (
 *     <img
 *       ref={ref}
 *       src={src}
 *       alt={alt}
 *       className="w-full h-48 object-cover rounded-lg custom-image"
 *     />
 *   ))}
 * </Program.Image>
 * ```
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.Image>
        {({ src, alt }) => {
          if (asChild && children) {
            // Call the ForwardRefRenderFunction with the specific props
            return children({ src, alt }, ref);
          }

          return (
            <WixMediaImage
              ref={ref}
              media={{ image: src }}
              alt={alt}
              data-testid={TestIds.programImage}
              {...otherProps}
            />
          );
        }}
      </CoreProgram.Image>
    );
  },
);

Image.displayName = 'Program.Image';

/**
 * Props for Program DurationInDays component
 */
interface DurationInDaysProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ durationInDays: number | null; isSelfPaced: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the program duration in days with customizable rendering.
 * Data source: program.timeline field. If the program is self-paced, duration has no limit.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.DurationInDays className="text-content-secondary" />
 *
 * // asChild with primitive
 * <Program.DurationInDays asChild>
 *   <p className="text-content-secondary" />
 * </Program.DurationInDays>
 *
 * // Custom rendering with format
 * <Program.DurationInDays asChild>
 *   {React.forwardRef(({ durationInDays, isSelfPaced, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-content-secondary">
 *       {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
 *     </p>
 *   ))}
 * </Program.DurationInDays>
 * ```
 */
const DurationInDays = React.forwardRef<HTMLElement, DurationInDaysProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.DurationInDays>
        {({ durationInDays, isSelfPaced }) => {
          const dataAttributes = {
            'data-testid': TestIds.programDuration,
            'data-type': isSelfPaced ? 'self-paced' : 'time-limited',
          };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              customElement={children}
              customElementProps={{ durationInDays, isSelfPaced }}
              content={durationInDays}
              {...dataAttributes}
              {...otherProps}
            >
              <div>{durationInDays}</div>
            </AsChildSlot>
          );
        }}
      </CoreProgram.DurationInDays>
    );
  },
);

DurationInDays.displayName = 'Program.DurationInDays';

/**
 * Props for Program Price component
 */
interface PriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedPrice: string; // combine price and currency together
    price: string;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the program price with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage - formatted price or null
 * <Program.Price className="text-3xl font-bold text-content-primary" />
 *
 * // asChild with primitive
 * <Program.Price asChild>
 *   <span className="text-3xl font-bold text-content-primary" />
 * </Program.Price>
 *
 * // With custom formatting
 * <Program.Price asChild>
 *   {React.forwardRef(({ value, currency, ...props }, ref) => (
 *     <div ref={ref} {...props} className="flex items-baseline gap-2">
 *       <span className="text-2xl font-bold">{value}</span>
 *       <span className="text-sm text-content-secondary">{currency}</span>
 *     </div>
 *   ))}
 * </Program.Price>
 *
 * // With free program handling
 * <Program.Price asChild>
 *   {React.forwardRef(({ price, formattedPrice, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-2xl font-bold text-brand-primary">
 *       {price ? formattedPrice : 'Free'}
 *     </span>
 *   ))}
 * </Program.Price>
 * ```
 */
const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreProgram.Price>
      {({ price, formattedPrice, currency }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.programPrice}
            customElement={children}
            customElementProps={{
              formattedPrice,
              price,
              currency,
            }}
            content={formattedPrice}
            {...otherProps}
          >
            <span>{formattedPrice}</span>
          </AsChildSlot>
        );
      }}
    </CoreProgram.Price>
  );
});

Price.displayName = 'Program.Price';

/**
 * Props for Program Description component
 */
interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the program description text with customizable rendering.
 * Data source: program.description.details
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Description className="text-content-secondary" />
 *
 * // asChild with primitive
 * <Program.Description asChild>
 *   <p className="text-content-secondary" />
 * </Program.Description>
 *
 * // Custom rendering
 * <Program.Description asChild>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-content-secondary">
 *       {description}
 *     </p>
 *   ))}
 * </Program.Description>
 * ```
 */
const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.Description>
        {({ description }) => {
          const dataAttributes = {
            'data-testid': TestIds.programDescription,
          };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              customElement={children}
              customElementProps={{ description }}
              content={description}
              {...dataAttributes}
              {...otherProps}
            >
              <p>{description}</p>
            </AsChildSlot>
          );
        }}
      </CoreProgram.Description>
    );
  },
);

Description.displayName = 'Program.Description';

/**
 * Props for Program StepCount component
 */
interface StepCountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ stepCount: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the program steps count with customizable rendering.
 * Data source: program.contentSummary.stepCount
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.StepCount className="text-content-secondary" />
 *
 * // asChild with primitive
 * <Program.StepCount asChild>
 *   <p className="text-content-secondary" />
 * </Program.StepCount>
 *
 * // Custom rendering
 * <Program.StepCount asChild>
 *   {React.forwardRef(({ stepCount, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-content-secondary">
 *       {stepCount} Steps
 *     </p>
 *   ))}
 * </Program.StepCount>
 * ```
 */
const StepCount = React.forwardRef<HTMLElement, StepCountProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.StepCount>
        {({ stepCount }) => {
          const dataAttributes = {
            'data-testid': TestIds.programStepCount,
          };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              customElement={children}
              customElementProps={{ stepCount }}
              content={stepCount}
              {...dataAttributes}
              {...otherProps}
            >
              <p>{stepCount}</p>
            </AsChildSlot>
          );
        }}
      </CoreProgram.StepCount>
    );
  },
);

StepCount.displayName = 'Program.StepCount';

/**
 * Props for Program SectionCount component
 */
interface SectionCountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ sectionCount: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the program section count with customizable rendering.
 * Data source: program.contentSummary.sectionCount
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.SectionCount className="text-content-secondary" />
 *
 * // asChild with primitive
 * <Program.SectionCount asChild>
 *   <p className="text-content-secondary" />
 * </Program.SectionCount>
 *
 * // Custom rendering
 * <Program.SectionCount asChild>
 *   {React.forwardRef(({ sectionCount, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-content-secondary">
 *       {sectionCount} Sections
 *     </p>
 *   ))}
 * </Program.SectionCount>
 * ```
 */
const SectionCount = React.forwardRef<HTMLElement, SectionCountProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.SectionCount>
        {({ sectionCount }) => {
          const dataAttributes = {
            'data-testid': TestIds.programSectionCount,
          };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              customElement={children}
              customElementProps={{ sectionCount }}
              content={sectionCount}
              {...dataAttributes}
              {...otherProps}
            >
              <div>{sectionCount}</div>
            </AsChildSlot>
          );
        }}
      </CoreProgram.SectionCount>
    );
  },
);

SectionCount.displayName = 'Program.SectionCount';

/**
 * Props for Program Instructors component (Container Level)
 */
interface InstructorsProps {
  emptyState?: React.ReactNode;
  /** Optional instructors data to use instead of fetching */
  instructors?: instructors.Instructor[];
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ instructors: instructors.Instructor[]; hasInstructors: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Container component for program instructors that provides context and conditional rendering.
 * Does NOT render if there are no instructors (follows Container Level pattern).
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Instructors instructors={instructors}>
 *     <Program.InstructorRepeater>
 *       <Instructor.Name />
 *       <Instructor.Description />
 *     </Program.InstructorRepeater>
 * </Program.Instructors>
 *
 * // asChild with primitive
 * <Program.Instructors asChild>
 *   <div className="instructors-grid" />
 * </Program.Instructors>
 *
 * // Custom rendering with render props
 * <Program.Instructors asChild>
 *   {React.forwardRef(({ instructors, hasInstructors, ...props }, ref) => (
 *     <div ref={ref} {...props} className="instructors-container">
 *       {hasInstructors ? (
 *         instructors.map(instructor => (
 *           <div key={instructor._id}>{instructor.name}</div>
 *         ))
 *       ) : (
 *         <div>No instructors</div>
 *       )}
 *     </div>
 *   ))}
 * </Program.Instructors>
 * ```
 */
const Instructors = React.forwardRef<
  HTMLDivElement,
  InstructorsProps
>((props, ref) => {
  const { asChild, children, instructors = [], emptyState, ...otherProps } = props;

  return (
    <CoreProgram.Instructors instructorsServiceConfig={{ instructors }}>
      {({ instructors, hasInstructors }) => {
        if (!hasInstructors) {
          return emptyState;
        }

        return (
          <AsChildSlot
            asChild={asChild}
            customElement={children}
            customElementProps={{ instructors, hasInstructors }}
            ref={ref}
            data-testid={TestIds.programInstructors}
            {...otherProps}
          >
            {children}
          </AsChildSlot>
        );
      }}
    </CoreProgram.Instructors>
  );
});

Instructors.displayName = 'Program.Instructors';

/**
 * Props for Program InstructorRepeater component (Repeater Level)
 */
interface InstructorRepeaterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Children to render for each instructor */
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Repeater component that renders children for each instructor.
 * Maps over instructors and renders Instructor.Root for each.
 *
 * @component
 * @example
 * ```tsx
 * // With React elements
 * <Program.InstructorRepeater>
 *   <Instructor.Name />
 *   <Instructor.Description />
 * </Program.InstructorRepeater>
 *
 * // With custom wrapper
 * <Program.InstructorRepeater>
 *   <div className="instructor-card">
 *     <Instructor.Name />
 *     <Instructor.Description />
 *   </div>
 * </Program.InstructorRepeater>
 * ```
 */
const InstructorRepeater = React.forwardRef<
  HTMLElement,
  InstructorRepeaterProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  const service = useService(InstructorsServiceDefinition);
  const instructors = service.instructors.get();

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.programInstructorRepeater}
      customElement={children}
      customElementProps={{}}
      {...otherProps}
    >
      <div>
        {instructors.map((instructor: instructors.Instructor, index: number) => {
          return (
            <Instructor.Root
              key={instructor.userId || index}
              instructor={instructor}
            >
              {children}
            </Instructor.Root>
          );
        })}
      </div>
    </AsChildSlot>
  );
});

InstructorRepeater.displayName = 'Program.InstructorRepeater';

/**
 * Compound component for Program with all sub-components
 */
export const Program = {
  Root,
  Title,
  Image,
  DurationInDays,
  Price,
  Description,
  StepCount,
  SectionCount,
  Instructors,
  InstructorRepeater,
} as const;
