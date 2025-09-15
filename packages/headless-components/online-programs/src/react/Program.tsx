import React from 'react';
import { useService } from '@wix/services-manager-react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { WixMediaImage } from '@wix/headless-media/react';
import { programs, instructors } from '@wix/online-programs';

import * as CoreProgram from './core/Program.js';
import { Instructor } from './Instructor.js';
import { InstructorsServiceDefinition } from '../services/instructors-service.js';

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
  programRaw = 'program-raw',
  programId = 'program-id',
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
  const { children, program } = props;

  return (
    <CoreProgram.Root programServiceConfig={{ program }}>
      {children}
    </CoreProgram.Root>
  );
}

/**
 * Props for Program.Raw component
 */
interface RawProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    program: programs.Program;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Provides direct access to program data. Should be used only in rare cases and never by Wix implementations.
 *
 * @component
 * @example
 * ```tsx
 * // asChild with React component
 * <Program.Raw asChild>
 *   {React.forwardRef(({ program }, ref) => (
 *     <div ref={ref}>
 *       <span>Program ID: {program._id}</span>
 *       <span>Title: {program.description?.title || 'No title'}</span>
 *       <span>Price: {program.price?.value || 'No price'}</span>
 *     </div>
 *   ))}
 * </Program.Raw>
 * ```
 */
const Raw = React.forwardRef<HTMLElement, RawProps>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <CoreProgram.Raw>
      {({ program }) => {
        // Raw component should not render anything by default when not using asChild
        if (!asChild || !children) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.programRaw}
            customElement={children}
            customElementProps={{ program }}
          />
        );
      }}
    </CoreProgram.Raw>
  );
});

Raw.displayName = 'Program.Raw';

/**
 * Props for Program.Id component
 */
interface IdProps {
  asChild?: boolean;
  children?: AsChildChildren<{ id: string }>;
  className?: string;
}

/**
 * Displays the program ID with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Id />
 *
 * // asChild with React component
 * <Program.Id asChild>
 *   {React.forwardRef(({ id }, ref) => (
 *     <a ref={ref} href={`/program/${id}`}>
 *       View Program
 *     </a>
 *   ))}
 * </Program.Id>
 * ```
 */
const Id = React.forwardRef<HTMLElement, IdProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreProgram.Id>
      {({ id }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.programId}
            customElement={children}
            customElementProps={{ id }}
            content={id}
            {...otherProps}
          >
            <span>{id}</span>
          </AsChildSlot>
        );
      }}
    </CoreProgram.Id>
  );
});

Id.displayName = 'Program.Id';

/**
 * Props for Program.Title component
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
  const { asChild, children } = props;

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
 * Props for Program.Description component
 */
interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the program description text with customizable rendering.
 * Data source: program.description.details
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Description />
 *
 * // asChild with primitive
 * <Program.Description asChild>
 *   <p />
 * </Program.Description>
 *
 * // Custom rendering
 * <Program.Description asChild>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props}>
 *       {description}
 *     </p>
 *   ))}
 * </Program.Description>
 * ```
 */
const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreProgram.Description>
        {({ description }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.programDescription}
              customElement={children}
              customElementProps={{ description }}
              content={description}
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
 * Props for Program.Image component
 */
interface ImageProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ src: string; alt: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
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
 * // asChild with React component
 * <Program.Image asChild>
 *   {React.forwardRef(({ src, alt }, ref) => (
 *     <img ref={ref} src={src} alt={alt} />
 *   ))}
 * </Program.Image>
 * ```
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
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
});

Image.displayName = 'Program.Image';

/**
 * Props for Program.DurationInDays component
 */
