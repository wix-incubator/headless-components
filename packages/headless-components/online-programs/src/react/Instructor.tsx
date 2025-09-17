import React from 'react';
import { instructors } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

interface InstructorContextValue {
  instructor: instructors.Instructor;
}

const InstructorContext = React.createContext<InstructorContextValue | null>(
  null,
);

function useInstructorContext(): InstructorContextValue {
  const context = React.useContext(InstructorContext);

  if (!context) {
    throw new Error(
      'useInstructorContext must be used within a Instructor.Root component',
    );
  }

  return context;
}

enum TestIds {
  instructor = 'program-instructor',
  instructorName = 'program-instructor-name',
  instructorDescription = 'program-instructor-description',
  instructorImage = 'program-instructor-image',
}

/**
 * Props for the Instructor root component following the documented API
 */
interface InstructorRootProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Children to render within the instructor context */
  children?: React.ReactNode;
  /** Instructor data - passed from InstructorRepeater or provided directly */
  instructor: instructors.Instructor;
}

/**
 * Root component that provides all necessary service contexts for a complete instructor experience.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Instructor } from '@wix/online-programs/components';
 *
 * function InstructorCard({ instructor }) {
 *   return (
 *     <Instructor.Root instructor={instructor}>
 *       <Instructor.Name />
 *       <Instructor.Description />
 *     </Instructor.Root>
 *   );
 * }
 * ```
 */
function Root(props: InstructorRootProps): React.ReactNode {
  const { asChild, children, instructor } = props;

  return (
    <InstructorContext.Provider value={{ instructor }}>
      <AsChildSlot
        asChild={asChild}
        data-testid={TestIds.instructor}
        customElement={children}
        customElementProps={{ instructor }}
        content={instructor.name}
      >
        <div>{children}</div>
      </AsChildSlot>
    </InstructorContext.Provider>
  );
}

/**
 * Props for Instructor.Name component
 */
interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string; slug?: string | null }>;
}

/**
 * Displays the instructor name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Instructor.Name />
 *
 * // asChild with primitive
 * <Instructor.Name asChild>
 *   <p />
 * </Instructor.Name>
 *
 * // asChild with React component
 * <Instructor.Name asChild>
 *   {React.forwardRef(({ name, slug }, ref) => (
 *     <p ref={ref}>
 *       {name}
 *     </p>
 *   ))}
 * </Instructor.Name>
 * ```
 */
const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children } = props;

  const { instructor } = useInstructorContext();

  const name = instructor.name || '';
  const slug = instructor.slug || null;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      data-testid={TestIds.instructorName}
      customElement={children}
      customElementProps={{ name, slug }}
      content={name}
    >
      <p>{name}</p>
    </AsChildSlot>
  );
});

Name.displayName = 'Instructor.Name';

/**
 * Props for Instructor.Description component
 */
interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
}

/**
 * Displays the instructor description with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Instructor.Description />
 *
 * // asChild with primitive
 * <Instructor.Description asChild>
 *   <ps />
 * </Instructor.Description>
 *
 * // asChild with React component
 * <Instructor.Description asChild>
 *   {React.forwardRef(({ description }, ref) => (
 *     <p ref={ref}>
 *       {description}
 *     </p>
 *   ))}
 * </Instructor.Description>
 * ```
 */
const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const { instructor } = useInstructorContext();

    const description = instructor.description || '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        data-testid={TestIds.instructorDescription}
        customElement={children}
        customElementProps={{ description }}
        content={description}
      >
        <p>{description}</p>
      </AsChildSlot>
    );
  },
);

Description.displayName = 'Instructor.Description';

/**
 * Props for Instructor.Image component
 */
interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    src: string;
    altText: string;
  }>;
}

/**
 * Displays the instructor's profile photo with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Instructor.Image />
 *
 * // asChild with primitive
 * <Instructor.Image asChild>
 *   <img />
 * </Instructor.Image>
 *
 * // asChild with React component
 * <Instructor.Image asChild>
 *   {React.forwardRef(({ src, altText }, ref) => (
 *     <img
 *       ref={ref}
 *       src={src}
 *       alt={altText}
 *     />
 *   ))}
 * </Instructor.Image>
 * ```
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { instructor } = useInstructorContext();

  if (!instructor.photo) {
    return null;
  }

  const src = instructor.photo.url || '';
  const altText = instructor.photoAltText || '';

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.instructorImage}
      customElement={children}
      customElementProps={{
        src,
        altText,
      }}
    >
      <img src={src} alt={altText} />
    </AsChildSlot>
  );
});

Image.displayName = 'Instructor.Image';

/**
 * Compound component for Instructor with all sub-components
 */
export const Instructor = {
  Root,
  Name,
  Description,
  Image,
} as const;
