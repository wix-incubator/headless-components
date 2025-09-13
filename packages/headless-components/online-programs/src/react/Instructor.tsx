import React from 'react';
import { instructors } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
// import { WixMediaImage } from '@wix/headless-media/react';

interface InstructorContextValue {
  instructor: instructors.Instructor;
}

const InstructorContext = React.createContext<InstructorContextValue | null>(null);

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
  instructor = 'instructor',
  instructorName = 'instructor-name',
  instructorDescription = 'instructor-description',
  instructorImage = 'instructor-image',
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
 *       <Instructor.Name className="text-4xl font-bold" />
 *       <Instructor.Description className="text-content-secondary" />
 *     </Instructor.Root>
 *   );
 * }
 * ```
 */
function Root(props: InstructorRootProps): React.ReactNode {
  const { asChild, children, instructor, ...otherProps } = props;

  const dataAttributes = {
    'data-testid': TestIds.instructor,
    'data-instructor-id': instructor.userId,
  };

  return (
    <InstructorContext.Provider value={{ instructor }}>
      <AsChildSlot
        asChild={asChild}
        customElement={children}
        customElementProps={{ instructor }}
        {...dataAttributes}
        {...otherProps}
      >
        {children}
      </AsChildSlot>
    </InstructorContext.Provider>
  );
}

/**
 * Props for Instructor Name component
 */
interface NameProps {
  /** Instructor data - can be provided directly or from context */
  instructor?: instructors.Instructor;
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
 * <Instructor.Name instructor={instructor} className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Instructor.Name instructor={instructor} asChild>
 *   <p className="text-4xl font-bold" />
 * </Instructor.Name>
 *
 * // asChild with react component
 * <Instructor.Name instructor={instructor} asChild>
 *   {React.forwardRef(({ name, slug, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-4xl font-bold">
 *       {name}
 *     </p>
 *   ))}
 * </Instructor.Name>
 * ```
 */
const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, instructor: propInstructor, ...otherProps } = props;

  // Use provided instructor or get from context
  const contextInstructor = useInstructorContext();
  const instructor = propInstructor || contextInstructor?.instructor;

  if (!instructor) {
    throw new Error('Instructor.Name must be used within an Instructor.Root component or have instructor prop provided');
  }

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
      {...otherProps}
    >
      <p>{name}</p>
    </AsChildSlot>
  );
});

Name.displayName = 'Instructor.Name';

/**
 * Props for Instructor Description component
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
 * <Instructor.Description className="text-content-secondary" />
 *
 * // asChild with primitive
 * <Instructor.Description asChild>
 *   <p className="text-content-secondary" />
 * </Instructor.Description>
 *
 * // asChild with react component
 * <Instructor.Description asChild>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-content-secondary">
 *       {description}
 *     </p>
 *   ))}
 * </Instructor.Description>
 * ```
 */
const Description = React.forwardRef<HTMLElement, DescriptionProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
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
      {...otherProps}
    >
      <p>{description}</p>
    </AsChildSlot>
  );
});

Description.displayName = 'Instructor.Description';

/**
 * Props for Instructor Image component
 */
interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
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
 * <Instructor.Image className="w-16 h-16 rounded-full object-cover" />
 *
 * // asChild with primitive
 * <Instructor.Image asChild>
 *   <img className="w-16 h-16 rounded-full object-cover" />
 * </Instructor.Image>
 *
 * // asChild with react component
 * <Instructor.Image asChild>
 *   {React.forwardRef(({ src, altText, ...props }, ref) => (
 *     <img
 *       ref={ref}
 *       src={src}
 *       alt={altText}
 *       {...props}
 *       className="w-16 h-16 rounded-full object-cover"
 *     />
 *   ))}
 * </Instructor.Image>
 * ```
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const { instructor } = useInstructorContext();

  // Return null if no photo is available
  if (!instructor.photo) {
    return null;
  }

  const src = instructor.photo.url || '';
  const altText = instructor.photoAltText || '';

  const attributes = {
    'data-testid': TestIds.instructorImage,
  };

  return (
    <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{
          src,
          altText,
        }}
      >
        <img
          src={src}
          alt={altText}
          {...otherProps}
        />
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
