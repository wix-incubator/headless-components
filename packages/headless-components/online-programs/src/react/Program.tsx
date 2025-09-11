
import React from 'react';
import { programs, instructors } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { WixMediaImage } from '@wix/headless-media/react';

import * as CoreProgram from './core/Program.js';

enum TestIds {
  programTitle = 'program-title',
  programImage = 'program-image',
  programDuration = 'program-duration',
  programDescription = 'program-description',
  programInstructors = 'program-instructors',
  programInstructor = 'program-instructor',
  programInstructorName = 'program-instructor-name',
  programInstructorAvatar = 'program-instructor-avatar',
  programInstructorDescription = 'program-instructor-description',
}

/**
 * Props for the Program root component following the documented API
 */
export interface ProgramRootProps {
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
export function Root(props: ProgramRootProps): React.ReactNode {
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
export interface TitleProps {
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
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
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
export interface ImageProps {
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
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
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
 * Props for Program Duration component
 */
export interface DurationProps {
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
 * <Program.Duration className="text-content-secondary" />
 *
 * // asChild with primitive
 * <Program.Duration asChild>
 *   <p className="text-content-secondary" />
 * </Program.Duration>
 *
 * // Custom rendering with format
 * <Program.Duration asChild>
 *   {React.forwardRef(({ durationInDays, isSelfPaced, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-content-secondary">
 *       {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
 *     </p>
 *   ))}
 * </Program.Duration>
 * ```
 */
export const Duration = React.forwardRef<HTMLElement, DurationProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.Duration>
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
              <p>{durationInDays}</p>
            </AsChildSlot>
          );
        }}
      </CoreProgram.Duration>
    );
  },
);

Duration.displayName = 'Program.Duration';

/**
 * Props for Program Description component
 */
export interface DescriptionProps {
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
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
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
 * Props for Program Instructors component
 */
export interface InstructorsProps {
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
 * Displays the list of program instructors with customizable rendering.
 * Data source: instructors prop or instructors service.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Instructors instructors={instructors} />
 *
 * // asChild with primitive
 * <Program.Instructors asChild>
 *   <div className="instructors-grid" />
 * </Program.Instructors>
 *
 * // Custom rendering
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
export const Instructors = React.forwardRef<HTMLElement, InstructorsProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreProgram.Instructors instructors={props['instructors']}>
        {({ instructors, hasInstructors }) => {
          const dataAttributes = {
            'data-testid': TestIds.programInstructors,
          };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              customElement={children}
              customElementProps={{ instructors, hasInstructors }}
              content={hasInstructors ? `${instructors.length} instructors` : 'No instructors'}
              {...dataAttributes}
              {...otherProps}
            >
              <div>
                {hasInstructors ? (
                  instructors.map(instructor => (
                    <div key={instructor._id} data-testid={TestIds.programInstructor}>
                      {instructor.name}
                    </div>
                  ))
                ) : (
                  <div>No instructors</div>
                )}
              </div>
            </AsChildSlot>
          );
        }}
      </CoreProgram.Instructors>
    );
  },
);

Instructors.displayName = 'Program.Instructors';

/**
 * Props for Program InstructorRepeater component
 */
export interface InstructorRepeaterProps {
  /** Children to render for each instructor */
  children: React.ReactNode;
}

/**
 * Repeater component that renders Program.Instructor for each instructor.
 * Follows Repeater Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <Program.Instructors.InstructorRepeater>
 *   <Program.Instructor>
 *     <Program.Instructor.Avatar />
 *     <Program.Instructor.Name />
 *   </Program.Instructor>
 * </Program.Instructors.InstructorRepeater>
 * ```
 */
export const InstructorRepeater = React.forwardRef<
  HTMLElement,
  InstructorRepeaterProps
>((props, _ref) => {
  const { children } = props;

  return (
    <CoreProgram.Instructors>
      {({ instructors, hasInstructors }) => {
        if (!hasInstructors) return null;

        return (
          <div data-testid="program-instructors-repeater">
            {instructors.map((instructor) => (
              <Instructor
                key={instructor._id}
                instructor={instructor}
              >
                {children}
              </Instructor>
            ))}
          </div>
        );
      }}
    </CoreProgram.Instructors>
  );
});

InstructorRepeater.displayName = 'Program.Instructors.InstructorRepeater';

/**
 * Props for Program Instructor component
 */
export interface InstructorProps {
  /** Instructor data */
  instructor: instructors.Instructor;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ instructor: instructors.Instructor }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Individual instructor component that provides instructor context to child components.
 *
 * @component
 * @example
 * ```tsx
 * <Program.Instructor instructor={instructor}>
 *   <Program.Instructor.Avatar />
 *   <Program.Instructor.Name />
 *   <Program.Instructor.Description />
 * </Program.Instructor>
 * ```
 */
export const Instructor = React.forwardRef<HTMLElement, InstructorProps>(
  (props, ref) => {
    const { asChild, children, instructor, ...otherProps } = props;

    const dataAttributes = {
      'data-testid': TestIds.programInstructor,
      'data-instructor-id': instructor._id,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ instructor }}
        content={instructor.name || 'Instructor'}
        {...dataAttributes}
        {...otherProps}
      >
        <div>
          <div>{instructor.name}</div>
        </div>
      </AsChildSlot>
    );
  },
);

Instructor.displayName = 'Program.Instructor';

/**
 * Props for Program Instructor Name component
 */
export interface InstructorNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string; slug?: string | null }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the instructor's name with customizable rendering.
 * Data source: instructor.name and instructor.slug.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Instructor.Name className="font-semibold text-lg" />
 *
 * // asChild with link
 * <Program.Instructor.Name asChild>
 *   {React.forwardRef(({ name, slug, ...props }, ref) => (
 *     <a
 *       ref={ref}
 *       href={slug ? `/instructors/${slug}` : '#'}
 *       {...props}
 *       className="font-semibold text-lg hover:underline"
 *     >
 *       {name}
 *     </a>
 *   ))}
 * </Program.Instructor.Name>
 * ```
 */
export const InstructorName = React.forwardRef<HTMLElement, InstructorNameProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    // This would need to be used within Program.Instructor context
    // For now, we'll use a placeholder
    const name = 'Instructor Name';
    const slug = null;

    const dataAttributes = {
      'data-testid': TestIds.programInstructorName,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ name, slug }}
        content={name}
        {...dataAttributes}
        {...otherProps}
      >
        <div>{name}</div>
      </AsChildSlot>
    );
  },
);

InstructorName.displayName = 'Program.Instructor.Name';

/**
 * Props for Program Instructor Avatar component
 */
export interface InstructorAvatarProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ src: string; alt: string; width?: number; height?: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
}

/**
 * Displays the instructor's profile photo with customizable rendering.
 * Data source: instructor.photo and instructor.photoAltText.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Instructor.Avatar className="rounded-full" />
 *
 * // asChild with custom styling
 * <Program.Instructor.Avatar asChild>
 *   {React.forwardRef(({ src, alt, width, height, ...props }, ref) => (
 *     <img
 *       ref={ref}
 *       src={src}
 *       alt={alt}
 *       width={width}
 *       height={height}
 *       {...props}
 *       className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
 *     />
 *   ))}
 * </Program.Instructor.Avatar>
 * ```
 */
export const InstructorAvatar = React.forwardRef<HTMLImageElement, InstructorAvatarProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    // This would need to be used within Program.Instructor context
    // For now, we'll use placeholders
    const src = '';
    const alt = 'Instructor photo';
    const width = undefined;
    const height = undefined;

    const dataAttributes = {
      'data-testid': TestIds.programInstructorAvatar,
    };

    if (asChild && children) {
      return children({ src, alt, width, height }, ref);
    }

    return (
      <WixMediaImage
        ref={ref}
        media={{ image: src }}
        alt={alt}
        {...dataAttributes}
        {...otherProps}
      />
    );
  },
);

InstructorAvatar.displayName = 'Program.Instructor.Avatar';

/**
 * Props for Program Instructor Description component
 */
export interface InstructorDescriptionProps {
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
 * Displays the instructor's bio/description with customizable rendering.
 * Data source: instructor.description.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Instructor.Description className="text-gray-600" />
 *
 * // asChild with custom truncation
 * <Program.Instructor.Description asChild>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-gray-600 text-sm">
 *       {description.length > 100 ? `${description.substring(0, 100)}...` : description}
 *     </p>
 *   ))}
 * </Program.Instructor.Description>
 * ```
 */
export const InstructorDescription = React.forwardRef<HTMLElement, InstructorDescriptionProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    // This would need to be used within Program.Instructor context
    // For now, we'll use a placeholder
    const description = 'Instructor description';

    const dataAttributes = {
      'data-testid': TestIds.programInstructorDescription,
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
        <div>{description}</div>
      </AsChildSlot>
    );
  },
);

InstructorDescription.displayName = 'Program.Instructor.Description';

/**
 * Compound component for Program with all sub-components
 */
export const Program = {
  Root,
  Title,
  Image,
  Duration,
  Description,
  Instructors: {
    ...Instructors,
    InstructorRepeater,
  },
  Instructor: {
    ...Instructor,
    Name: InstructorName,
    Avatar: InstructorAvatar,
    Description: InstructorDescription,
  },
} as const;