interface DurationInDaysProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    durationInDays: number | null;
    isSelfPaced: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the program duration in days with customizable rendering.
 * Data source: program.timeline field. If the program is self-paced, duration has no limit.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.DurationInDays />
 *
 * // asChild with primitive
 * <Program.DurationInDays asChild>
 *   <p />
 * </Program.DurationInDays>
 *
 * // asChild with React component
 * <Program.DurationInDays asChild>
 *   {React.forwardRef(({ durationInDays, isSelfPaced, ...props }, ref) => (
 *     <p ref={ref} {...props}>
 *       {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
 *     </p>
 *   ))}
 * </Program.DurationInDays>
 * ```
 */
const DurationInDays = React.forwardRef<HTMLElement, DurationInDaysProps>(
  (props, ref) => {
    const { asChild, children } = props;

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
 * Props for Program.Price component
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
}

/**
 * Displays the program price with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Price />
 *
 * // asChild with primitive
 * <Program.Price asChild>
 *   <span />
 * </Program.Price>
 *
 * // asChild with React component
 * <Program.Price asChild>
 *   {React.forwardRef(({ price, currency }, ref) => (
 *     <div ref={ref}>
 *       <span>{price}</span>
 *       <span>{currency}</span>
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
  const { asChild, children, className } = props;

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
 * Props for Program.StepCount component
 */
interface StepCountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ stepCount: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
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
 * // asChild with React component
 * <Program.StepCount asChild>
 *   {React.forwardRef(({ stepCount }, ref) => (
 *     <p ref={ref}>
 *       {stepCount} Steps
 *     </p>
 *   ))}
 * </Program.StepCount>
 * ```
 */
const StepCount = React.forwardRef<HTMLElement, StepCountProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreProgram.StepCount>
        {({ stepCount }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.programStepCount}
              customElement={children}
              customElementProps={{ stepCount }}
              content={stepCount}
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
 * Props for Program.SectionCount component
 */
interface SectionCountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ sectionCount: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the program section count with customizable rendering.
 * Data source: program.contentSummary.sectionCount
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.SectionCount />
 *
 * // asChild with primitive
 * <Program.SectionCount asChild>
 *   <p />
 * </Program.SectionCount>
 *
 * // asChild with React component
 * <Program.SectionCount asChild>
 *   {React.forwardRef(({ sectionCount }, ref) => (
 *     <p ref={ref}>
 *       {sectionCount} Sections
 *     </p>
 *   ))}
 * </Program.SectionCount>
 * ```
 */
const SectionCount = React.forwardRef<HTMLElement, SectionCountProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreProgram.SectionCount>
        {({ sectionCount }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.programSectionCount}
              customElement={children}
              customElementProps={{ sectionCount }}
              content={sectionCount}
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
 * Props for Program.Instructors component
 */
interface InstructorsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    instructors: instructors.Instructor[];
    hasInstructors: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Optional instructors data to use instead of fetching */
  instructors?: instructors.Instructor[];
  /** Content to show when there are no instructors */
  emptyState?: React.ReactNode;
}

/**
 * Displays the program instructors with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Instructors instructors={instructors}>
 *  <Program.InstructorRepeater>
 *    <Instructor.Name />
 *    <Instructor.Description />
 *  </Program.InstructorRepeater>
 * </Program.Instructors>
 * ```
 */
const Instructors = React.forwardRef<HTMLDivElement, InstructorsProps>(
  (props, ref) => {
    const { asChild, children, instructors = [], emptyState } = props;

    return (
      <CoreProgram.Instructors instructorsServiceConfig={{ instructors }}>
        {({ instructors }) => {
          if (!instructors.length) {
            return emptyState || null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              data-testid={TestIds.programInstructors}
              customElement={children}
              customElementProps={{ instructors }}
            >
              {children}
            </AsChildSlot>
          );
        }}
      </CoreProgram.Instructors>
    );
  },
);

Instructors.displayName = 'Program.Instructors';

/**
 * Props for Program.InstructorRepeater component
 */
interface InstructorRepeaterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Children to render for each instructor */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
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
  const { asChild, children, className } = props;

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
    >
      <div>
        {instructors.map(
          (instructor: instructors.Instructor, index: number) => {
            return (
              <Instructor.Root
                key={instructor.userId || index}
                instructor={instructor}
              >
                {children}
              </Instructor.Root>
            );
          },
        )}
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
  Raw,
  Id,
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
